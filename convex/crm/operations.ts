import { ConvexError, v } from "convex/values";
import { mutation, query } from "../_generated/server";
import type { Doc, Id } from "../_generated/dataModel";
import { jobStatus, resourceKind, timeSlot } from "../schema";
import { compact, num, requireStaff, requireStaffMutation, text } from "./session";
import { setLeadStatus } from "./leads";

// ─────────────────────────────── Resources ───────────────────────────────

export const listResources = query({
  args: { token: v.string(), includeInactive: v.optional(v.boolean()) },
  handler: async (ctx, args) => {
    await requireStaff(ctx, args.token);
    if (args.includeInactive) return await ctx.db.query("resources").take(500);
    return await ctx.db
      .query("resources")
      .withIndex("by_active", (q) => q.eq("active", true))
      .take(500);
  },
});

const resourceFields = {
  name: v.string(),
  kind: resourceKind,
  phone: v.string(),
  email: v.optional(v.string()),
  abn: v.optional(v.string()),
  truckSize: v.optional(v.string()),
  crewSize: v.optional(v.number()),
  hourlyCost: v.optional(v.number()),
  notes: v.optional(v.string()),
  active: v.boolean(),
};

function cleanResource(r: {
  name: string;
  kind: Doc<"resources">["kind"];
  phone: string;
  email?: string;
  abn?: string;
  truckSize?: string;
  crewSize?: number;
  hourlyCost?: number;
  notes?: string;
  active: boolean;
}) {
  if (!r.name.trim()) throw new ConvexError("Name is required.");
  return {
    name: text(r.name, 120),
    kind: r.kind,
    phone: text(r.phone, 40),
    email: r.email ? text(r.email, 200) : undefined,
    abn: r.abn ? text(r.abn, 30) : undefined,
    truckSize: r.truckSize ? text(r.truckSize, 40) : undefined,
    crewSize: r.crewSize === undefined ? undefined : num(r.crewSize, 0, 50),
    hourlyCost: r.hourlyCost === undefined ? undefined : num(r.hourlyCost, 0, 10000),
    notes: r.notes ? text(r.notes, 1000) : undefined,
    active: r.active,
  };
}

export const saveResource = mutation({
  args: { token: v.string(), resourceId: v.optional(v.id("resources")), ...resourceFields },
  returns: v.id("resources"),
  handler: async (ctx, args) => {
    await requireStaffMutation(ctx, args.token, ["operations"]);
    const { resourceId } = args;
    const clean = cleanResource(args);
    if (resourceId) {
      await ctx.db.replace("resources", resourceId, compact(clean));
      return resourceId;
    }
    return await ctx.db.insert("resources", compact(clean));
  },
});

// ───────────────────────────────── Jobs ─────────────────────────────────

/** Scheduling defaults for a lead without a live job, or null if it already has one. */
async function schedulingRow(ctx: { db: import("../_generated/server").QueryCtx["db"] }, lead: Doc<"quoteRequests">) {
  const jobs = await ctx.db
    .query("jobs")
    .withIndex("by_leadId", (q) => q.eq("leadId", lead._id))
    .take(10);
  if (jobs.some((j) => j.status !== "cancelled")) return null;
  const estimate = await ctx.db
    .query("estimates")
    .withIndex("by_leadId", (q) => q.eq("leadId", lead._id))
    .order("desc")
    .first();
  return {
    leadId: lead._id,
    reference: lead.reference ?? null,
    status: lead.crmStatus ?? "new",
    name: lead.name,
    phone: lead.phone,
    moveDate: lead.moveDate,
    movingFrom: lead.movingFrom,
    movingTo: lead.movingTo ?? "",
    bedrooms: lead.stepTwo?.bedrooms ?? null,
    preferredTime: lead.stepTwo?.preferredTime ?? null,
    estimateId: estimate?._id ?? null,
    crewSize: estimate?.labour.crewSize ?? 2,
    trucks: estimate?.labour.trucks ?? 1,
    truckSize: estimate?.labour.truckSize ?? "",
    estimatedHours: estimate?.labour.estimatedHours ?? 3,
    timeSlot: estimate?.moveInfo.timeSlot ?? null,
  };
}

/** Booked leads with no live job yet — the "Ready to schedule" inbox. */
export const readyToSchedule = query({
  args: { token: v.string() },
  handler: async (ctx, args) => {
    await requireStaff(ctx, args.token);
    const booked = await ctx.db
      .query("quoteRequests")
      .withIndex("by_crmStatus", (q) => q.eq("crmStatus", "booked"))
      .order("desc")
      .take(300);
    const out = [];
    for (const lead of booked) {
      const row = await schedulingRow(ctx, lead);
      if (row) out.push(row);
    }
    return out;
  },
});

/**
 * Any open lead (not lost) without a live job — so ops can assign a trucker
 * or sub-contractor straight to a lead from the crew list or calendar.
 */
export const assignableLeads = query({
  args: { token: v.string() },
  handler: async (ctx, args) => {
    await requireStaff(ctx, args.token);
    const recent = await ctx.db.query("quoteRequests").order("desc").take(300);
    const out = [];
    for (const lead of recent) {
      if (lead.crmStatus === "lost") continue;
      const row = await schedulingRow(ctx, lead);
      if (row) out.push(row);
    }
    return out;
  },
});

/** Scheduling defaults for one lead (null if lost or it already has a live job). */
export const schedulingForLead = query({
  args: { token: v.string(), leadId: v.id("quoteRequests") },
  handler: async (ctx, args) => {
    await requireStaff(ctx, args.token);
    const lead = await ctx.db.get("quoteRequests", args.leadId);
    if (!lead || lead.crmStatus === "lost") return null;
    return await schedulingRow(ctx, lead);
  },
});

/** Live jobs a resource is on from a date onward (for the crew list). */
export const resourceJobs = query({
  args: { token: v.string(), from: v.string() },
  handler: async (ctx, args) => {
    await requireStaff(ctx, args.token);
    const jobs = await ctx.db
      .query("jobs")
      .withIndex("by_date", (q) => q.gte("date", args.from))
      .take(500);
    return jobs
      .filter((j) => j.status !== "cancelled" && j.status !== "completed")
      .map((j) => ({ _id: j._id, date: j.date, timeSlot: j.timeSlot, customerName: j.customerName, assigneeIds: j.assigneeIds }));
  },
});

/** Jobs between two dates inclusive (YYYY-MM-DD), for the schedule board. */
export const listJobs = query({
  args: { token: v.string(), from: v.string(), to: v.string() },
  handler: async (ctx, args) => {
    await requireStaff(ctx, args.token);
    return await ctx.db
      .query("jobs")
      .withIndex("by_date", (q) => q.gte("date", args.from).lte("date", args.to))
      .take(1000);
  },
});

const jobFields = {
  date: v.string(),
  timeSlot,
  startTime: v.optional(v.string()),
  status: jobStatus,
  assigneeIds: v.array(v.id("resources")),
  crewSize: v.number(),
  trucks: v.number(),
  truckSize: v.optional(v.string()),
  estimatedHours: v.number(),
  pickupAddress: v.string(),
  dropoffAddress: v.string(),
  opsNotes: v.optional(v.string()),
};

/**
 * Other live jobs on the same date + slot that already use one of these
 * resources. Returned as warnings, not errors — ops may double up on purpose.
 */
async function findConflicts(
  ctx: { db: import("../_generated/server").QueryCtx["db"] },
  date: string,
  slot: Doc<"jobs">["timeSlot"],
  assigneeIds: Id<"resources">[],
  ignoreJob?: Id<"jobs">,
) {
  if (assigneeIds.length === 0) return [];
  const sameDay = await ctx.db
    .query("jobs")
    .withIndex("by_date", (q) => q.eq("date", date))
    .take(200);
  const names: string[] = [];
  for (const j of sameDay) {
    if (j._id === ignoreJob || j.status === "cancelled" || j.timeSlot !== slot) continue;
    for (const id of j.assigneeIds) {
      if (assigneeIds.includes(id)) {
        const r = await ctx.db.get("resources", id);
        names.push(`${r?.name ?? "Resource"} is already on ${j.customerName}'s job`);
      }
    }
  }
  return names;
}

export const checkConflicts = query({
  args: {
    token: v.string(),
    date: v.string(),
    timeSlot,
    assigneeIds: v.array(v.id("resources")),
    jobId: v.optional(v.id("jobs")),
  },
  returns: v.array(v.string()),
  handler: async (ctx, args) => {
    await requireStaff(ctx, args.token);
    return await findConflicts(ctx, args.date, args.timeSlot, args.assigneeIds, args.jobId);
  },
});

function cleanJob(f: {
  date: string;
  timeSlot: Doc<"jobs">["timeSlot"];
  startTime?: string;
  status: Doc<"jobs">["status"];
  assigneeIds: Id<"resources">[];
  crewSize: number;
  trucks: number;
  truckSize?: string;
  estimatedHours: number;
  pickupAddress: string;
  dropoffAddress: string;
  opsNotes?: string;
}) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(f.date)) throw new ConvexError("Pick a job date.");
  if (f.assigneeIds.length > 20) throw new ConvexError("Too many assignees.");
  const assigneeIds = [...new Set(f.assigneeIds)];
  let status = f.status;
  // Keep status honest with assignment.
  if (assigneeIds.length === 0 && status === "assigned") status = "unassigned";
  if (assigneeIds.length > 0 && status === "unassigned") status = "assigned";
  return {
    date: f.date,
    timeSlot: f.timeSlot,
    startTime: f.startTime && /^\d{2}:\d{2}$/.test(f.startTime) ? f.startTime : undefined,
    status,
    assigneeIds,
    crewSize: num(f.crewSize, 1, 30),
    trucks: num(f.trucks, 0, 10),
    truckSize: f.truckSize ? text(f.truckSize, 40) : undefined,
    estimatedHours: num(f.estimatedHours, 0, 48),
    pickupAddress: text(f.pickupAddress, 300),
    dropoffAddress: text(f.dropoffAddress, 300),
    opsNotes: f.opsNotes ? text(f.opsNotes, 3000) : undefined,
  };
}

export const createJob = mutation({
  args: {
    token: v.string(),
    leadId: v.id("quoteRequests"),
    estimateId: v.optional(v.id("estimates")),
    ...jobFields,
  },
  returns: v.object({ jobId: v.id("jobs"), conflicts: v.array(v.string()) }),
  handler: async (ctx, args) => {
    const me = await requireStaffMutation(ctx, args.token, ["operations"]);
    const lead = await ctx.db.get("quoteRequests", args.leadId);
    if (!lead) throw new ConvexError("Lead not found.");
    const { leadId, estimateId } = args;
    const clean = cleanJob(args);
    const conflicts = await findConflicts(ctx, clean.date, clean.timeSlot, clean.assigneeIds);
    const jobId = await ctx.db.insert("jobs", compact({
      ...clean,
      leadId,
      estimateId,
      customerName: lead.name,
      customerPhone: lead.phone,
      createdBy: me._id,
    }));
    // Scheduling a job means the lead is won.
    if ((lead.crmStatus ?? "new") !== "booked") await setLeadStatus(ctx, lead, "booked", me._id);
    await ctx.db.insert("leadActivities", {
      leadId,
      staffId: me._id,
      kind: "system",
      body: `Job scheduled for ${clean.date} (${clean.timeSlot})`,
    });
    return { jobId, conflicts };
  },
});

export const updateJob = mutation({
  args: { token: v.string(), jobId: v.id("jobs"), ...jobFields },
  returns: v.array(v.string()),
  handler: async (ctx, args) => {
    const me = await requireStaffMutation(ctx, args.token, ["operations"]);
    const job = await ctx.db.get("jobs", args.jobId);
    if (!job) throw new ConvexError("Job not found.");
    const { jobId } = args;
    const clean = cleanJob(args);
    const conflicts = await findConflicts(ctx, clean.date, clean.timeSlot, clean.assigneeIds, jobId);
    await ctx.db.patch("jobs", jobId, clean);
    if (job.status !== clean.status || job.date !== clean.date) {
      await ctx.db.insert("leadActivities", {
        leadId: job.leadId,
        staffId: me._id,
        kind: "system",
        body:
          job.date !== clean.date
            ? `Job moved ${job.date} → ${clean.date}`
            : `Job ${job.status.replace("_", " ")} → ${clean.status.replace("_", " ")}`,
      });
    }
    return conflicts;
  },
});

export const setJobStatus = mutation({
  args: { token: v.string(), jobId: v.id("jobs"), status: jobStatus },
  returns: v.null(),
  handler: async (ctx, args) => {
    const me = await requireStaffMutation(ctx, args.token, ["operations"]);
    const job = await ctx.db.get("jobs", args.jobId);
    if (!job) throw new ConvexError("Job not found.");
    await ctx.db.patch("jobs", job._id, { status: args.status });
    await ctx.db.insert("leadActivities", {
      leadId: job.leadId,
      staffId: me._id,
      kind: "system",
      body: `Job ${args.status.replace("_", " ")}`,
    });
    return null;
  },
});
