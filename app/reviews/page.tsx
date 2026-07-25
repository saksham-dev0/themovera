import { Card } from "@/components/ui/Card";
import { Nav } from "@/components/ui/Nav";
import { CTABand, Footer } from "@/components/ui/Footer";

export const metadata = {
  title: "Reviews | Movera Removals & Storage",
  description: "4.9 stars from 5,527+ reviews — see what customers say about moving with Movera.",
};

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

      <section className="max-w-[1180px] mx-auto px-8 py-16">
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
