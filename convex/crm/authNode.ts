"use node";

import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import { ConvexError, v } from "convex/values";
import { action, internalAction } from "../_generated/server";
import { internal } from "../_generated/api";
import { staffRole } from "../schema";
import type { Doc, Id } from "../_generated/dataModel";

const KEY_LEN = 64;

function hashPassword(password: string, salt = randomBytes(16).toString("hex")) {
  const hash = scryptSync(password, salt, KEY_LEN, { N: 16384, r: 8, p: 1 }).toString("hex");
  return { hash, salt };
}

function verifyPassword(password: string, salt: string, expected: string) {
  const { hash } = hashPassword(password, salt);
  const a = Buffer.from(hash, "hex");
  const b = Buffer.from(expected, "hex");
  return a.length === b.length && timingSafeEqual(a, b);
}

function checkPassword(password: string) {
  if (password.length < 10) throw new ConvexError("Password must be at least 10 characters.");
  if (password.length > 200) throw new ConvexError("Password is too long.");
}

/** Sign in. Returns the session token the browser keeps in localStorage. */
export const login = action({
  args: { email: v.string(), password: v.string() },
  returns: v.object({ token: v.string() }),
  handler: async (ctx, args) => {
    const email = args.email.trim().toLowerCase();
    const staff: Doc<"staff"> | null = await ctx.runQuery(internal.crm.auth.getStaffByEmail, { email });
    const generic = new ConvexError("Incorrect email or password.");

    if (!staff || !staff.active) {
      // Spend the same time as a real check so unknown emails aren't detectable.
      hashPassword(args.password);
      throw generic;
    }
    if (staff.lockedUntil && staff.lockedUntil > Date.now()) {
      throw new ConvexError("Too many attempts. Try again in 15 minutes.");
    }
    if (!verifyPassword(args.password, staff.passwordSalt, staff.passwordHash)) {
      await ctx.runMutation(internal.crm.auth.recordLogin, { staffId: staff._id, ok: false });
      throw generic;
    }
    const token = randomBytes(32).toString("hex");
    await ctx.runMutation(internal.crm.auth.recordLogin, { staffId: staff._id, ok: true, token });
    return { token };
  },
});

/** Admin adds a staff account from the Team page. */
export const createStaff = action({
  args: {
    token: v.string(),
    name: v.string(),
    email: v.string(),
    role: staffRole,
    password: v.string(),
  },
  returns: v.id("staff"),
  handler: async (ctx, args): Promise<Id<"staff">> => {
    await ctx.runQuery(internal.crm.auth.checkAdminToken, { token: args.token });
    checkPassword(args.password);
    const { hash, salt } = hashPassword(args.password);
    return await ctx.runMutation(internal.crm.auth.insertStaff, {
      name: args.name.trim().slice(0, 100),
      email: args.email.trim().toLowerCase().slice(0, 200),
      role: args.role,
      passwordHash: hash,
      passwordSalt: salt,
    });
  },
});

/** Admin resets someone's password (signs them out everywhere). */
export const resetPassword = action({
  args: { token: v.string(), staffId: v.id("staff"), password: v.string() },
  returns: v.null(),
  handler: async (ctx, args) => {
    await ctx.runQuery(internal.crm.auth.checkAdminToken, { token: args.token });
    checkPassword(args.password);
    const { hash, salt } = hashPassword(args.password);
    await ctx.runMutation(internal.crm.auth.setPassword, {
      staffId: args.staffId,
      passwordHash: hash,
      passwordSalt: salt,
    });
    return null;
  },
});

/**
 * Bootstrap the first admin from the terminal (internal — not callable from
 * the browser):
 *   npx convex run crm/authNode:seedAdmin '{"name":"…","email":"…","password":"…"}'
 * Refuses once any staff account exists.
 */
export const seedAdmin = internalAction({
  args: { name: v.string(), email: v.string(), password: v.string() },
  returns: v.id("staff"),
  handler: async (ctx, args): Promise<Id<"staff">> => {
    const count: number = await ctx.runQuery(internal.crm.auth.countStaff, {});
    if (count > 0) throw new ConvexError("Staff already exist — add more from /crm/team.");
    checkPassword(args.password);
    const { hash, salt } = hashPassword(args.password);
    return await ctx.runMutation(internal.crm.auth.insertStaff, {
      name: args.name.trim(),
      email: args.email.trim().toLowerCase(),
      role: "admin",
      passwordHash: hash,
      passwordSalt: salt,
    });
  },
});
