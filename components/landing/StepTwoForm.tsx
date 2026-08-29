"use client";

import { useState } from "react";

const ENDPOINT = `${process.env.NEXT_PUBLIC_CONVEX_SITE_URL}/landing-quote-step2`;

const fieldClass =
  "w-full min-w-0 rounded-sm border-[1.5px] border-border bg-white px-3.5 py-2.5 font-sans text-[15px] text-ink-800 outline-none transition-shadow placeholder:text-ink-400 focus:border-teal-500 focus:shadow-[0_0_0_4px_rgba(44,95,138,0.15)]";
const labelClass = "mb-1 block font-display text-xs font-semibold uppercase tracking-wide text-ink-400";

const selects = [
  {
    name: "propertyType",
    label: "Property type",
    options: ["House", "Apartment / unit", "Townhouse", "Office / commercial", "Storage unit"],
  },
  {
    name: "bedrooms",
    label: "Size of move",
    options: [
      "Single item",
      "Studio / 1 bedroom",
      "2 bedrooms",
      "3 bedrooms",
      "4 bedrooms",
      "5+ bedrooms",
    ],
  },
  {
    name: "pickupAccess",
    label: "Pickup access",
    options: ["Ground floor", "Stairs — 1 level", "Stairs — 2+ levels", "Lift available"],
  },
  {
    name: "dropoffAccess",
    label: "Drop-off access",
    options: ["Ground floor", "Stairs — 1 level", "Stairs — 2+ levels", "Lift available"],
  },
  {
    name: "preferredTime",
    label: "Preferred start time",
    options: ["Morning (7am – 11am)", "Midday (11am – 2pm)", "Afternoon (2pm – 6pm)", "Flexible"],
  },
  {
    name: "packingHelp",
    label: "Packing help needed?",
    options: ["No — I'll pack myself", "Fragile items only", "Full packing service", "Not sure yet"],
  },
];

export function StepTwoForm({ token }: { token: string }) {
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const payload: Record<string, string> = { token };
    for (const [key, value] of formData.entries()) payload[key] = String(value);

    try {
      const response = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error(`Request failed: ${response.status}`);
      setDone(true);
    } catch {
      setError("We couldn't save those details. Please try again, or tell us on the phone.");
    } finally {
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <div className="rounded-md border border-border bg-white p-8 text-center shadow-raised">
        <div className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-pill bg-teal-100 text-2xl text-teal-500">
          ✓
        </div>
        <div className="mb-2 font-display text-xl font-bold text-ink-800">
          Got it — that&apos;s everything we need
        </div>
        <p className="m-0 text-sm leading-[1.65] text-ink-600">
          Your coordinator has the full picture of your move and will call you shortly with a firm
          price.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-md border border-border bg-white p-6 shadow-raised sm:p-8"
    >
      <div className="mb-5">
        <h2 className="m-0 mb-1.5 font-display text-xl font-bold text-ink-800">
          Tell us a bit more about your move
        </h2>
        <p className="m-0 text-sm leading-[1.6] text-ink-600">
          Optional, but it gets you a far more accurate price — and saves a phone call.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {selects.map((field) => (
          <div key={field.name}>
            <label htmlFor={field.name} className={labelClass}>
              {field.label}
            </label>
            <select id={field.name} name={field.name} defaultValue="" className={fieldClass}>
              <option value="">Please select…</option>
              {field.options.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>

      <div className="mt-4">
        <label htmlFor="specialItems" className={labelClass}>
          Any large or fragile items?
        </label>
        <input
          id="specialItems"
          name="specialItems"
          placeholder="Piano, pool table, fridge, artwork…"
          className={fieldClass}
        />
      </div>

      <div className="mt-4">
        <label htmlFor="notes" className={labelClass}>
          Anything else we should know?
        </label>
        <textarea
          id="notes"
          name="notes"
          rows={4}
          placeholder="Parking, narrow driveway, settlement times, flexible dates…"
          className={`${fieldClass} resize-y`}
        />
      </div>

      {error && <div className="mt-4 text-sm text-danger">{error}</div>}

      <button
        type="submit"
        disabled={submitting}
        className="mt-5 w-full cursor-pointer rounded-sm bg-teal-500 px-6 py-3.5 font-display text-[17px] font-bold tracking-wide text-white transition-colors hover:bg-teal-600 disabled:cursor-default disabled:opacity-70"
      >
        {submitting ? "Sending…" : "SEND MY MOVE DETAILS →"}
      </button>
    </form>
  );
}
