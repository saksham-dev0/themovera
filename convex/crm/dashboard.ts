import { v } from "convex/values";
import { query } from "../_generated/server";
import { requireStaff } from "./session";
import { computeQuote } from "./quoteMath";

/**
 * Overview numbers. `today` (Melbourne YYYY-MM-DD) and `now` come from the
 * browser — queries must not read the clock. Reads a bounded window of recent
 * rows, which is plenty for a single-branch removalist.
 */
export const overview = query({
  args: { token: v.string(), today: v.string(), weekEnd: v.string(), now: v.number() },
  handler: async (ctx, args) => {
    await requireStaff(ctx, args.token);
    const leads = await ctx.db.query("quoteRequests").order("desc").take(1000);
    const jobs = await ctx.db
      .query("jobs")
      .withIndex("by_date", (q) => q.gte("date", args.today).lte("date", args.weekEnd))
      .take(500);
    const estimates = await ctx.db.query("estimates").order("desc").take(300);

    const DAY = 86_400_000;
    const statusCounts: Record<string, number> = {};
    const sourceCounts: Record<string, number> = {};
    let newToday = 0;
    let new7 = 0;
    let new30 = 0;
    let booked30 = 0;
    let closed30 = 0;
    let bookedValue30 = 0;
    let overdueFollowUps = 0;
    let uncontacted = 0;
    let responseSum = 0;
    let responseN = 0;

    for (const l of leads) {
      const status = l.crmStatus ?? "new";
      statusCounts[status] = (statusCounts[status] ?? 0) + 1;
      const age = args.now - l._creationTime;
      if (age < DAY) newToday++;
      if (age < 7 * DAY) new7++;
      if (age < 30 * DAY) {
        new30++;
        const src = l.source ?? "website";
        sourceCounts[src] = (sourceCounts[src] ?? 0) + 1;
        if (status === "booked") {
          booked30++;
          bookedValue30 += l.estimatedValue ?? 0;
        }
        if (status === "booked" || status === "lost") closed30++;
      }
      if (status === "new") uncontacted++;
      if (l.nextFollowUp && l.nextFollowUp < args.today && status !== "booked" && status !== "lost") {
        overdueFollowUps++;
      }
      if (l.firstContactAt) {
        responseSum += l.firstContactAt - l._creationTime;
        responseN++;
      }
    }

    const live = jobs.filter((j) => j.status !== "cancelled");
    const todayJobs = live.filter((j) => j.date === args.today);
    const openQuotes = estimates.filter((e) => e.status === "sent");

    return {
      newToday,
      new7,
      new30,
      uncontacted,
      overdueFollowUps,
      conversionRate: closed30 ? Math.round((booked30 / closed30) * 100) : null,
      booked30,
      bookedValue30,
      avgResponseMins: responseN ? Math.round(responseSum / responseN / 60000) : null,
      statusCounts,
      sourceCounts,
      jobsToday: todayJobs.length,
      jobsWeek: live.length,
      unassignedJobs: live.filter((j) => j.status === "unassigned").length,
      openQuotes: openQuotes.length,
      openQuotesValue: openQuotes.reduce((s, e) => s + computeQuote(e).total, 0),
      todayJobs: todayJobs
        .sort((a, b) => a.timeSlot.localeCompare(b.timeSlot))
        .map((j) => ({
          _id: j._id,
          customerName: j.customerName,
          timeSlot: j.timeSlot,
          status: j.status,
          pickupAddress: j.pickupAddress,
          assignees: j.assigneeIds.length,
        })),
      recentLeads: leads.slice(0, 6).map((l) => ({
        _id: l._id,
        name: l.name,
        movingFrom: l.movingFrom,
        status: l.crmStatus ?? "new",
        _creationTime: l._creationTime,
      })),
    };
  },
});
