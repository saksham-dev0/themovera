import { v } from "convex/values";
import { mutation } from "./_generated/server";

export const generateUploadUrl = mutation({
  args: {},
  returns: v.string(),
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});

export const submit = mutation({
  args: {
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
  },
  returns: v.id("jobApplications"),
  handler: async (ctx, args) => {
    return await ctx.db.insert("jobApplications", args);
  },
});
