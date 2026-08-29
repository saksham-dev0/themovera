import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { internal } from "./_generated/api";

/**
 * Landing-page quote submissions arrive over plain HTTP rather than the Convex
 * WebSocket client, so /local-movers-melbourne ships no Convex JS at all.
 *
 * Two steps: /landing-quote captures the lead and hands back a token, then
 * /landing-quote-step2 attaches the extra move detail against that token.
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

function optionalString(value: unknown, max = 600): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

/**
 * Caller IP, taken from the proxy headers rather than a client-supplied field
 * so it cannot simply be typed in by the submitter.
 */
function clientIp(request: Request): string {
  const forwarded = request.headers.get("X-Forwarded-For");
  if (forwarded) return forwarded.split(",")[0].trim().slice(0, 60);
  return (
    request.headers.get("CF-Connecting-IP") ??
    request.headers.get("X-Real-IP") ??
    "unknown"
  ).slice(0, 60);
}

function preflight(path: string) {
  http.route({
    path,
    method: "OPTIONS",
    handler: httpAction(async (_ctx, request) => {
      return new Response(null, {
        status: 204,
        headers: corsHeaders(request.headers.get("Origin")),
      });
    }),
  });
}

preflight("/landing-quote");
preflight("/landing-quote-step2");

http.route({
  path: "/landing-quote",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const headers = {
      ...corsHeaders(request.headers.get("Origin")),
      "Content-Type": "application/json",
    };

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
    const movingFrom = requiredString(raw.movingFrom, 200);
    const movingTo = requiredString(raw.movingTo, 200);
    const source = requiredString(raw.source, 80) ?? "local-movers-melbourne";

    if (!name || !phone || !email || !moveDate || !movingFrom || !movingTo) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400,
        headers,
      });
    }
    if (!email.includes("@") || !/^\d{4}-\d{2}-\d{2}$/.test(moveDate)) {
      return new Response(JSON.stringify({ error: "Invalid email or date" }), {
        status: 400,
        headers,
      });
    }

    const stepTwoToken = crypto.randomUUID();

    const result = await ctx.runMutation(internal.quotes.recordLandingQuote, {
      name,
      phone,
      email,
      moveDate,
      movingFrom,
      movingTo,
      source,
      ipAddress: clientIp(request),
      userAgent: (request.headers.get("User-Agent") ?? "").slice(0, 300),
      stepTwoToken,
    });

    return new Response(
      JSON.stringify({ ok: true, reference: result.reference, token: result.token }),
      { status: 200, headers },
    );
  }),
});

http.route({
  path: "/landing-quote-step2",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const headers = {
      ...corsHeaders(request.headers.get("Origin")),
      "Content-Type": "application/json",
    };

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
    const token = requiredString(raw.token, 60);
    if (!token) {
      return new Response(JSON.stringify({ error: "Missing token" }), { status: 400, headers });
    }

    const result = await ctx.runMutation(internal.quotes.recordStepTwo, {
      token,
      details: {
        propertyType: optionalString(raw.propertyType, 60),
        bedrooms: optionalString(raw.bedrooms, 60),
        pickupAccess: optionalString(raw.pickupAccess, 60),
        dropoffAccess: optionalString(raw.dropoffAccess, 60),
        preferredTime: optionalString(raw.preferredTime, 60),
        packingHelp: optionalString(raw.packingHelp, 60),
        specialItems: optionalString(raw.specialItems, 400),
        notes: optionalString(raw.notes, 1000),
      },
    });

    if (result === null) {
      return new Response(JSON.stringify({ error: "Unknown quote" }), { status: 404, headers });
    }

    return new Response(JSON.stringify({ ok: true, reference: result.reference }), {
      status: 200,
      headers,
    });
  }),
});

export default http;
