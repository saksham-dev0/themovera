import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { internal } from "./_generated/api";

/**
 * Landing-page quote submissions arrive over plain HTTP rather than the Convex
 * WebSocket client, so /local-movers-melbourne ships no Convex JS at all.
 */
const http = httpRouter();

const ALLOWED_ORIGINS = (process.env.ALLOWED_FORM_ORIGINS ?? "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

function corsHeaders(origin: string | null) {
  const allowed =
    ALLOWED_ORIGINS.length === 0
      ? "*"
      : origin && ALLOWED_ORIGINS.includes(origin)
        ? origin
        : ALLOWED_ORIGINS[0];
  return {
    "Access-Control-Allow-Origin": allowed,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
    Vary: "Origin",
  };
}

function requiredString(value: unknown, max = 200): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if (!trimmed || trimmed.length > max) return null;
  return trimmed;
}

http.route({
  path: "/landing-quote",
  method: "OPTIONS",
  handler: httpAction(async (_ctx, request) => {
    return new Response(null, { status: 204, headers: corsHeaders(request.headers.get("Origin")) });
  }),
});

http.route({
  path: "/landing-quote",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const headers = { ...corsHeaders(request.headers.get("Origin")), "Content-Type": "application/json" };

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return new Response(JSON.stringify({ error: "Invalid JSON body" }), { status: 400, headers });
    }
    if (typeof body !== "object" || body === null) {
      return new Response(JSON.stringify({ error: "Invalid body" }), { status: 400, headers });
    }

    const raw = body as Record<string, unknown>;
    const name = requiredString(raw.name, 120);
    const phone = requiredString(raw.phone, 30);
    const email = requiredString(raw.email, 200);
    const moveDate = requiredString(raw.moveDate, 20);
    const movingFrom = requiredString(raw.movingFrom, 120);
    const movingTo = requiredString(raw.movingTo, 120);
    const source = requiredString(raw.source, 80) ?? "local-movers-melbourne";

    if (!name || !phone || !email || !moveDate || !movingFrom || !movingTo) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400, headers });
    }
    if (!email.includes("@") || !/^\d{4}-\d{2}-\d{2}$/.test(moveDate)) {
      return new Response(JSON.stringify({ error: "Invalid email or date" }), { status: 400, headers });
    }

    await ctx.runMutation(internal.quotes.recordLandingQuote, {
      name,
      phone,
      email,
      moveDate,
      movingFrom,
      movingTo,
      source,
    });

    return new Response(JSON.stringify({ ok: true }), { status: 200, headers });
  }),
});

export default http;
