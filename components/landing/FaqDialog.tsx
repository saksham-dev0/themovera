"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Footer "FAQs" trigger that opens the question set in a panel.
 *
 * Sized so it never takes over the whole screen: a bottom sheet capped at 80% of
 * the *dynamic* viewport on mobile (dvh, so a visible browser toolbar can't push
 * the close button off-screen the way vh does), and a centred modal on larger
 * screens. The page stays visible behind a light scrim, the header with the
 * close button is pinned outside the scroll area, and the list scrolls inside
 * itself rather than scrolling the page behind it.
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

  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const close = useCallback(() => setOpen(false), []);

  // Lock the page behind the panel without letting the layout jump.
  useEffect(() => {
    if (!open) return;
    const { body, documentElement } = document;
    const previousOverflow = body.style.overflow;
    const previousPaddingRight = body.style.paddingRight;

    // Replacing the scrollbar with equivalent padding stops the content shifting
    // sideways the moment the panel opens.
    const scrollbarWidth = window.innerWidth - documentElement.clientWidth;
    body.style.overflow = "hidden";
    if (scrollbarWidth > 0) body.style.paddingRight = `${scrollbarWidth}px`;

    return () => {
      body.style.overflow = previousOverflow;
      body.style.paddingRight = previousPaddingRight;
    };
  }, [open]);

  // Esc to close, Tab kept inside the panel, focus returned to the trigger.
  useEffect(() => {
    if (!open) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const trigger = triggerRef.current;
    closeRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        close();
        return;
      }
      if (event.key !== "Tab" || !panelRef.current) return;

      const focusable = panelRef.current.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      (previouslyFocused ?? trigger)?.focus?.();
    };
  }, [open, close]);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        className={triggerClassName}
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => setOpen(true)}
      >
        {triggerLabel}
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-ink-900/50 p-0 sm:items-center sm:p-6"
          onClick={close}
        >
          <div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label="Frequently asked questions"
            onClick={(e) => e.stopPropagation()}
            className="flex max-h-[80dvh] w-full max-w-[680px] flex-col overflow-hidden rounded-t-2xl bg-white shadow-floating sm:max-h-[75dvh] sm:rounded-md"
          >
            {/* Grab handle — reads as a dismissable sheet on mobile. */}
            <div className="flex justify-center pt-2.5 sm:hidden">
              <span className="h-1 w-10 rounded-pill bg-border" />
            </div>

            <div className="flex shrink-0 items-center justify-between gap-4 border-b border-border px-5 py-3.5 sm:px-6 sm:py-4">
              <div className="font-display text-base font-bold text-ink-800 sm:text-lg">
                Frequently Asked Questions
              </div>
              <button
                ref={closeRef}
                type="button"
                aria-label="Close"
                onClick={close}
                className="grid h-9 w-9 shrink-0 cursor-pointer place-items-center rounded-pill border-0 bg-gray-50 text-ink-600 hover:bg-gray-100"
              >
                ✕
              </button>
            </div>

            <div className="grid min-h-0 flex-1 auto-rows-min gap-2.5 overflow-y-auto overscroll-contain px-5 py-4 sm:px-6 sm:py-5">
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
                      className={`flex w-full cursor-pointer items-center justify-between gap-3 border-none px-4 py-3.5 text-left font-display text-sm font-semibold leading-snug text-ink-800 transition-colors ${
                        isOpen ? "bg-teal-50" : "bg-white"
                      }`}
                    >
                      {item.q}
                      <span className="shrink-0 text-base text-teal-500">{isOpen ? "▴" : "▾"}</span>
                    </button>
                    {isOpen && (
                      <div className="border-t border-teal-200 bg-teal-50 px-4 py-3.5 text-sm leading-[1.65] text-ink-600">
                        {item.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="shrink-0 border-t border-border bg-gray-50 px-5 py-3 text-center sm:px-6">
              <button
                type="button"
                onClick={close}
                className="cursor-pointer border-0 bg-transparent font-display text-sm font-semibold text-teal-500"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
