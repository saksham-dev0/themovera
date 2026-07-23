"use client";

import { useState } from "react";

export function Tabs({ items }: { items: { label: string; body: string }[] }) {
  const [active, setActive] = useState(0);
  return (
    <div>
      <div className="flex gap-7 border-b-[1.5px] border-border mb-4.5">
        {items.map((item, i) => (
          <button
            key={item.label}
            onClick={() => setActive(i)}
            className={`font-display font-semibold text-sm bg-transparent cursor-pointer pt-2.5 px-0.5 pb-3 ${
              active === i ? "text-teal-500 shadow-[inset_0_-3px_0_#1a7f72]" : "text-ink-600"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>
      <p className="m-0 text-sm leading-[1.65] text-ink-600">{items[active].body}</p>
    </div>
  );
}
