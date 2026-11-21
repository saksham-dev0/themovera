import { ConvexError, v } from "convex/values";
import { internalMutation, internalQuery, mutation, query } from "../_generated/server";
import { staffRole } from "../schema";
import { requireStaff, requireStaffMutation } from "./session";

const SESSION_MS = 1000 * 60 * 60 * 12; // 12-hour working day
const MAX_FAILED = 5;
const LOCK_MS = 1000 * 60 * 15;

const staffPublic = v.object({
  _id: v.id("staff"),
  name: v.string(),
  email: v.string(),
  role: staffRole,
  active: v.boolean(),
});

/** Current user for the session, or null when signed out/expired. */
export const me = query({
  args: { token: v.string() },
  returns: v.union(staffPublic, v.null()),
  handler: async (ctx, args) => {
    try {
      const s = await requireStaff(ctx, args.token);
      return { _id: s._id, name: s.name, email: s.email, role: s.role, active: s.active };
    } catch {
      return null;
    }
  },
});

export const logout = mutation({
  args: { token: v.string() },
  returns: v.null(),
  handler: async (ctx, args) => {
    const session = await ctx.db
      .query("sessions")
      .withIndex("by_token", (q) => q.eq("token", args.token))
      .unique();
    if (session) await ctx.db.delete("sessions", session._id);
    return null;
  },
});

/** Staff list for owner/assignee pickers. */
export const listStaff = query({
  args: { token: v.string() },
  returns: v.array(staffPublic),
  handler: async (ctx, args) => {
    await requireStaff(ctx, args.token);
    const rows = await ctx.db.query("staff").take(200);
    return rows.map((s) => ({ _id: s._id, name: s.name, email: s.email, role: s.role, active: s.active }));
  },
});

export const updateStaff = mutation({
  args: {
    token: v.string(),
    staffId: v.id("staff"),
    role: staffRole,
    active: v.boolean(),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const me = await requireStaffMutation(ctx, args.token, ["admin"]);
    if (me._id === args.staffId && (!args.active || args.role !== "admin")) {
      throw new ConvexError("You can't remove your own admin access.");
    }
    await ctx.db.patch("staff", args.staffId, { role: args.role, active: args.active });
    if (!args.active) {
      const sessions = await ctx.db
        .query("sessions")
        .withIndex("by_staffId", (q) => q.eq("staffId", args.staffId))
        .take(100);
      for (const s of sessions) await ctx.db.delete("sessions", s._id);
    }
    return null;
  },
});

// ───────────── internal, used by the Node actions in authNode.ts ─────────────

export const getStaffByEmail = internalQuery({
  args: { email: v.string() },
  returns: v.any(),
  handler: async (ctx, args) =>
    await ctx.db
      .query("staff")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .unique(),
});

export const checkAdminToken = internalQuery({
  args: { token: v.string() },
  returns: v.id("staff"),
  handler: async (ctx, args) => (await requireStaff(ctx, args.token, ["admin"]))._id,
});

export const recordLogin = internalMutation({
  args: { staffId: v.id("staff"), ok: v.boolean(), token: v.optional(v.string()) },
  returns: v.null(),
  handler: async (ctx, args) => {
    const staff = await ctx.db.get("staff", args.staffId);
    if (!staff) return null;
    if (!args.ok) {
      const failed = (staff.failedLogins ?? 0) + 1;
      await ctx.db.patch("staff", staff._id, {
        failedLogins: failed >= MAX_FAILED ? 0 : failed,
        ...(failed >= MAX_FAILED ? { lockedUntil: Date.now() + LOCK_MS } : {}),
      });
      return null;
    }
    await ctx.db.patch("staff", staff._id, { failedLogins: 0, lockedUntil: undefined });
    if (args.token) {
      await ctx.db.insert("sessions", {
        staffId: staff._id,
        token: args.token,
        expiresAt: Date.now() + SESSION_MS,
      });
    }
    return null;
  },
});

export const insertStaff = internalMutation({
  args: {
    name: v.string(),
    email: v.string(),
    role: staffRole,
    passwordHash: v.string(),
    passwordSalt: v.string(),
  },
  returns: v.id("staff"),
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("staff")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .unique();
    if (existing) throw new ConvexError("A staff member with that email already exists.");
    return await ctx.db.insert("staff", { ...args, active: true });
  },
});

export const setPassword = internalMutation({
  args: { staffId: v.id("staff"), passwordHash: v.string(), passwordSalt: v.string() },
  returns: v.null(),
  handler: async (ctx, args) => {
    await ctx.db.patch("staff", args.staffId, {
      passwordHash: args.passwordHash,
      passwordSalt: args.passwordSalt,
      failedLogins: 0,
      lockedUntil: undefined,
    });
    // Sign the user out everywhere.
    const sessions = await ctx.db
      .query("sessions")
      .withIndex("by_staffId", (q) => q.eq("staffId", args.staffId))
      .take(100);
    for (const s of sessions) await ctx.db.delete("sessions", s._id);
    return null;
  },
});

export const countStaff = internalQuery({
  args: {},
  returns: v.number(),
  handler: async (ctx) => (await ctx.db.query("staff").take(1)).length,
});

/** Hourly cron: drop expired sessions so queries never see them. */
export const purgeExpiredSessions = internalMutation({
  args: {},
  returns: v.null(),
  handler: async (ctx) => {
    const now = Date.now();
    let removed = 0;
    for await (const s of ctx.db.query("sessions")) {
      if (s.expiresAt < now) {
        await ctx.db.delete("sessions", s._id);
        if (++removed >= 500) break;
      }
    }
    return null;
  },
});
