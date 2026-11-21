import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

/** Extra move detail gathered on the step-2 page after the quote request. */
export const stepTwoDetails = v.object({
  propertyType: v.string(),
  bedrooms: v.string(),
  pickupAccess: v.string(),
  dropoffAccess: v.string(),
  preferredTime: v.string(),
  packingHelp: v.string(),
  specialItems: v.string(),
  notes: v.string(),
});

// ─────────────────────────── CRM validators ───────────────────────────

export const leadStatus = v.union(
  v.literal("new"),
  v.literal("contacted"),
  v.literal("quoted"),
  v.literal("follow_up"),
  v.literal("scheduled"), // survey / call-back / move scheduled with customer
  v.literal("booked"), // closed — won
  v.literal("lost"), // closed — lost
);

export const staffRole = v.union(v.literal("admin"), v.literal("sales"), v.literal("operations"));

export const activityKind = v.union(
  v.literal("note"),
  v.literal("call"),
  v.literal("email"),
  v.literal("sms"),
  v.literal("status"),
  v.literal("system"),
);

export const resourceKind = v.union(
  v.literal("trucker"),
  v.literal("subcontractor"),
  v.literal("crew"),
);

export const timeSlot = v.union(
  v.literal("early"), // 6–8am
  v.literal("morning"), // 8–11am
  v.literal("midday"), // 11am–1pm
  v.literal("afternoon"), // 1–4pm
  v.literal("evening"), // 4–7pm
);

export const jobStatus = v.union(
  v.literal("unassigned"),
  v.literal("assigned"),
  v.literal("confirmed"),
  v.literal("in_progress"),
  v.literal("completed"),
  v.literal("cancelled"),
);

export const estimateStatus = v.union(
  v.literal("draft"),
  v.literal("sent"),
  v.literal("accepted"),
  v.literal("declined"),
);

const accessDetails = v.object({
  address: v.string(),
  propertyType: v.string(),
  bedrooms: v.string(),
  floor: v.number(),
  access: v.string(), // "Ground", "Stairs", "Lift"
  parkingMetres: v.number(),
});

export const estimateMoveInfo = v.object({
  customerName: v.string(),
  phone: v.string(),
  email: v.string(),
  moveType: v.string(),
  moveDate: v.string(),
  timeSlot,
  pickup: accessDetails,
  dropoff: accessDetails,
  extraStops: v.number(),
  distanceKm: v.number(),
  notes: v.string(),
});

export const estimateInventoryItem = v.object({
  room: v.string(),
  name: v.string(),
  qty: v.number(),
  cubicMetres: v.number(), // per item
  special: v.boolean(), // fragile / heavy / needs extra handling
});

export const estimateLine = v.object({
  name: v.string(),
  qty: v.number(),
  unitPrice: v.number(),
});

export const estimateLabour = v.object({
  crewSize: v.number(),
  trucks: v.number(),
  truckSize: v.string(),
  hourlyRate: v.number(),
  estimatedHours: v.number(),
  minimumHours: v.number(),
  travelHours: v.number(),
  packingHours: v.number(),
  packingRate: v.number(),
  stairFee: v.number(),
  heavyItemFee: v.number(),
});

export const estimateStorage = v.object({
  required: v.boolean(),
  units: v.number(),
  weeks: v.number(),
  weeklyRate: v.number(),
  handlingFee: v.number(),
});

/**
 * Final-quote settings. Hourly rate, crew, trucks and hours live on `labour`
 * (one source of truth) and are edited from the quotation step too.
 */
export const estimateQuotation = v.object({
  pricingType: v.union(v.literal("hourly"), v.literal("fixed")),
  movingFee: v.number(), // call-out / travel fee
  fuelLevy: v.number(),
  fixedPrice: v.number(),
  extraFees: v.array(estimateLine),
  discount: v.number(),
  discountType: v.union(v.literal("amount"), v.literal("percent")),
  includeGst: v.boolean(),
  depositPercent: v.number(),
  validDays: v.number(),
  hoursSpread: v.number(), // ± hours shown as a range
  terms: v.string(),
});

export default defineSchema({
  feedback: defineTable({
    name: v.string(),
    email: v.string(),
    comment: v.string(),
    mediaStorageId: v.optional(v.id("_storage")),
    mediaType: v.optional(v.union(v.literal("image"), v.literal("video"))),
  }),

  /** Formal complaints raised from the home-page footer grievance form. */
  grievances: defineTable({
    name: v.string(),
    email: v.string(),
    phone: v.string(),
    altPhone: v.optional(v.string()),
    address: v.string(),
    city: v.string(),
    state: v.string(),
    postcode: v.optional(v.string()),
    pickupAddress: v.string(),
    dropoffAddress: v.string(),
    pickupDate: v.string(),
    deliveryDate: v.optional(v.string()),
    bookingNumber: v.optional(v.string()),
    issueType: v.union(
      v.literal("Damage"),
      v.literal("Overcharged"),
      v.literal("Delay"),
      v.literal("Cancellation"),
      v.literal("Movers Behaviour"),
      v.literal("Other"),
    ),
    comments: v.string(),
    /** Customer ticked the "everything above is true" declaration. */
    declarationAccepted: v.boolean(),
    attachmentStorageId: v.optional(v.id("_storage")),
    attachmentName: v.optional(v.string()),
  }),

  quoteRequests: defineTable({
    name: v.string(),
    phone: v.string(),
    email: v.string(),
    moveDate: v.string(),
    movingFrom: v.string(),
    movingTo: v.optional(v.string()),
    source: v.optional(v.string()),
    thankYouEmailSent: v.optional(v.boolean()),

    // Sales reference — one incrementing number per customer, reused by step 2
    // so the sales team sees both emails under the same job.
    reference: v.optional(v.number()),
    // Random secret returned to the browser after step 1; step 2 must present
    // it to attach details, so a document id alone cannot be used to write.
    stepTwoToken: v.optional(v.string()),

    ipAddress: v.optional(v.string()),
    userAgent: v.optional(v.string()),

    stepTwo: v.optional(stepTwoDetails),
    stepTwoCompletedAt: v.optional(v.number()),

    // ── CRM (sales) fields. Optional so existing website leads stay valid;
    // a lead with no crmStatus is treated as "new".
    crmStatus: v.optional(leadStatus),
    ownerId: v.optional(v.id("staff")),
    estimatedValue: v.optional(v.number()),
    nextFollowUp: v.optional(v.string()), // YYYY-MM-DD
    lostReason: v.optional(v.string()),
    statusChangedAt: v.optional(v.number()),
    firstContactAt: v.optional(v.number()),
    crmNotes: v.optional(v.string()),
  })
    .index("by_reference", ["reference"])
    .index("by_token", ["stepTwoToken"])
    .index("by_crmStatus", ["crmStatus"]),

  // ─────────────────────────────── CRM ───────────────────────────────

  /** Office users of the /crm dashboard. */
  staff: defineTable({
    name: v.string(),
    email: v.string(), // lower-cased
    role: staffRole,
    passwordHash: v.string(),
    passwordSalt: v.string(),
    active: v.boolean(),
    failedLogins: v.optional(v.number()),
    lockedUntil: v.optional(v.number()),
  }).index("by_email", ["email"]),

  /** Login sessions. The token is a 256-bit random string held by the browser. */
  sessions: defineTable({
    staffId: v.id("staff"),
    token: v.string(),
    expiresAt: v.number(),
  })
    .index("by_token", ["token"])
    .index("by_staffId", ["staffId"]),

  /** Timeline of everything that happened to a lead (notes, calls, status changes). */
  leadActivities: defineTable({
    leadId: v.id("quoteRequests"),
    staffId: v.optional(v.id("staff")),
    kind: activityKind,
    body: v.string(),
  }).index("by_leadId", ["leadId"]),

  /** Truckers, sub-contractors and in-house crew that jobs are assigned to. */
  resources: defineTable({
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
  }).index("by_active", ["active"]),

  /** A booked move scheduled by operations. */
  jobs: defineTable({
    leadId: v.id("quoteRequests"),
    estimateId: v.optional(v.id("estimates")),
    date: v.string(), // YYYY-MM-DD
    timeSlot,
    startTime: v.optional(v.string()), // HH:MM
    status: jobStatus,
    assigneeIds: v.array(v.id("resources")), // a handful at most
    crewSize: v.number(),
    trucks: v.number(),
    truckSize: v.optional(v.string()),
    estimatedHours: v.number(),
    pickupAddress: v.string(),
    dropoffAddress: v.string(),
    customerName: v.string(),
    customerPhone: v.string(),
    opsNotes: v.optional(v.string()),
    createdBy: v.optional(v.id("staff")),
  })
    .index("by_date", ["date"])
    .index("by_leadId", ["leadId"])
    .index("by_status", ["status"]),

  /** Step-by-step quotation built in the Actions tab. */
  estimates: defineTable({
    leadId: v.id("quoteRequests"),
    number: v.number(),
    status: estimateStatus,
    step: v.number(), // furthest step reached, 0-5
    moveInfo: estimateMoveInfo,
    inventory: v.array(estimateInventoryItem), // capped server-side
    materials: v.array(estimateLine),
    labour: estimateLabour,
    storage: estimateStorage,
    quotation: estimateQuotation,
    sentAt: v.optional(v.number()),
    createdBy: v.optional(v.id("staff")),
    updatedBy: v.optional(v.id("staff")),
  })
    .index("by_leadId", ["leadId"])
    .index("by_status", ["status"]),

  /** Named atomic counters. Currently just the sales reference sequence. */
  counters: defineTable({
    name: v.string(),
    value: v.number(),
  }).index("by_name", ["name"]),

  jobApplications: defineTable({
    name: v.string(),
    email: v.string(),
    phone: v.string(),
    role: v.union(v.literal("Ground Supervisor"), v.literal("Sub-Contractor"), v.literal("Other")),
    location: v.string(),
    experience: v.string(),
    hasOwnTruck: v.boolean(),
    hasAbn: v.boolean(),
    message: v.string(),
    resumeStorageId: v.optional(v.id("_storage")),
  }),
});
