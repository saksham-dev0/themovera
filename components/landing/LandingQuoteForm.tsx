"use client";

import { useMemo, useState } from "react";
import { SuburbInput } from "@/components/landing/SuburbInput";

/**
 * Submissions go over plain HTTP to the Convex /landing-quote endpoint rather
 * than through the Convex browser client, so this page ships no Convex JS.
 */
const QUOTE_ENDPOINT = `${process.env.NEXT_PUBLIC_CONVEX_SITE_URL}/landing-quote`;

/** Melbourne-local YYYY-MM-DD, `offsetDays` days from now. */
function melbourneDate(offsetDays: number) {
  const now = new Date();
  const melbourneNow = new Date(
    now.toLocaleString("en-US", { timeZone: "Australia/Melbourne" }),
  );
  melbourneNow.setDate(melbourneNow.getDate() + offsetDays);
  const y = melbourneNow.getFullYear();
  const m = String(melbourneNow.getMonth() + 1).padStart(2, "0");
  const d = String(melbourneNow.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function LandingQuoteForm({
  id,
  heading = "Get Your Free Quote in 60 Seconds",
  subheading = "Two Men and a Truck, ready when you are. No obligation, no five movers calling you back.",
  source = "local-movers-melbourne",
}: {
  id?: string;
  heading?: string;
  subheading?: string;
  source?: string;
}) {
  // Customers may only pick today or tomorrow (Melbourne time).
  const { minDate, maxDate } = useMemo(
    () => ({ minDate: melbourneDate(0), maxDate: melbourneDate(1) }),
    [],
  );

  const [movingFrom, setMovingFrom] = useState("");
  const [movingTo, setMovingTo] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const formData = new FormData(e.currentTarget);
    const moveDate = String(formData.get("moveDate") ?? "");
    if (moveDate < minDate || moveDate > maxDate) {
      setError("Please choose today or tomorrow. For a later date, call us and we'll book it in.");
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch(QUOTE_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: String(formData.get("name") ?? "").trim(),
          phone: String(formData.get("phone") ?? "").trim(),
          email: String(formData.get("email") ?? "").trim(),
          moveDate,
          movingFrom: movingFrom.trim(),
          movingTo: movingTo.trim(),
          source,
        }),
      });
      if (!response.ok) throw new Error(`Request failed: ${response.status}`);
      setSubmitted(true);
    } catch {
      setError("Something went wrong sending your request. Please try again or give us a call.");
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div
        id={id}
        className="scroll-mt-28 rounded-md bg-white p-8 text-center shadow-floating"
      >
        <div className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-pill bg-teal-100 text-2xl text-teal-500">
          ✓
        </div>
        <div className="mb-2 font-display text-2xl font-bold text-ink-800">Quote request sent!</div>
        <p className="m-0 text-sm leading-[1.6] text-ink-600">
          A thank-you email is on its way to your inbox, and one of our Melbourne removalists will
          call you shortly with your price.
        </p>
      </div>
    );
  }

  return (
    <div id={id} className="scroll-mt-28 overflow-hidden rounded-md bg-white shadow-floating">
      <div className="bg-clay-500 px-6 py-4 text-center">
        <div className="font-display text-lg font-bold leading-tight text-white">{heading}</div>
      </div>
      <form className="grid gap-3 p-6" onSubmit={handleSubmit}>
        <p className="m-0 text-center text-[13px] leading-[1.55] text-ink-600">{subheading}</p>

        <SuburbInput
          name="movingFrom"
          label="Pickup suburb"
          placeholder="Pickup suburb"
          value={movingFrom}
          onChange={setMovingFrom}
        />
        <SuburbInput
          name="movingTo"
          label="Drop-off suburb"
          placeholder="Drop-off suburb"
          value={movingTo}
          onChange={setMovingTo}
        />

        <input
          name="name"
          required
          placeholder="Your Name"
          autoComplete="name"
          className="w-full min-w-0 rounded-sm border-[1.5px] border-border bg-white px-4 py-3 font-sans text-[15px] text-ink-800 outline-none transition-shadow placeholder:text-ink-400 focus:border-teal-500 focus:shadow-[0_0_0_4px_rgba(44,95,138,0.15)]"
        />
        <input
          name="phone"
          type="tel"
          required
          inputMode="tel"
          maxLength={14}
          placeholder="Your Phone Number"
          autoComplete="tel"
          className="w-full min-w-0 rounded-sm border-[1.5px] border-border bg-white px-4 py-3 font-sans text-[15px] text-ink-800 outline-none transition-shadow placeholder:text-ink-400 focus:border-teal-500 focus:shadow-[0_0_0_4px_rgba(44,95,138,0.15)]"
        />
        <input
          name="email"
          type="email"
          required
          placeholder="Your E-Mail"
          autoComplete="email"
          className="w-full min-w-0 rounded-sm border-[1.5px] border-border bg-white px-4 py-3 font-sans text-[15px] text-ink-800 outline-none transition-shadow placeholder:text-ink-400 focus:border-teal-500 focus:shadow-[0_0_0_4px_rgba(44,95,138,0.15)]"
        />
        <div>
          <label className="mb-1 block font-display text-xs font-semibold uppercase tracking-wide text-ink-400">
            Move date
          </label>
          <input
            name="moveDate"
            type="date"
            required
            min={minDate}
            max={maxDate}
            defaultValue={minDate}
            className="w-full min-w-0 rounded-sm border-[1.5px] border-border bg-white px-4 py-3 font-sans text-[15px] text-ink-800 outline-none transition-shadow focus:border-teal-500 focus:shadow-[0_0_0_4px_rgba(44,95,138,0.15)]"
          />
          <div className="mt-1 text-[11px] text-ink-400">
            Today or tomorrow only — call us for a later date.
          </div>
        </div>

        <label className="flex items-start gap-2 text-[12px] leading-[1.5] text-ink-600">
          <input type="checkbox" name="terms" required defaultChecked className="mt-0.5 shrink-0" />
          <span>I agree to be contacted about my move and accept the terms and privacy policy.</span>
        </label>

        {error && <div className="text-sm text-danger">{error}</div>}

        <button
          type="submit"
          disabled={submitting}
          className="mt-1 w-full cursor-pointer rounded-sm bg-teal-500 px-6 py-3.5 font-display text-[15px] font-semibold text-white transition-colors hover:bg-teal-600 disabled:cursor-default disabled:opacity-70"
        >
          {submitting ? "Sending…" : "GET A FREE QUOTE →"}
        </button>
      </form>
    </div>
  );
}
