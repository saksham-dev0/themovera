import { ConvexError, v } from "convex/values";
import { mutation, query } from "../_generated/server";
import type { MutationCtx } from "../_generated/server";
import type { Doc, Id } from "../_generated/dataModel";
import { activityKind, leadStatus } from "../schema";
import { num, requireStaff, requireStaffMutation, text } from "./session";

/** How many recent leads the pipeline loads at once. */
const LEAD_WINDOW = 1000;

const STATUS_LABEL: Record<Doc<"quoteRequests">["crmStatus"] & string, string> = {
  new: "New",
  contacted: "Contacted",
  quoted: "Quote sent",
  follow_up: "Follow-up",
  scheduled: "Scheduled",
  booked: "Closed – Booked",
  lost: "Closed – Lost",
};

/** Compact row for the pipeline table/board. */
function leadRow(q: Doc<"quoteRequests">) {
  return {
    _id: q._id,
    _creationTime: q._creationTime,
    reference: q.reference ?? null,
    name: q.name,
    phone: q.phone,
    email: q.email,
    moveDate: q.moveDate,
    movingFrom: q.movingFrom,
    movingTo: q.movingTo ?? "",
    source: q.source ?? "website",
    status: q.crmStatus ?? "new",
    ownerId: q.ownerId ?? null,
    estimatedValue: q.estimatedValue ?? null,
    nextFollowUp: q.nextFollowUp ?? null,
    bedrooms: q.stepTwo?.bedrooms ?? null,
    propertyType: q.stepTwo?.propertyType ?? null,
    statusChangedAt: q.statusChangedAt ?? q._creationTime,
    firstContactAt: q.firstContactAt ?? null,
  };
}

export const list = query({
  args: { token: v.string() },
  handler: async (ctx, args) => {
    await requireStaff(ctx, args.token);
    const rows = await ctx.db.query("quoteRequests").order("desc").take(LEAD_WINDOW);
    return rows.map(leadRow);
  },
});

/** Everything on one lead: details, timeline, estimates, jobs. */
export const get = query({
  args: { token: v.string(), leadId: v.id("quoteRequests") },
  handler: async (ctx, args) => {
    await requireStaff(ctx, args.token);
    const lead = await ctx.db.get("quoteRequests", args.leadId);
    if (!lead) return null;

    const [activities, estimates, jobs] = await Promise.all([
      ctx.db
        .query("leadActivities")
        .withIndex("by_leadId", (q) => q.eq("leadId", args.leadId))
        .order("desc")
        .take(200),
      ctx.db
        .query("estimates")
        .withIndex("by_leadId", (q) => q.eq("leadId", args.leadId))
        .order("desc")
        .take(20),
      ctx.db
        .query("jobs")
        .withIndex("by_leadId", (q) => q.eq("leadId", args.leadId))
        .take(20),
    ]);

    const staffIds = [...new Set(activities.map((a) => a.staffId).filter(Boolean))] as Id<"staff">[];
    const staff = await Promise.all(staffIds.map((id) => ctx.db.get("staff", id)));
    const staffName = new Map(staff.filter(Boolean).map((s) => [s!._id, s!.name]));

    return {
      ...leadRow(lead),
      stepTwo: lead.stepTwo ?? null,
      lostReason: lead.lostReason ?? null,
      crmNotes: lead.crmNotes ?? "",
      activities: activities.map((a) => ({
        _id: a._id,
        _creationTime: a._creationTime,
        kind: a.kind,
        body: a.body,
        staffName: a.staffId ? (staffName.get(a.staffId) ?? "Staff") : "System",
      })),
      estimates: estimates.map((e) => ({
        _id: e._id,
        number: e.number,
        status: e.status,
        step: e.step,
        _creationTime: e._creationTime,
      })),
      jobs,
    };
  },
});

async function logActivity(
  ctx: MutationCtx,
  leadId: Id<"quoteRequests">,
  staffId: Id<"staff"> | undefined,
  kind: Doc<"leadActivities">["kind"],
  body: string,
) {
  await ctx.db.insert("leadActivities", { leadId, staffId, kind, body });
}

/** Exported for other CRM modules (estimates, jobs). */
export async function setLeadStatus(
  ctx: MutationCtx,
  lead: Doc<"quoteRequests">,
  status: Doc<"quoteRequests">["crmStatus"] & string,
  staffId: Id<"staff"> | undefined,
  extra: string = "",
) {
  const from = lead.crmStatus ?? "new";
  if (from === status) return;
  const now = Date.now();
  await ctx.db.patch("quoteRequests", lead._id, {
    crmStatus: status,
    statusChangedAt: now,
    ...(lead.firstContactAt === undefined && status !== "new" ? { firstContactAt: now } : {}),
  });
  await logActivity(
    ctx,
    lead._id,
    staffId,
    "status",
    `${STATUS_LABEL[from]} → ${STATUS_LABEL[status]}${extra ? ` · ${extra}` : ""}`,
  );
}

export const updateStatus = mutation({
  args: {
    token: v.string(),
    leadId: v.id("quoteRequests"),
    status: leadStatus,
    lostReason: v.optional(v.string()),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const me = await requireStaffMutation(ctx, args.token, ["sales"]);
    const lead = await ctx.db.get("quoteRequests", args.leadId);
    if (!lead) throw new ConvexError("Lead not found.");
    const reason = args.status === "lost" ? text(args.lostReason ?? "", 300) : "";
    if (args.status === "lost") await ctx.db.patch("quoteRequests", lead._id, { lostReason: reason });
    await setLeadStatus(ctx, lead, args.status, me._id, reason);
    return null;
  },
});

export const update = mutation({
  args: {
    token: v.string(),
    leadId: v.id("quoteRequests"),
    patch: v.object({
      name: v.optional(v.string()),
      phone: v.optional(v.string()),
      email: v.optional(v.string()),
      moveDate: v.optional(v.string()),
      movingFrom: v.optional(v.string()),
      movingTo: v.optional(v.string()),
      ownerId: v.optional(v.union(v.id("staff"), v.null())),
      estimatedValue: v.optional(v.union(v.number(), v.null())),
      nextFollowUp: v.optional(v.union(v.string(), v.null())),
      crmNotes: v.optional(v.string()),
    }),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const me = await requireStaffMutation(ctx, args.token, ["sales"]);
    const lead = await ctx.db.get("quoteRequests", args.leadId);
    if (!lead) throw new ConvexError("Lead not found.");
    const p = args.patch;
    const patch: Partial<Doc<"quoteRequests">> = {};
    for (const key of ["name", "phone", "email", "moveDate", "movingFrom", "movingTo"] as const) {
      if (p[key] !== undefined) patch[key] = text(p[key]!, 300);
    }
    if (p.crmNotes !== undefined) patch.crmNotes = text(p.crmNotes, 5000);
    if (p.ownerId !== undefined) {
      patch.ownerId = p.ownerId ?? undefined;
      if (p.ownerId) {
        const owner = await ctx.db.get("staff", p.ownerId);
        await logActivity(ctx, lead._id, me._id, "system", `Assigned to ${owner?.name ?? "staff"}`);
      }
    }
    if (p.estimatedValue !== undefined) {
      patch.estimatedValue = p.estimatedValue === null ? undefined : num(p.estimatedValue);
    }
    if (p.nextFollowUp !== undefined) patch.nextFollowUp = p.nextFollowUp || undefined;
    await ctx.db.patch("quoteRequests", lead._id, patch);
    return null;
  },
});

export const addActivity = mutation({
  args: {
    token: v.string(),
    leadId: v.id("quoteRequests"),
    kind: activityKind,
    body: v.string(),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const me = await requireStaffMutation(ctx, args.token);
    const lead = await ctx.db.get("quoteRequests", args.leadId);
    if (!lead) throw new ConvexError("Lead not found.");
    const body = text(args.body, 4000);
    if (!body) throw new ConvexError("Write something first.");
    await logActivity(ctx, lead._id, me._id, args.kind, body);
    // Any logged call/email/SMS counts as first contact; nudge New → Contacted.
    if (["call", "email", "sms"].includes(args.kind) && (lead.crmStatus ?? "new") === "new") {
      await setLeadStatus(ctx, lead, "contacted", me._id);
    }
    return null;
  },
});

/** Phone-in / walk-in leads typed in by sales. */
export const create = mutation({
  args: {
    token: v.string(),
    name: v.string(),
    phone: v.string(),
    email: v.string(),
    moveDate: v.string(),
    movingFrom: v.string(),
    movingTo: v.string(),
    source: v.string(),
  },
  returns: v.id("quoteRequests"),
  handler: async (ctx, args) => {
    const me = await requireStaffMutation(ctx, args.token, ["sales"]);
    if (!args.name.trim() || !args.phone.trim()) throw new ConvexError("Name and phone are required.");

    const counter = await ctx.db
      .query("counters")
      .withIndex("by_name", (q) => q.eq("name", "salesReference"))
      .unique();
    let reference = 1001;
    if (counter) {
      reference = counter.value + 1;
      await ctx.db.patch("counters", counter._id, { value: reference });
    } else {
      await ctx.db.insert("counters", { name: "salesReference", value: reference });
    }

    const id = await ctx.db.insert("quoteRequests", {
      name: text(args.name, 200),
      phone: text(args.phone, 50),
      email: text(args.email, 200),
      moveDate: text(args.moveDate, 20),
      movingFrom: text(args.movingFrom, 300),
      movingTo: text(args.movingTo, 300),
      source: text(args.source, 60) || "manual",
      reference,
      crmStatus: "new",
      ownerId: me._id,
      statusChangedAt: Date.now(),
    });
    await logActivity(ctx, id, me._id, "system", `Lead created manually (${args.source || "manual"})`);
    return id;
  },
});
