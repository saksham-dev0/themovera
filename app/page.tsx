import Image from "next/image";
import Link from "next/link";
import { Card, IconTile } from "@/components/ui/Card";
import { Accordion } from "@/components/ui/Accordion";
import { Nav } from "@/components/ui/Nav";
import { CTABand, Footer } from "@/components/ui/Footer";
import { ReviewsMarquee } from "@/components/ui/ReviewsMarquee";
import { HeroQuoteForm } from "@/components/ui/HeroQuoteForm";
import { services } from "@/app/services/data";

const stats = [
  { value: "3,000+", label: "MOVES COMPLETED" },
  { value: "4.8★", label: "FROM 800+ REVIEWS" },
  { value: "5+ yrs", label: "IN BUSINESS" },
  { value: "$100k", label: "GOODS-IN-TRANSIT COVER" },
];

const areas = [
  { city: "Bayside & South-East", note: "Based at 32-44 Keys Road, Cheltenham — servicing Brighton, Sandringham, Mentone, Frankston and surrounds" },
  { city: "Melbourne CBD & Inner", note: "Fitzroy, Richmond, South Yarra, Carlton, St Kilda and every inner-city suburb in between" },
  { city: "Eastern & Northern Suburbs", note: "Box Hill, Doncaster, Preston, Reservoir, Epping and the growth corridors beyond" },
];

const fleet = [
  { title: "Our truck fleet", caption: "A range of well-maintained trucks, from 2-tonne to 12-tonne, matched to your move — no wasted space, no second trip.", image: "/Interstate.png" },
  { title: "Trained crew", caption: "Background-checked moving teams — our own crews and trusted local partners, held to the same standard.", image: "/office_removal.png" },
  { title: "Packing materials", caption: "Boxes, blankets, straps and trolleys loaded on every truck, so your crew is never caught short on the day.", image: "/movera_storage.png" },
];

const serviceImages: Record<string, string> = {
  "local-removals": "/House.png",
  "office-commercial-relocations": "/office_removal.png",
  "packing-unpacking": "/movera_storage.png",
  "furniture-removals": "/House_removalist.png",
  "specialty-item-removals": "/special-move.png",
  "loading-unloading": "/loading-unloading.png",
};

const steps = [
  {
    n: "1",
    title: "Get Your Free Quote",
    body: "Tell us your suburbs, move date and rough inventory online or by phone. We'll come back with one transparent, upfront price — no hidden fees, no obligation.",
  },
  {
    n: "2",
    title: "Book Your Move Date",
    body: "Confirm your booking and we lock in your date and crew. Your dedicated coordinator plans access, parking and timing so moving day has no surprises.",
  },
  {
    n: "3",
    title: "We Pack, Load & Deliver",
    body: "Our own Melbourne crew turns up on time with the right truck and equipment — wrapping, loading, transporting and placing everything exactly where you want it.",
  },
];

const checklist = [
  "A genuine quote based on your move's requirements — fixed-price or hourly rate — confirmed before the day, no surprise charges.",
  "Every crew on the job — ours or a trusted local partner — is trained, background-checked and insured to the same standard.",
  "All equipment included — furniture blankets, trolleys and straps.",
  "One dedicated Movera coordinator manages your move start to finish, whoever's on the truck.",
  "$100,000 goods-in-transit insurance included on every move.",
];

const reviews = [
  {
    quote:
      "I'd been burned by a comparison-site mover before — hidden fees, no-show crew, a nightmare. Movera was the opposite. Upfront pricing, on time, careful with our piano and antiques.",
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
      "Called at 6am needing a same-day move. They gave us an upfront quote, confirmed by 7am, crew there by 1pm. No drama, no surprises on the invoice.",
    initials: "PD",
    name: "Portia D.",
    suburb: "Brunswick",
  },
];

const faqs = [
  { q: "How much does a removalist in Melbourne cost?", a: "It depends on the size of your move, distance and access — a one-bedroom unit in Fitzroy costs less than a four-bedroom house in the eastern suburbs. We assess your move first and give you one clear, affordable quote upfront, confirmed before the day." },
  { q: "Do you charge by the hour or give an upfront quote?", a: "Both — we offer a fixed upfront quote as well as hourly rates, whichever suits your move. Either way, we assess volume, distance and access first, so the number we agree is the number on the invoice — no surprise blowouts on the day." },
  { q: "Can you handle office and commercial relocations?", a: "Yes — office relocation is one of our specialties. We schedule after-hours or weekend moves so your Melbourne business has zero downtime, with IT equipment and workstations handled with care." },
  { q: "Do you do last-minute or same-day moves?", a: "Yes — subject to crew availability. Call us and we'll do our best to get a Melbourne crew and truck to you the same day." },
  { q: "Are my belongings insured during the move?", a: "Every move includes $100,000 goods-in-transit cover as standard, with optional comprehensive cover available for higher-value moves." },
  { q: "What areas of Melbourne do you service?", a: "Bayside and the south-east, the CBD and inner-city suburbs, and the eastern and northern suburbs — all with our own trained crew and trucks, based out of Cheltenham." },
  { q: "Do you handle packing, fragile items, and pianos?", a: "Yes. As experienced packers and movers we supply materials for full or partial packing and specialise in pianos, pool tables, antiques and other fragile items." },
];

export default function Home() {
  return (
    <div className="bg-gray-50 font-sans text-ink-600">
      <Nav />

      {/* Hero */}
      <section className="relative">
        <div className="absolute inset-0">
          <Image
            src="/mobile-banner.png"
            alt="Movera crew moving furniture"
            fill
            className="object-cover sm:hidden"
            priority
          />
          <Image
            src="/banner.png"
            alt="Movera crew moving furniture"
            fill
            className="object-cover hidden sm:block"
            priority
          />
          <div className="absolute inset-0 bg-ink-900/45" />
        </div>

        <div className="relative max-w-[1180px] mx-auto px-8 pt-24 pb-28 flex flex-col items-center text-center gap-8">
          <h1 className="font-display font-bold text-5xl leading-[1.1] text-white m-0 max-w-[720px]">
            Move Right with Movera
          </h1>
          <p className="text-[17px] leading-[1.6] max-w-[480px] text-white/85 m-0">
            4.8★ from 800+ reviews. Get your free quote in 60 seconds.
          </p>

          <HeroQuoteForm />
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white border-y border-border">
        <div className="max-w-[1180px] mx-auto px-8 py-12 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((s) => (
            <div key={s.label}>
              <div className="font-display font-bold text-3xl text-teal-500 mb-1.5">{s.value}</div>
              <div className="text-xs font-display font-semibold tracking-[1.2px] uppercase text-ink-400">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Reviews marquee */}
      <section className="bg-white py-16 overflow-hidden">
        <div className="max-w-[1180px] mx-auto px-8">
          <div className="text-xs font-display font-semibold tracking-[1.5px] uppercase text-ink-400 mb-3">
            Reviews
          </div>
          <h2 className="font-display font-bold text-[28px] text-ink-800 m-0 mb-8 max-w-[640px]">
            Real moves, in customers&apos; own words
          </h2>
        </div>
        <ReviewsMarquee />
      </section>

      {/* Services */}
      <section className="max-w-[1180px] mx-auto px-8 py-16">
        <div className="text-xs font-display font-semibold tracking-[1.5px] uppercase text-ink-400 mb-3">
          Services
        </div>
        <div className="flex items-end justify-between gap-6 flex-wrap mb-8">
          <h2 className="font-display font-bold text-[28px] leading-[1.2] text-ink-800 m-0 max-w-[640px]">
            Removalists &amp; Moving Services Melbourne Relies On
          </h2>
          <Link
            href="/services"
            className="text-sm font-display font-semibold text-teal-500 no-underline hover:underline shrink-0"
          >
            View all services →
          </Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((s) => (
            <Link
              key={s.slug}
              href={`/services/${s.slug}`}
              className="block bg-white rounded-md overflow-hidden border border-border no-underline hover:shadow-raised transition-shadow"
            >
              <div className="relative h-[120px]">
                <Image src={serviceImages[s.slug]} alt={s.title} fill className="object-cover" />
                <div className="absolute bottom-3 left-3">
                  <IconTile>M</IconTile>
                </div>
              </div>
              <div className="p-5">
                <div className="font-display font-semibold text-[16px] text-ink-800 mb-2">{s.title}</div>
                <p className="m-0 mb-3 text-sm leading-[1.6]">{s.tagline}</p>
                <span className="text-sm font-display font-semibold text-teal-500">View details →</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-white">
        <div className="max-w-[1180px] mx-auto px-8 py-16">
          <div className="text-xs font-display font-semibold tracking-[1.5px] uppercase text-ink-400 mb-3">
            How It Works
          </div>
          <h2 className="font-display font-bold text-[28px] text-ink-800 m-0 mb-10">Your Melbourne move, in three simple steps</h2>
          <div className="grid sm:grid-cols-3 gap-10">
            {steps.map((step) => (
              <div key={step.n}>
                <div
                  className="font-display font-bold text-6xl mb-4 text-transparent"
                  style={{ WebkitTextStroke: "1.5px #1A7F72" }}
                >
                  {step.n}
                </div>
                <div className="font-display font-semibold text-lg text-ink-800 mb-2">{step.title}</div>
                <p className="m-0 text-sm leading-[1.65] max-w-[300px]">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison */}
      <section className="bg-ink-900">
        <div className="max-w-[1180px] mx-auto px-8 py-16 grid lg:grid-cols-2 gap-12 items-center">
          <div className="relative rounded-md overflow-hidden h-[380px]">
            <Image src="/loading-unloading.png" alt="Movera crew loading truck" fill className="object-cover" />
          </div>
          <div>
            <div className="text-xs font-display font-semibold tracking-[1.5px] uppercase text-teal-500 mb-3">
              Why Movera vs. comparison sites
            </div>
            <h2 className="font-display font-bold text-[28px] leading-[1.25] text-white m-0 mb-5">
              One quote. One coordinator. One company accountable for your move.
            </h2>
            <p className="text-[15px] leading-[1.7] text-white/70 mb-7 max-w-[480px]">
              Comparison sites collect your details and sell them to 4-5 movers who bid against each other —
              you don&apos;t find out who&apos;s actually turning up until moving day. With Movera, you book with
              us and deal with us throughout: one upfront price, one coordinator managing the job, and every
              crew we put on your move — our own team or a vetted local partner — held to the same standard of
              training, background checks and insurance.
            </p>
            <div className="grid gap-3">
              {checklist.map((item) => (
                <div key={item} className="flex items-start gap-3 text-sm text-white/90">
                  <span className="w-5 h-5 rounded-pill bg-teal-500 text-white grid place-items-center text-xs shrink-0 mt-0.5">
                    ✓
                  </span>
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Areas We Service */}
      <section className="max-w-[1180px] mx-auto px-8 py-16">
        <div className="text-xs font-display font-semibold tracking-[1.5px] uppercase text-ink-400 mb-3">
          Areas We Service
        </div>
        <h2 className="font-display font-bold text-[28px] text-ink-800 m-0 mb-8 max-w-[640px]">
          Local movers servicing Melbourne and surrounding suburbs
        </h2>
        <div className="grid sm:grid-cols-3 gap-6">
          {areas.map((a) => (
            <Card key={a.city}>
              <div className="font-display font-semibold text-lg text-ink-800 mb-2">{a.city}</div>
              <p className="m-0 text-sm leading-[1.6]">{a.note}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Fleet & Crew showcase */}
      <section className="bg-white">
        <div className="max-w-[1180px] mx-auto px-8 py-16">
          <div className="text-xs font-display font-semibold tracking-[1.5px] uppercase text-ink-400 mb-3">
            Our Fleet &amp; Crew
          </div>
          <h2 className="font-display font-bold text-[28px] text-ink-800 m-0 mb-8 max-w-[640px]">
            The people and equipment behind every move
          </h2>
          <div className="grid sm:grid-cols-3 gap-6">
            {fleet.map((f) => (
              <div key={f.title} className="rounded-md overflow-hidden border border-border">
                <div className="relative h-[160px]">
                  <Image src={f.image} alt={f.title} fill className="object-cover" />
                </div>
                <div className="p-5">
                  <div className="font-display font-semibold text-[15px] text-ink-800 mb-1.5">{f.title}</div>
                  <p className="m-0 text-sm leading-[1.6]">{f.caption}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews */}
      {/* <section className="max-w-[1180px] mx-auto px-8 py-16">
        <div className="text-xs font-display font-semibold tracking-[1.5px] uppercase text-ink-400 mb-3">
          Reviews
        </div>
        <h2 className="font-display font-bold text-[28px] text-ink-800 m-0 mb-8 max-w-[600px]">
          Trusted by families — not just star ratings
        </h2>
        <div className="grid sm:grid-cols-3 gap-6">
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
      </section> */}

      {/* FAQ */}
      <section className="bg-white">
        <div className="max-w-[1180px] mx-auto px-8 py-16 text-center">
          <div className="text-xs font-display font-semibold tracking-[1.5px] uppercase text-ink-400 mb-3">FAQ</div>
          <h2 className="font-display font-bold text-[28px] text-ink-800 m-0 mb-8 max-w-[640px] mx-auto">
            Removalist questions, answered honestly
          </h2>
          <div className="max-w-[720px] mx-auto text-left">
            <Accordion items={faqs} />
          </div>
        </div>
      </section>

      {/* CTA */}
      <div className="max-w-[1180px] mx-auto px-8 pb-16 pt-16">
        <CTABand />
      </div>

      <Footer />
    </div>
  );
}
