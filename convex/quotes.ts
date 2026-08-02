import { v } from "convex/values";
import { mutation } from "./_generated/server";

export const submit = mutation({
  args: {
    name: v.string(),
    phone: v.string(),
    email: v.string(),
    moveDate: v.string(),
    movingFrom: v.string(),
  },
  returns: v.id("quoteRequests"),
  handler: async (ctx, args) => {
    return await ctx.db.insert("quoteRequests", args);
  },
});
