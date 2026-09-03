import { v } from "convex/values";
import { internalQuery, mutation } from "./_generated/server";
import { internal } from "./_generated/api";

export const issueType = v.union(
  v.literal("Damage"),
  v.literal("Overcharged"),
  v.literal("Delay"),
  v.literal("Cancellation"),
  v.literal("Movers Behaviour"),
  v.literal("Other"),
);

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
    issueType,
    comments: v.string(),
    declarationAccepted: v.boolean(),
    attachmentStorageId: v.optional(v.id("_storage")),
    attachmentName: v.optional(v.string()),
  },
  returns: v.id("grievances"),
  handler: async (ctx, args) => {
    const grievanceId = await ctx.db.insert("grievances", args);
    await ctx.scheduler.runAfter(0, internal.emails.sendGrievanceNotification, { grievanceId });
    return grievanceId;
  },
});

/** Read side for the sales-notification action only — never exposed publicly. */
export const getGrievance = internalQuery({
  args: { grievanceId: v.id("grievances") },
  returns: v.union(
    v.object({
      _id: v.id("grievances"),
      _creationTime: v.number(),
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
      issueType,
      comments: v.string(),
      declarationAccepted: v.boolean(),
      attachmentStorageId: v.optional(v.id("_storage")),
      attachmentName: v.optional(v.string()),
      attachmentUrl: v.union(v.string(), v.null()),
    }),
    v.null(),
  ),
  handler: async (ctx, args) => {
    const grievance = await ctx.db.get(args.grievanceId);
    if (grievance === null) return null;
    const attachmentUrl = grievance.attachmentStorageId
      ? await ctx.storage.getUrl(grievance.attachmentStorageId)
      : null;
    return { ...grievance, attachmentUrl };
  },
});
