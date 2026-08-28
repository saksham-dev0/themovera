import { PHONE_DISPLAY, PHONE_TEL } from "@/app/local-movers-melbourne/content";

/** Fixed call / quote bar pinned to the bottom of the viewport on mobile only. */
export function MobileCallBar() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-2 border-t border-white/10 shadow-floating md:hidden">
      <a
        href={`tel:${PHONE_TEL}`}
        className="flex items-center justify-center gap-2 bg-clay-500 px-3 py-3.5 font-display text-[14px] font-semibold text-white no-underline active:bg-clay-600"
      >
        ☎ {PHONE_DISPLAY}
      </a>
      <a
        href="#quote-form"
        className="flex items-center justify-center gap-2 bg-teal-500 px-3 py-3.5 font-display text-[14px] font-semibold text-white no-underline active:bg-teal-600"
      >
        GET A FREE QUOTE
      </a>
    </div>
  );
}
