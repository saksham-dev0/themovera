import { ConvexError, v } from "convex/values";
import { action, internalMutation, internalQuery, mutation, query } from "../_generated/server";
import { internal } from "../_generated/api";
import type { Doc, Id } from "../_generated/dataModel";
import {
  estimateInventoryItem,
  estimateLabour,
  estimateLine,
  estimateMoveInfo,
  estimateQuotation,
  estimateStatus,
  estimateStorage,
} from "../schema";
import { num, requireStaff, requireStaffMutation, text } from "./session";
import { setLeadStatus } from "./leads";
import { CALL_OUT_HOURS, DEFAULT_TERMS, MINIMUM_HOURS, computeQuote, standardHourlyRate, type EstimateData } from "./quoteMath";
import { esc, sendEmail } from "../emails";

const MAX_INVENTORY = 600;
const MAX_LINES = 60;

function accessFromStepTwo(value: string | undefined) {
  if (!value) return { access: "Ground", floor: 0 };
  if (value.startsWith("Lift")) return { access: "Lift", floor: 2 };
  if (value.includes("2+")) return { access: "Stairs", floor: 2 };
  if (value.includes("1 level")) return { access: "Stairs", floor: 1 };
  return { access: "Ground", floor: 0 };
}

function slotFromStepTwo(value: string | undefined): Doc<"jobs">["timeSlot"] {
  if (!value) return "morning";
  if (value.startsWith("Midday")) return "midday";
  if (value.startsWith("Afternoon")) return "afternoon";
  return "morning";
}

/** Fresh estimate pre-filled from what the customer told us on the website. */
function blankEstimate(lead: Doc<"quoteRequests">): EstimateData {
  const s = lead.stepTwo;
  const pick = accessFromStepTwo(s?.pickupAccess);
  const drop = accessFromStepTwo(s?.dropoffAccess);
  return {
    moveInfo: {
      customerName: lead.name,
      phone: lead.phone,
      email: lead.email,
      moveType: s?.propertyType?.startsWith("Office") ? "Office" : "Residential",
      moveDate: lead.moveDate,
      timeSlot: slotFromStepTwo(s?.preferredTime),
      pickup: {
        address: lead.movingFrom,
        propertyType: s?.propertyType ?? "House",
        bedrooms: s?.bedrooms ?? "",
        floor: pick.floor,
        access: pick.access,
        parkingMetres: 10,
      },
      dropoff: {
        address: lead.movingTo ?? "",
        propertyType: s?.propertyType ?? "House",
        bedrooms: s?.bedrooms ?? "",
        floor: drop.floor,
        access: drop.access,
        parkingMetres: 10,
      },
      extraStops: 0,
      distanceKm: 0,
      notes: [s?.specialItems, s?.notes].filter(Boolean).join("\n"),
    },
    inventory: [],
    materials: [],
    labour: {
      crewSize: 2,
      trucks: 1,
      truckSize: "Small",
      hourlyRate: standardHourlyRate("Small", 2, 1),
      estimatedHours: 3,
      minimumHours: MINIMUM_HOURS,
      travelHours: CALL_OUT_HOURS,
      packingHours: 0,
      packingRate: 65,
      stairFee: 0,
      heavyItemFee: 0,
    },
    storage: { required: false, units: 1, weeks: 4, weeklyRate: 60, handlingFee: 0 },
    quotation: {
      pricingType: "hourly",
      movingFee: 0,
      fuelLevy: 0,
      fixedPrice: 0,
      extraFees: [],
      discount: 0,
      discountType: "amount",
      includeGst: true,
      depositPercent: 20,
      validDays: 14,
      hoursSpread: 1,
      terms: DEFAULT_TERMS,
    },
  };
}

export const create = mutation({
  args: { token: v.string(), leadId: v.id("quoteRequests") },
  returns: v.id("estimates"),
  handler: async (ctx, args) => {
    const me = await requireStaffMutation(ctx, args.token, ["sales"]);
    const lead = await ctx.db.get("quoteRequests", args.leadId);
    if (!lead) throw new ConvexError("Lead not found.");

    const counter = await ctx.db
      .query("counters")
      .withIndex("by_name", (q) => q.eq("name", "estimateNumber"))
      .unique();
    let number = 5001;
    if (counter) {
      number = counter.value + 1;
      await ctx.db.patch("counters", counter._id, { value: number });
    } else {
      await ctx.db.insert("counters", { name: "estimateNumber", value: number });
    }

    const id = await ctx.db.insert("estimates", {
      leadId: lead._id,
      number,
      status: "draft",
      step: 0,
      ...blankEstimate(lead),
      createdBy: me._id,
      updatedBy: me._id,
    });
    await ctx.db.insert("leadActivities", {
      leadId: lead._id,
      staffId: me._id,
      kind: "system",
      body: `Quotation Q-${number} started`,
    });
    return id;
  },
});

export const get = query({
  args: { token: v.string(), estimateId: v.id("estimates") },
  handler: async (ctx, args) => {
    await requireStaff(ctx, args.token);
    const e = await ctx.db.get("estimates", args.estimateId);
    if (!e) return null;
    const lead = await ctx.db.get("quoteRequests", e.leadId);
    return { ...e, lead: lead ? { _id: lead._id, reference: lead.reference ?? null, status: lead.crmStatus ?? "new" } : null };
  },
});

/** All quotations, newest first, with computed totals for the list view. */
export const list = query({
  args: { token: v.string() },
  handler: async (ctx, args) => {
    await requireStaff(ctx, args.token);
    const rows = await ctx.db.query("estimates").order("desc").take(300);
    return rows.map((e) => {
      const t = computeQuote(e);
      return {
        _id: e._id,
        _creationTime: e._creationTime,
        number: e.number,
        status: e.status,
        step: e.step,
        leadId: e.leadId,
        customerName: e.moveInfo.customerName,
        moveDate: e.moveInfo.moveDate,
        from: e.moveInfo.pickup.address,
        to: e.moveInfo.dropoff.address,
        total: t.total,
        low: t.low,
        high: t.high,
        pricingType: e.quotation.pricingType,
        sentAt: e.sentAt ?? null,
      };
    });
  },
});

// Sanitisers — every number from the browser is clamped before it's stored.
function cleanLine(l: Doc<"estimates">["materials"][number]) {
  return { name: text(l.name, 120), qty: num(l.qty, 0, 10000), unitPrice: num(l.unitPrice, 0, 100000) };
}

function cleanAccess(a: Doc<"estimates">["moveInfo"]["pickup"]) {
  return {
    address: text(a.address, 300),
    propertyType: text(a.propertyType, 60),
    bedrooms: text(a.bedrooms, 60),
    floor: num(a.floor, 0, 100),
    access: text(a.access, 30),
    parkingMetres: num(a.parkingMetres, 0, 1000),
  };
}

/**
 * Save one or more steps. Each step is optional so the UI can autosave just
 * the step being edited.
 */
export const save = mutation({
  args: {
    token: v.string(),
    estimateId: v.id("estimates"),
    step: v.optional(v.number()),
    moveInfo: v.optional(estimateMoveInfo),
    inventory: v.optional(v.array(estimateInventoryItem)),
    materials: v.optional(v.array(estimateLine)),
    labour: v.optional(estimateLabour),
    storage: v.optional(estimateStorage),
    quotation: v.optional(estimateQuotation),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const me = await requireStaffMutation(ctx, args.token, ["sales"]);
    const e = await ctx.db.get("estimates", args.estimateId);
    if (!e) throw new ConvexError("Quotation not found.");

    const patch: Partial<Doc<"estimates">> = { updatedBy: me._id };
    if (args.step !== undefined) patch.step = Math.max(e.step, num(Math.round(args.step), 0, 5));

    if (args.moveInfo) {
      const m = args.moveInfo;
      patch.moveInfo = {
        customerName: text(m.customerName, 200),
        phone: text(m.phone, 50),
        email: text(m.email, 200),
        moveType: text(m.moveType, 60),
        moveDate: text(m.moveDate, 20),
        timeSlot: m.timeSlot,
        pickup: cleanAccess(m.pickup),
        dropoff: cleanAccess(m.dropoff),
        extraStops: num(m.extraStops, 0, 20),
        distanceKm: num(m.distanceKm, 0, 5000),
        notes: text(m.notes, 4000),
      };
    }
    if (args.inventory) {
      if (args.inventory.length > MAX_INVENTORY) throw new ConvexError("Inventory is too long.");
      patch.inventory = args.inventory.map((i) => ({
        room: text(i.room, 60),
        name: text(i.name, 120),
        qty: num(i.qty, 0, 1000),
        cubicMetres: num(i.cubicMetres, 0, 100),
        special: i.special,
      }));
    }
    if (args.materials) {
      if (args.materials.length > MAX_LINES) throw new ConvexError("Too many materials.");
      patch.materials = args.materials.map(cleanLine);
    }
    if (args.labour) {
      const l = args.labour;
      patch.labour = {
        crewSize: num(l.crewSize, 1, 30),
        trucks: num(l.trucks, 0, 10),
        truckSize: text(l.truckSize, 40),
        hourlyRate: num(l.hourlyRate, 0, 5000),
        estimatedHours: num(l.estimatedHours, 0, 48),
        minimumHours: num(l.minimumHours, 0, 24),
        travelHours: num(l.travelHours, 0, 24),
        packingHours: num(l.packingHours, 0, 100),
        packingRate: num(l.packingRate, 0, 1000),
        stairFee: num(l.stairFee, 0, 10000),
        heavyItemFee: num(l.heavyItemFee, 0, 10000),
      };
    }
    if (args.storage) {
      const s = args.storage;
      patch.storage = {
        required: s.required,
        units: num(s.units, 0, 50),
        weeks: num(s.weeks, 0, 520),
        weeklyRate: num(s.weeklyRate, 0, 10000),
        handlingFee: num(s.handlingFee, 0, 10000),
      };
    }
    if (args.quotation) {
      const q = args.quotation;
      if (q.extraFees.length > MAX_LINES) throw new ConvexError("Too many fees.");
      patch.quotation = {
        pricingType: q.pricingType,
        movingFee: num(q.movingFee, 0, 10000),
        fuelLevy: num(q.fuelLevy, 0, 10000),
        fixedPrice: num(q.fixedPrice, 0, 1_000_000),
        extraFees: q.extraFees.map(cleanLine),
        discount: q.discountType === "percent" ? num(q.discount, 0, 100) : num(q.discount, 0, 1_000_000),
        discountType: q.discountType,
        includeGst: q.includeGst,
        depositPercent: num(q.depositPercent, 0, 100),
        validDays: num(Math.round(q.validDays), 1, 365),
        hoursSpread: num(q.hoursSpread, 0, 12),
        terms: text(q.terms, 6000),
      };
    }
    await ctx.db.patch("estimates", e._id, patch);
    return null;
  },
});

export const setStatus = mutation({
  args: { token: v.string(), estimateId: v.id("estimates"), status: estimateStatus },
  returns: v.null(),
  handler: async (ctx, args) => {
    const me = await requireStaffMutation(ctx, args.token, ["sales"]);
    const e = await ctx.db.get("estimates", args.estimateId);
    if (!e) throw new ConvexError("Quotation not found.");
    await ctx.db.patch("estimates", e._id, { status: args.status, updatedBy: me._id });
    const lead = await ctx.db.get("quoteRequests", e.leadId);
    if (!lead) return null;
    if (args.status === "accepted") {
      const total = computeQuote(e).total;
      await ctx.db.patch("quoteRequests", lead._id, { estimatedValue: total });
      await setLeadStatus(ctx, lead, "booked", me._id, `Q-${e.number} accepted`);
    } else if (args.status === "sent") {
      if (["new", "contacted", "follow_up"].includes(lead.crmStatus ?? "new")) {
        await setLeadStatus(ctx, lead, "quoted", me._id, `Q-${e.number}`);
      }
    } else if (args.status === "declined") {
      await ctx.db.insert("leadActivities", {
        leadId: lead._id,
        staffId: me._id,
        kind: "system",
        body: `Q-${e.number} declined by customer`,
      });
    }
    return null;
  },
});

// ───────────────────────────── Email the quote ─────────────────────────────

export const getForEmail = internalQuery({
  args: { token: v.string(), estimateId: v.id("estimates") },
  returns: v.any(),
  handler: async (ctx, args) => {
    const staff = await requireStaff(ctx, args.token, ["sales"]);
    const e = await ctx.db.get("estimates", args.estimateId);
    return e ? { estimate: e, staffId: staff._id, staffName: staff.name } : null;
  },
});

export const markSent = internalMutation({
  args: { estimateId: v.id("estimates"), staffId: v.id("staff"), to: v.string() },
  returns: v.null(),
  handler: async (ctx, args) => {
    const e = await ctx.db.get("estimates", args.estimateId);
    if (!e) return null;
    await ctx.db.patch("estimates", e._id, { status: "sent", sentAt: Date.now() });
    await ctx.db.insert("leadActivities", {
      leadId: e.leadId,
      staffId: args.staffId,
      kind: "email",
      body: `Quotation Q-${e.number} emailed to ${args.to}`,
    });
    const lead = await ctx.db.get("quoteRequests", e.leadId);
    if (lead && ["new", "contacted", "follow_up"].includes(lead.crmStatus ?? "new")) {
      await setLeadStatus(ctx, lead, "quoted", args.staffId, `Q-${e.number}`);
    }
    return null;
  },
});

const money = (n: number) =>
  n.toLocaleString("en-AU", { style: "currency", currency: "AUD", minimumFractionDigits: 2 });

const SLOT_LABEL: Record<string, string> = {
  early: "Early morning (6–8am)",
  morning: "Morning (8–11am)",
  midday: "Midday (11am–1pm)",
  afternoon: "Afternoon (1–4pm)",
  evening: "Evening (4–7pm)",
};

function quoteEmailHtml(e: Doc<"estimates">, staffName: string) {
  const t = computeQuote(e);
  const m = e.moveInfo;
  const l = e.labour;
  const q = e.quotation;
  const firstName = m.customerName.trim().split(/\s+/)[0] || "there";
  const row = (label: string, value: string) =>
    `<tr><td style="padding:6px 0;color:#4a5762;">${esc(label)}</td><td style="padding:6px 0;text-align:right;color:#22303d;font-weight:600;">${esc(value)}</td></tr>`;

  const rows: string[] = [];
  if (q.pricingType === "hourly") {
    rows.push(row(`${l.crewSize} removalists + ${l.trucks} ${l.truckSize} truck${l.trucks > 1 ? "s" : ""}`, `${money(l.hourlyRate)}/hr`));
    rows.push(
      row(
        `Estimated ${t.movingHours} hrs moving (min ${l.minimumHours} hrs)${l.travelHours ? ` + ${l.travelHours} hr call-out` : ""}`,
        money(t.labourCost),
      ),
    );
    if (t.movingFee) rows.push(row("Moving fee", money(t.movingFee)));
  } else {
    rows.push(row("Fixed moving price", money(t.labourCost)));
  }
  if (t.packingCost) rows.push(row(`Packing service (${l.packingHours} hrs)`, money(t.packingCost)));
  if (t.accessFees) rows.push(row("Stairs / heavy-item handling", money(t.accessFees)));
  if (t.materialsTotal) rows.push(row("Packing materials", money(t.materialsTotal)));
  if (t.storageTotal) rows.push(row(`Storage (${e.storage.units} unit × ${e.storage.weeks} wks)`, money(t.storageTotal)));
  for (const f of q.extraFees) rows.push(row(f.name, money(f.qty * f.unitPrice)));
  if (t.fuelLevy) rows.push(row("Fuel levy", money(t.fuelLevy)));
  if (t.discount) rows.push(row("Discount", `−${money(t.discount)}`));
  if (t.gst) rows.push(row("GST (10%)", money(t.gst)));

  const totalText =
    t.low !== t.high ? `${money(t.low)} – ${money(t.high)}` : money(t.total);

  return `<!doctype html><html><body style="margin:0;padding:0;background:#f7f6f3;font-family:Helvetica,Arial,sans-serif;color:#4a5762;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f7f6f3;padding:24px 12px;"><tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#fff;border:1px solid #e2dcc9;border-radius:14px;overflow:hidden;">
<tr><td style="background:#1b2a38;padding:22px 28px;"><div style="font-size:18px;font-weight:700;letter-spacing:1px;color:#fff;">MOVERA</div>
<div style="font-size:12px;color:#c9d1cc;margin-top:4px;">Quotation Q-${e.number}</div></td></tr>
<tr><td style="padding:28px;">
<h1 style="margin:0 0 12px;font-size:22px;color:#22303d;">Hi ${esc(firstName)}, here's your moving quote.</h1>
<p style="margin:0 0 18px;font-size:15px;line-height:1.6;">
<strong>${esc(m.moveDate)}</strong> · ${esc(SLOT_LABEL[m.timeSlot] ?? m.timeSlot)}<br/>
From: ${esc(m.pickup.address)}<br/>To: ${esc(m.dropoff.address)}</p>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;border-top:1px solid #e2dcc9;">${rows.join("")}
<tr><td style="padding:12px 0 0;border-top:2px solid #22303d;font-size:16px;font-weight:700;color:#22303d;">${t.low !== t.high ? "Estimated total" : "Total"}</td>
<td style="padding:12px 0 0;border-top:2px solid #22303d;text-align:right;font-size:18px;font-weight:700;color:#2c5f8a;">${totalText}</td></tr>
${t.deposit ? `<tr><td style="padding:6px 0;color:#7c8790;">Deposit to secure the date (${q.depositPercent}%)</td><td style="padding:6px 0;text-align:right;color:#7c8790;">${money(t.deposit)}</td></tr>` : ""}
</table>
<p style="margin:20px 0 0;font-size:12px;color:#7c8790;line-height:1.6;">${esc(q.terms)}<br/><br/>This quote is valid for ${q.validDays} days. Reply to this email or call 03 7074 1820 to book.</p>
<p style="margin:16px 0 0;font-size:14px;">— ${esc(staffName)}, Movera</p>
</td></tr></table></td></tr></table></body></html>`;
}

export const emailToCustomer = action({
  args: { token: v.string(), estimateId: v.id("estimates") },
  returns: v.object({ sent: v.boolean(), to: v.string() }),
  handler: async (ctx, args): Promise<{ sent: boolean; to: string }> => {
    const data: { estimate: Doc<"estimates">; staffId: Id<"staff">; staffName: string } | null =
      await ctx.runQuery(internal.crm.estimates.getForEmail, args);
    if (!data) throw new ConvexError("Quotation not found.");
    const to: string = data.estimate.moveInfo.email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(to)) throw new ConvexError("Customer email looks invalid.");
    const sent = await sendEmail({
      to: [to],
      subject: `Your Movera moving quote Q-${data.estimate.number}`,
      html: quoteEmailHtml(data.estimate, data.staffName),
      replyTo: process.env.SALES_EMAIL_ADDRESS ?? "sales@themovera.com.au",
    });
    if (sent) {
      await ctx.runMutation(internal.crm.estimates.markSent, {
        estimateId: args.estimateId,
        staffId: data.staffId,
        to,
      });
    }
    return { sent, to };
  },
});

// ───────────────────────────── Delete / duplicate ─────────────────────────────

/**
 * Permanently delete a quotation. Accepted quotes are protected so the
 * booked job keeps its paper trail; decline it first if it must go.
 */
export const remove = mutation({
  args: { token: v.string(), estimateId: v.id("estimates") },
  returns: v.null(),
  handler: async (ctx, args) => {
    const me = await requireStaffMutation(ctx, args.token, ["sales"]);
    const e = await ctx.db.get("estimates", args.estimateId);
    if (!e) throw new ConvexError("Quotation not found.");
    if (e.status === "accepted") {
      throw new ConvexError("Accepted quotes can't be deleted. Mark it declined first if it was a mistake.");
    }
    // Detach any job that still points at this quote.
    const jobs = await ctx.db
      .query("jobs")
      .withIndex("by_leadId", (q) => q.eq("leadId", e.leadId))
      .take(50);
    for (const j of jobs) {
      if (j.estimateId === e._id) await ctx.db.patch("jobs", j._id, { estimateId: undefined });
    }
    await ctx.db.delete("estimates", e._id);
    await ctx.db.insert("leadActivities", {
      leadId: e.leadId,
      staffId: me._id,
      kind: "system",
      body: `Quotation Q-${e.number} (${e.status}) deleted`,
    });
    return null;
  },
});

/** Copy a quotation into a new draft (new number) — handy for revised quotes. */
export const duplicate = mutation({
  args: { token: v.string(), estimateId: v.id("estimates") },
  returns: v.id("estimates"),
  handler: async (ctx, args) => {
    const me = await requireStaffMutation(ctx, args.token, ["sales"]);
    const e = await ctx.db.get("estimates", args.estimateId);
    if (!e) throw new ConvexError("Quotation not found.");
    const counter = await ctx.db
      .query("counters")
      .withIndex("by_name", (q) => q.eq("name", "estimateNumber"))
      .unique();
    let number = 5001;
    if (counter) {
      number = counter.value + 1;
      await ctx.db.patch("counters", counter._id, { value: number });
    } else {
      await ctx.db.insert("counters", { name: "estimateNumber", value: number });
    }
    const id = await ctx.db.insert("estimates", {
      leadId: e.leadId,
      number,
      status: "draft",
      step: e.step,
      moveInfo: e.moveInfo,
      inventory: e.inventory,
      materials: e.materials,
      labour: e.labour,
      storage: e.storage,
      quotation: e.quotation,
      createdBy: me._id,
      updatedBy: me._id,
    });
    await ctx.db.insert("leadActivities", {
      leadId: e.leadId,
      staffId: me._id,
      kind: "system",
      body: `Quotation Q-${number} copied from Q-${e.number}`,
    });
    return id;
  },
});
