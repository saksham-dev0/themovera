import { v } from "convex/values";
import { internalMutation, mutation } from "./_generated/server";
import { internal } from "./_generated/api";

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

/**
 * Quote submission from the /local-movers-melbourne landing page. Captures both
 * pickup and drop-off suburbs and schedules the automatic thank-you email.
 *
 * Internal: the landing page posts to the /landing-quote HTTP endpoint (see
 * convex/http.ts) instead of using the Convex browser client, which keeps the
 * Convex runtime out of that page's JS bundle.
 */
export const recordLandingQuote = internalMutation({
  args: {
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
    const quoteId = await ctx.db.insert("quoteRequests", args);

    await ctx.scheduler.runAfter(0, internal.emails.sendQuoteThankYou, {
      quoteId,
      name: args.name,
      email: args.email,
      movingFrom: args.movingFrom,
      movingTo: args.movingTo,
      moveDate: args.moveDate,
    });

    return quoteId;
  },
});
