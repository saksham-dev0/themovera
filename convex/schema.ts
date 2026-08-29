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

export default defineSchema({
  feedback: defineTable({
    name: v.string(),
    email: v.string(),
    comment: v.string(),
    mediaStorageId: v.optional(v.id("_storage")),
    mediaType: v.optional(v.union(v.literal("image"), v.literal("video"))),
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
  })
    .index("by_reference", ["reference"])
    .index("by_token", ["stepTwoToken"]),

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
