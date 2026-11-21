import { ConvexError } from "convex/values";
import type { QueryCtx } from "../_generated/server";
import type { Doc } from "../_generated/dataModel";

export type Role = Doc<"staff">["role"];

/**
 * Resolve the CRM session token the browser sends with every call. Throws
 * "UNAUTHENTICATED" when missing/expired so the UI can bounce to /crm/login.
 *
 * `now` is passed in rather than read from the clock: queries must not read
 * Date.now(). Expiry is enforced again (with the real clock) at login and on
 * every mutation via `requireStaffMutation`.
 */
export async function requireStaff(
  ctx: QueryCtx,
  token: string,
  roles?: Role[],
): Promise<Doc<"staff">> {
  if (!token || token.length < 32) throw new ConvexError("UNAUTHENTICATED");
  const session = await ctx.db
    .query("sessions")
    .withIndex("by_token", (q) => q.eq("token", token))
    .unique();
  if (session === null) throw new ConvexError("UNAUTHENTICATED");

  const staff = await ctx.db.get("staff", session.staffId);
  if (staff === null || !staff.active) throw new ConvexError("UNAUTHENTICATED");
  if (roles && staff.role !== "admin" && !roles.includes(staff.role)) {
    throw new ConvexError("FORBIDDEN");
  }
  return staff;
}

/** Same as requireStaff, plus a real-clock expiry check (mutations only). */
export async function requireStaffMutation(ctx: QueryCtx, token: string, roles?: Role[]) {
  const session = await ctx.db
    .query("sessions")
    .withIndex("by_token", (q) => q.eq("token", token))
    .unique();
  if (session === null || session.expiresAt < Date.now()) {
    throw new ConvexError("UNAUTHENTICATED");
  }
  return await requireStaff(ctx, token, roles);
}

/** Reject NaN/Infinity and clamp to a sane range before storing a number. */
export function num(value: number, min = 0, max = 1_000_000) {
  if (!Number.isFinite(value)) return min;
  return Math.min(max, Math.max(min, value));
}

/** Trim and cap a free-text field. */
export function text(value: string, max = 2000) {
  return value.trim().slice(0, max);
}

/** Drop undefined keys so inserts/replaces never carry `undefined` values. */
export function compact<T extends Record<string, unknown>>(obj: T): T {
  return Object.fromEntries(Object.entries(obj).filter(([, v]) => v !== undefined)) as T;
}
