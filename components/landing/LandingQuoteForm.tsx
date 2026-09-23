"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

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

  const router = useRouter();
  const [movingFrom, setMovingFrom] = useState("");
  const [movingTo, setMovingTo] = useState("");
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
      const result = (await response.json()) as { token?: string; reference?: number };

      // Step 2 lives on its own page — the token identifies the record it
      // should attach to. Keep the spinner running through the navigation.
      const params = new URLSearchParams();
      if (result.token) params.set("t", result.token);
      if (result.reference) params.set("ref", String(result.reference));
      router.push(`/local-movers-melbourne/thank-you?${params.toString()}`);
    } catch {
      setError("Something went wrong sending your request. Please try again or give us a call.");
      setSubmitting(false);
    }
  }

  return (
    <div id={id} className="mx-auto w-full max-w-[400px] scroll-mt-28 overflow-hidden rounded-md bg-white shadow-floating">
      <div className="bg-clay-500 px-5 py-3 text-center">
        <div className="font-display text-lg font-bold leading-tight text-white">{heading}</div>
      </div>
      <form className="grid gap-2.5 px-5 pt-4 pb-5" onSubmit={handleSubmit}>
        <p className="m-0 mb-0.5 text-center font-display text-[14px] font-semibold leading-[1.5] text-ink-800">
          {subheading}
        </p>

        <input
          name="movingFrom"
          required
          placeholder="Pickup Location"
          aria-label="Pickup Location"
          value={movingFrom}
          onChange={(e) => setMovingFrom(e.target.value)}
          className="w-full min-w-0 rounded-sm border-[1.5px] border-border bg-white px-3.5 py-2.5 font-sans text-[15px] text-ink-800 outline-none transition-shadow placeholder:text-ink-400 focus:border-teal-500 focus:shadow-[0_0_0_4px_rgba(44,95,138,0.15)]"
        />
        <input
          name="movingTo"
          required
          placeholder="Drop-Off Location"
          aria-label="Drop-Off Location"
          value={movingTo}
          onChange={(e) => setMovingTo(e.target.value)}
          className="w-full min-w-0 rounded-sm border-[1.5px] border-border bg-white px-3.5 py-2.5 font-sans text-[15px] text-ink-800 outline-none transition-shadow placeholder:text-ink-400 focus:border-teal-500 focus:shadow-[0_0_0_4px_rgba(44,95,138,0.15)]"
        />

        <input
          name="name"
          required
          placeholder="Your Name"
          autoComplete="name"
          className="w-full min-w-0 rounded-sm border-[1.5px] border-border bg-white px-3.5 py-2.5 font-sans text-[15px] text-ink-800 outline-none transition-shadow placeholder:text-ink-400 focus:border-teal-500 focus:shadow-[0_0_0_4px_rgba(44,95,138,0.15)]"
        />
        <input
          name="phone"
          type="tel"
          required
          inputMode="tel"
          maxLength={14}
          placeholder="Your Phone Number"
          autoComplete="tel"
          className="w-full min-w-0 rounded-sm border-[1.5px] border-border bg-white px-3.5 py-2.5 font-sans text-[15px] text-ink-800 outline-none transition-shadow placeholder:text-ink-400 focus:border-teal-500 focus:shadow-[0_0_0_4px_rgba(44,95,138,0.15)]"
        />
        <input
          name="email"
          type="email"
          required
          placeholder="Your E-Mail"
          autoComplete="email"
          className="w-full min-w-0 rounded-sm border-[1.5px] border-border bg-white px-3.5 py-2.5 font-sans text-[15px] text-ink-800 outline-none transition-shadow placeholder:text-ink-400 focus:border-teal-500 focus:shadow-[0_0_0_4px_rgba(44,95,138,0.15)]"
        />
        <div>
          <label className="mb-1 block font-display text-xs font-semibold uppercase tracking-wide text-ink-400">
            Choose your moving date
          </label>
          <input
            name="moveDate"
            type="date"
            required
            min={minDate}
            max={maxDate}
            defaultValue={minDate}
            className="w-full min-w-0 rounded-sm border-[1.5px] border-border bg-white px-3.5 py-2.5 font-sans text-[15px] text-ink-800 outline-none transition-shadow focus:border-teal-500 focus:shadow-[0_0_0_4px_rgba(44,95,138,0.15)]"
          />
        </div>

        <label className="flex items-start gap-2 text-[12px] leading-[1.5] text-ink-600">
          <input type="checkbox" name="terms" required defaultChecked className="mt-0.5 shrink-0" />
          <span>I agree to be contacted about my move and accept the terms and privacy policy.</span>
        </label>

        {error && <div className="text-sm text-danger">{error}</div>}

        <button
          type="submit"
          disabled={submitting}
          className="mt-1 w-full cursor-pointer rounded-sm bg-teal-500 px-6 py-3.5 font-display text-[17px] font-bold tracking-wide text-white transition-colors hover:bg-teal-600 disabled:cursor-default disabled:opacity-70"
        >
          {submitting ? "Sending…" : "GET A FREE QUOTE →"}
        </button>
      </form>
    </div>
  );
}
