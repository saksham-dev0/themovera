"use client";

import { useEffect, useState } from "react";

/**
 * Footer "FAQs" trigger that opens the full question set in a modal, matching
 * the pop-up FAQ pattern on the reference layout.
 */
export function FaqDialog({
  items,
  triggerLabel = "FAQs",
  triggerClassName = "cursor-pointer border-0 bg-transparent p-0 text-left text-sm text-white hover:text-teal-500",
}: {
  items: { q: string; a: string }[];
  triggerLabel?: string;
  triggerClassName?: string;
}) {
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState<number | null>(0);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  return (
    <>
      <button type="button" className={triggerClassName} onClick={() => setOpen(true)}>
        {triggerLabel}
      </button>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Frequently asked questions"
          className="fixed inset-0 z-50 grid place-items-center bg-ink-900/70 p-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="flex max-h-[85vh] w-full max-w-[680px] flex-col overflow-hidden rounded-md bg-white shadow-floating"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-4 border-b border-border px-6 py-4">
              <div className="font-display text-lg font-bold text-ink-800">
                Frequently Asked Questions
              </div>
              <button
                type="button"
                aria-label="Close"
                onClick={() => setOpen(false)}
                className="grid h-9 w-9 cursor-pointer place-items-center rounded-pill border-0 bg-gray-50 text-ink-600 hover:bg-gray-100"
              >
                ✕
              </button>
            </div>

            <div className="grid gap-2.5 overflow-y-auto px-6 py-5">
              {items.map((item, i) => {
                const isOpen = expanded === i;
                return (
                  <div
                    key={item.q}
                    className={`overflow-hidden rounded-[10px] border ${isOpen ? "border-teal-200" : "border-border"}`}
                  >
                    <button
                      type="button"
                      onClick={() => setExpanded(isOpen ? null : i)}
                      className={`flex w-full cursor-pointer items-center justify-between gap-3 border-none px-4 py-3.5 text-left font-display text-sm font-semibold text-ink-800 ${
                        isOpen ? "bg-teal-50" : "bg-white"
                      }`}
                    >
                      {item.q}
                      <span className="text-base text-teal-500">{isOpen ? "▴" : "▾"}</span>
                    </button>
                    {isOpen && (
                      <div className="bg-teal-50 px-4 pb-4 text-sm leading-[1.65] text-ink-600">
                        {item.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
