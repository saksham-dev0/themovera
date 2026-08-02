"use client";

import { useRouter } from "next/navigation";
import { useMemo, useRef, useState } from "react";
import { melbourneSuburbs } from "@/app/data/suburbs";

export function HeroQuoteForm() {
  const router = useRouter();
  const [value, setValue] = useState("");
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const matches = useMemo(() => {
    const query = value.trim().toLowerCase();
    if (!query) return [];
    return melbourneSuburbs.filter((s) => s.toLowerCase().includes(query)).slice(0, 6);
  }, [value]);

  function goToQuote(suburb: string) {
    const params = suburb.trim() ? `?from=${encodeURIComponent(suburb.trim())}` : "";
    router.push(`/quote${params}`);
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    goToQuote(value);
  }

  return (
    <div ref={containerRef} className="relative bg-white rounded-md shadow-floating p-2 w-full max-w-[520px]">
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-stretch gap-2">
        <input
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          placeholder="Where are you moving from?"
          className="flex-1 min-w-0 border-none outline-none px-5 py-3.5 font-sans text-[15px] text-ink-800 bg-transparent placeholder:text-ink-400"
        />
        <button
          type="submit"
          className="inline-flex items-center justify-center gap-2 font-display font-semibold text-white bg-teal-500 hover:bg-teal-600 rounded-pill text-[15px] px-6 py-3.5 transition-colors"
        >
          Get a Quote →
        </button>
      </form>

      {open && matches.length > 0 && (
        <ul className="absolute left-2 right-2 top-full mt-2 bg-white border border-border rounded-md shadow-floating overflow-hidden z-10 py-1">
          {matches.map((suburb) => (
            <li key={suburb}>
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => {
                  setValue(suburb);
                  setOpen(false);
                  goToQuote(suburb);
                }}
                className="w-full text-left px-5 py-2.5 text-[15px] text-ink-800 hover:bg-gray-100 transition-colors"
              >
                {suburb}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
