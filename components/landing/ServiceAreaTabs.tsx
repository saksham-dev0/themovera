"use client";

import { useState } from "react";

export function ServiceAreaTabs({ areas }: { areas: { region: string; suburbs: string[] }[] }) {
  const [active, setActive] = useState(0);

  return (
    <div>
      <div className="mb-6 flex flex-wrap justify-center gap-2">
        {areas.map((area, i) => (
          <button
            key={area.region}
            type="button"
            onClick={() => setActive(i)}
            className={`cursor-pointer rounded-pill border px-4 py-2 font-display text-[13px] font-semibold transition-colors ${
              active === i
                ? "border-teal-500 bg-teal-500 text-white"
                : "border-border bg-white text-ink-600 hover:border-teal-200"
            }`}
          >
            {area.region}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-x-4 gap-y-2.5 sm:grid-cols-3 lg:grid-cols-4">
        {areas[active].suburbs.map((suburb) => (
          <div key={suburb} className="flex items-center gap-2 text-sm text-ink-600">
            <span className="text-teal-500">›</span>
            {suburb} Removalists
          </div>
        ))}
      </div>
    </div>
  );
}
