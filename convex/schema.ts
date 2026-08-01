import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

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
  }),

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
