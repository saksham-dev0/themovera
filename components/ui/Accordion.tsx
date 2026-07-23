"use client";

import { useState } from "react";

export function Accordion({ items }: { items: { q: string; a: string }[] }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="grid gap-2.5">
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <div
            key={item.q}
            className={`border rounded-[10px] overflow-hidden ${isOpen ? "border-teal-200" : "border-border"}`}
          >
            <button
              onClick={() => setOpen(isOpen ? null : i)}
              className={`w-full flex justify-between items-center gap-3 border-none px-4.5 py-3.5 cursor-pointer text-left font-display font-semibold text-sm text-ink-800 ${
                isOpen ? "bg-teal-50" : "bg-white"
              }`}
            >
              {item.q}
              <span className="text-teal-500 text-base">{isOpen ? "▴" : "▾"}</span>
            </button>
            {isOpen && (
              <div className="px-4.5 pb-4 text-sm leading-[1.65] bg-teal-50">{item.a}</div>
            )}
          </div>
        );
      })}
    </div>
  );
}
