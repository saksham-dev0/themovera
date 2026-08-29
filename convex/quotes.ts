import { v } from "convex/values";
import { internalMutation, internalQuery, mutation } from "./_generated/server";
import { internal } from "./_generated/api";
import { stepTwoDetails } from "./schema";
import type { MutationCtx } from "./_generated/server";

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
 * Next value of a named counter. Mutations are serializable transactions, so
 * concurrent submissions cannot be handed the same reference number.
 */
async function nextReference(ctx: MutationCtx, name: string, start: number) {
  const counter = await ctx.db
    .query("counters")
    .withIndex("by_name", (q) => q.eq("name", name))
    .unique();

  if (counter === null) {
    await ctx.db.insert("counters", { name, value: start });
    return start;
  }
  const value = counter.value + 1;
  await ctx.db.patch(counter._id, { value });
  return value;
}

/**
 * Step 1 of the landing-page quote form.
 *
 * Internal: the landing page posts to the /landing-quote HTTP endpoint (see
 * convex/http.ts) instead of using the Convex browser client, which keeps the
 * Convex runtime out of that page's JS bundle.
 *
 * Stores the raw request first, then schedules the customer thank-you email and
 * the sales notification, so a mail failure can never lose the lead.
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
    ipAddress: v.string(),
    userAgent: v.string(),
    stepTwoToken: v.string(),
  },
  returns: v.object({ reference: v.number(), token: v.string() }),
  handler: async (ctx, args) => {
    const reference = await nextReference(ctx, "salesReference", 1001);

    const quoteId = await ctx.db.insert("quoteRequests", { ...args, reference });

    await ctx.scheduler.runAfter(0, internal.emails.sendQuoteThankYou, {
      quoteId,
      name: args.name,
      email: args.email,
      movingFrom: args.movingFrom,
      movingTo: args.movingTo,
      moveDate: args.moveDate,
    });

    await ctx.scheduler.runAfter(0, internal.emails.sendSalesNotification, {
      quoteId,
      stage: "step1" as const,
    });

    return { reference, token: args.stepTwoToken };
  },
});

/**
 * Step 2 of the form, submitted from the thank-you page. Attaches the extra
 * move detail to the existing record and re-notifies sales under the same
 * reference number.
 */
export const recordStepTwo = internalMutation({
  args: {
    token: v.string(),
    details: stepTwoDetails,
  },
  returns: v.union(v.object({ reference: v.number() }), v.null()),
  handler: async (ctx, args) => {
    const quote = await ctx.db
      .query("quoteRequests")
      .withIndex("by_token", (q) => q.eq("stepTwoToken", args.token))
      .unique();

    if (quote === null) return null;

    await ctx.db.patch(quote._id, {
      stepTwo: args.details,
      stepTwoCompletedAt: Date.now(),
    });

    await ctx.scheduler.runAfter(0, internal.emails.sendSalesNotification, {
      quoteId: quote._id,
      stage: "step2" as const,
    });

    return { reference: quote.reference ?? 0 };
  },
});

/** Full record, read by the sales-notification action. */
export const getQuote = internalQuery({
  args: { quoteId: v.id("quoteRequests") },
  returns: v.any(),
  handler: async (ctx, args) => await ctx.db.get(args.quoteId),
});
