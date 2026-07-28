import Image from "next/image";
import { Card } from "@/components/ui/Card";
import { Nav } from "@/components/ui/Nav";
import { CTABand, Footer } from "@/components/ui/Footer";

export const metadata = {
  title: "Reviews | Movera Removals & Storage",
  description: "4.9 stars from 5,527+ reviews — see what customers say about moving with Movera.",
};

type VideoTestimonial = {
  type: "video";
  src: string;
  aspect: string;
};
type PhotoTestimonial = {
  type: "photo";
  src: string;
  aspect: string;
};

const mediaTestimonials: (VideoTestimonial | PhotoTestimonial)[] = [
  { type: "video", src: "/review1.mp4", aspect: "aspect-[9/16]" },
  { type: "video", src: "/review.mp4", aspect: "aspect-[9/16]" },
  { type: "photo", src: "/review.jpeg", aspect: "aspect-[9/16]" },
  { type: "video", src: "/review2.mp4", aspect: "aspect-[9/16]" },
  // { type: "photo", src: "/review1.jpeg", aspect: "aspect-video" },
];

const reviews = [
  {
    quote:
      "I'd been burned by a comparison-site mover before — hidden fees, no-show crew, a nightmare. Movera was the opposite. Fixed price, on time, careful with our piano and antiques.",
    initials: "SM",
    name: "Sarah M.",
    suburb: "South Yarra",
  },
  {
    quote:
      "We've done two office relocations through Movera in three years. After-hours, no downtime, and not a single workstation damaged.",
    initials: "JK",
    name: "James K.",
    suburb: "Fitzroy",
  },
  {
    quote:
      "Called at 6am needing a same-day move. They quoted fixed price, confirmed by 7am, crew there by 1pm. No drama, no surprises on the invoice.",
    initials: "PD",
    name: "Portia D.",
    suburb: "Brunswick",
  },
  {
    quote:
      "Packed our whole house in a day, labelled every box by room. Unpacking at the other end was so much easier because of it.",
    initials: "TR",
    name: "Tom R.",
    suburb: "Bondi",
  },
  {
    quote:
      "Moved our pool table and gym equipment without a scratch. The crew knew exactly how to break it down and reassemble it.",
    initials: "AL",
    name: "Aisha L.",
    suburb: "New Farm",
  },
  {
    quote:
      "Loading-only service for our own hire truck. Turned up on time, packed it tighter and safer than we would have managed ourselves.",
    initials: "DW",
    name: "Daniel W.",
    suburb: "Richmond",
  },
  {
    quote:
      "Interstate-sounding job turned out to be local across two suburbs — either way, same fixed price promise, same careful crew.",
    initials: "MC",
    name: "Maria C.",
    suburb: "Paddington",
  },
  {
    quote:
      "Small move, just a few items of furniture, and they still treated it like it mattered. Wrapped everything properly.",
    initials: "BH",
    name: "Ben H.",
    suburb: "St Kilda",
  },
];

export default function ReviewsPage() {
  return (
    <div className="bg-gray-50 font-sans text-ink-600">
      <Nav />

      <section className="max-w-[1180px] mx-auto px-8 pt-16 pb-10 text-center">
        <div className="text-xs font-display font-semibold tracking-[1.5px] uppercase text-ink-400 mb-6">
          Reviews
        </div>
        <h1 className="font-display font-bold text-5xl leading-[1.1] text-ink-800 m-0 mb-6">
          Trusted by families — not just star ratings
        </h1>
        <div className="flex items-center justify-center gap-3 text-lg">
          <span className="text-gold-400">★★★★★</span>
          <span className="font-display font-bold text-ink-800">4.9</span>
          <span className="text-ink-400 text-sm">from 5,527+ reviews</span>
        </div>
      </section>

      {/* Video & photo reviews */}
      <section className="max-w-[1180px] mx-auto px-8 pb-16">
        <div className="flex items-center gap-3 mb-8">
          <span className="w-2 h-2 rounded-pill bg-clay-500" />
          <h2 className="font-display font-bold text-[22px] text-ink-800 m-0">
            Real moves, in customers&rsquo; own words
          </h2>
        </div>
        <div className="columns-2 sm:columns-3 lg:columns-4 gap-5 [column-fill:balance]">
          {mediaTestimonials.map((m) => (
            <div
              key={m.src}
              className={`relative mb-5 break-inside-avoid rounded-md overflow-hidden border border-border bg-ink-900 shadow-raised ${m.aspect}`}
            >
              {m.type === "video" ? (
                <video
                  src={m.src}
                  controls
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  className="absolute inset-0 w-full h-full object-cover"
                />
              ) : (
                <Image src={m.src} alt="Movera customer review" fill className="object-cover" />
              )}
              <div className="pointer-events-none absolute top-3 left-3 bg-white/95 rounded-pill px-3 py-1 text-[11px] font-display font-semibold text-ink-800 flex items-center gap-1.5">
                <span className="text-gold-400">★★★★★</span>
                Verified
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-[1180px] mx-auto px-8 pb-16">
        <div className="text-xs font-display font-semibold tracking-[1.5px] uppercase text-ink-400 mb-8">
          Written reviews
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((r) => (
            <Card key={r.name}>
              <div className="text-gold-400 text-lg mb-3">★★★★★</div>
              <p className="m-0 mb-5 text-sm leading-[1.65]">&ldquo;{r.quote}&rdquo;</p>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-pill bg-teal-500 text-white grid place-items-center text-xs font-display font-semibold">
                  {r.initials}
                </div>
                <div className="text-sm text-ink-800 font-display font-semibold">
                  {r.name} <span className="text-ink-400 font-normal font-sans">— {r.suburb}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      <div className="max-w-[1180px] mx-auto px-8 pb-16">
        <CTABand />
      </div>

      <Footer />
    </div>
  );
}
