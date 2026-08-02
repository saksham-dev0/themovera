"use client";

import { useState } from "react";

type VideoItem = { type: "video"; src: string };
type QuoteItem = { type: "quote"; quote: string; name: string; suburb: string; initials: string };
type MarqueeItem = VideoItem | QuoteItem;

const items: MarqueeItem[] = [
  { type: "video", src: "/review1.mp4" },
  {
    type: "quote",
    quote:
      "I'd been burned by a comparison-site mover before — hidden fees, no-show crew, a nightmare. Movera was the opposite.",
    name: "Sarah M.",
    suburb: "South Yarra",
    initials: "SM",
  },
  {
    type: "quote",
    quote: "After-hours, no downtime, and not a single workstation damaged across two office moves.",
    name: "James K.",
    suburb: "Fitzroy",
    initials: "JK",
  },
  { type: "video", src: "/review.mp4" },
  {
    type: "quote",
    quote: "Called at 6am needing a same-day move. Confirmed by 7am, crew there by 1pm. No drama.",
    name: "Portia D.",
    suburb: "Brunswick",
    initials: "PD",
  },
  { type: "video", src: "/review2.mp4" },
  {
    type: "quote",
    quote: "Wrapped everything properly, even for a small move with just a few items of furniture.",
    name: "Ben H.",
    suburb: "St Kilda",
    initials: "BH",
  },
];

const track = [...items, ...items];

function MarqueeCard({ item }: { item: MarqueeItem }) {
  if (item.type === "quote") {
    return (
      <div className="w-[240px] sm:w-[280px] h-[360px] shrink-0 bg-white border border-border rounded-md p-6 shadow-raised flex flex-col justify-center">
        <div className="text-gold-400 text-base mb-3">★★★★★</div>
        <p className="m-0 mb-5 text-sm leading-[1.65] text-ink-600">&ldquo;{item.quote}&rdquo;</p>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-pill bg-teal-500 text-white grid place-items-center text-xs font-display font-semibold shrink-0">
            {item.initials}
          </div>
          <div className="text-sm text-ink-800 font-display font-semibold">
            {item.name} <span className="text-ink-400 font-normal font-sans">— {item.suburb}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-[240px] sm:w-[280px] h-[360px] shrink-0 rounded-md overflow-hidden border border-border bg-ink-900 shadow-raised">
      <video
        src={item.src}
        controls
        loop
        playsInline
        preload="metadata"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="pointer-events-none absolute top-3 left-3 bg-white/95 rounded-pill px-3 py-1 text-[11px] font-display font-semibold text-ink-800 flex items-center gap-1.5">
        <span className="text-gold-400">★★★★★</span>
        Verified
      </div>
    </div>
  );
}

export function ReviewsMarquee() {
  const [paused, setPaused] = useState(false);

  return (
    <div
      className="relative overflow-hidden py-2 [mask-image:linear-gradient(to_right,transparent,black_5%,black_95%,transparent)]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={() => setPaused((v) => !v)}
    >
      <div
        className="flex gap-5 w-max animate-marquee-ltr"
        style={{ animationPlayState: paused ? "paused" : "running" }}
      >
        {track.map((item, i) => (
          <MarqueeCard key={i} item={item} />
        ))}
      </div>
    </div>
  );
}
