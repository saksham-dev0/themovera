"use client";

import { useState } from "react";

export function SegmentedToggle({ options }: { options: string[] }) {
  const [active, setActive] = useState(options[0]);
  return (
    <div className="inline-flex bg-teal-50 rounded-pill p-1">
      {options.map((label) => {
        const on = label === active;
        return (
          <button
            key={label}
            onClick={() => setActive(label)}
            className={`font-display font-semibold text-sm rounded-pill px-7 py-2.5 cursor-pointer transition-colors ${
              on ? "bg-white text-teal-500 shadow-[0_2px_8px_rgba(24,44,38,0.12)]" : "bg-transparent text-ink-600"
            }`}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
