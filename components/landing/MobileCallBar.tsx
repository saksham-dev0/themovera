import { PHONE_DISPLAY, PHONE_TEL } from "@/app/local-movers-melbourne/content";
import { IconPhone } from "@/components/landing/Icons";

/**
 * Fixed call bar pinned to the bottom of the viewport on mobile. Phone number
 * only — it stays visible for the whole scroll, so it is the one CTA that must
 * never be crowded by anything else.
 */
export function MobileCallBar() {
  return (
    <a
      href={`tel:${PHONE_TEL}`}
      className="fixed inset-x-0 bottom-0 z-40 flex items-center justify-center gap-3 bg-clay-500 px-4 py-3 text-white no-underline shadow-floating active:bg-clay-600 md:hidden"
    >
      <IconPhone className="h-6 w-6" />
      <span className="flex flex-col leading-tight">
        <span className="font-display text-[10px] font-semibold uppercase tracking-[1.5px] text-white/80">
          Call Now
        </span>
        <span className="font-display text-[22px] font-bold tracking-wide">{PHONE_DISPLAY}</span>
      </span>
    </a>
  );
}
