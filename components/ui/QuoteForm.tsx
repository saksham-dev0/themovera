"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input, Label } from "@/components/ui/Input";

export function QuoteForm({ defaultLocation = "" }: { defaultLocation?: string }) {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submitQuote = useMutation(api.quotes.submit);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const formData = new FormData(e.currentTarget);
      await submitQuote({
        name: String(formData.get("name") ?? ""),
        phone: String(formData.get("phone") ?? ""),
        email: String(formData.get("email") ?? ""),
        moveDate: String(formData.get("moveDate") ?? ""),
        movingFrom: String(formData.get("movingFrom") ?? ""),
      });
      setSubmitted(true);
    } catch {
      setError("Something went wrong sending your request. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <Card className="rounded-md p-8 shadow-floating text-center">
        <div className="w-12 h-12 rounded-pill bg-teal-100 text-teal-500 grid place-items-center text-2xl mx-auto mb-4">
          ✓
        </div>
        <div className="font-display font-bold text-2xl text-ink-800 mb-2">Quote request sent!</div>
        <p className="m-0 text-sm text-ink-400 leading-[1.6]">
          We&apos;ll be back to you with a genuine upfront quote within 2 hours.
        </p>
      </Card>
    );
  }

  return (
    <Card className="rounded-md p-8 shadow-floating">
      <h1 className="font-display font-bold text-2xl text-ink-800 m-0 mb-1.5">Get your free upfront quote</h1>
      <p className="m-0 mb-6 text-sm text-ink-400 leading-[1.5]">
        A genuine quote based on your move. No callbacks from 5 competing movers. Back to you in under 2 hours.
      </p>
      <form className="grid gap-4" onSubmit={handleSubmit}>
        <div className="grid gap-1.5">
          <Label htmlFor="quote-moving-from" className="text-xs uppercase tracking-wide">
            Moving from
          </Label>
          <Input
            id="quote-moving-from"
            name="movingFrom"
            placeholder="Suburb"
            defaultValue={defaultLocation}
            required
            className="bg-white"
          />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="quote-name" className="text-xs uppercase tracking-wide">
            Full name
          </Label>
          <Input id="quote-name" name="name" placeholder="Your name" required className="bg-white" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="grid gap-1.5">
            <Label htmlFor="quote-phone" className="text-xs uppercase tracking-wide">
              Phone number
            </Label>
            <Input id="quote-phone" name="phone" type="tel" placeholder="04XX XXX XXX" required className="bg-white" />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="quote-email" className="text-xs uppercase tracking-wide">
              Email
            </Label>
            <Input id="quote-email" name="email" type="email" placeholder="you@example.com" required className="bg-white" />
          </div>
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="quote-date" className="text-xs uppercase tracking-wide">
            Move date
          </Label>
          <Input id="quote-date" name="moveDate" type="date" required className="bg-white" />
        </div>
        {error && <div className="text-sm text-danger">{error}</div>}
        <Button type="submit" variant="primary" className="w-full mt-1" disabled={submitting}>
          {submitting ? "Sending…" : "Get My Free Quote →"}
        </Button>
        <div className="text-center text-xs text-ink-400">No obligation · Fully insured · $100k cover</div>
      </form>
    </Card>
  );
}
