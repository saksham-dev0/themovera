import { Button } from "@/components/ui/Button";
import { Card, IconTile } from "@/components/ui/Card";
import { Input, Select, Label } from "@/components/ui/Input";
import { Accordion } from "@/components/ui/Accordion";
import { Nav } from "@/components/ui/Nav";
import { CTABand, Footer } from "@/components/ui/Footer";

const stats = [
  { value: "12,000+", label: "MOVES COMPLETED" },
  { value: "4.9★", label: "FROM 5,527+ REVIEWS" },
  { value: "13+ yrs", label: "COMBINED EXPERIENCE" },
  { value: "$100k", label: "GOODS-IN-TRANSIT COVER" },
];

const services = [
  {
    title: "Local Removals",
    body: "Studios to 5-bedroom homes across Sydney, Melbourne and Brisbane. Fixed price, trained crew — not a subcontractor bidding site.",
  },
  {
    title: "Office & Commercial",
    body: "Minimum downtime. After-hours and weekend moves available. Labelled, sequenced IT and workstations handled with care.",
  },
  {
    title: "Interstate Removals",
    body: "Sydney to Melbourne, Brisbane, Adelaide, Canberra — on our own truck, not handed off. SMS tracking door to door.",
  },
  {
    title: "Packing & Storage",
    body: "Full or partial packing with materials supplied. Pianos, pool tables, antiques — specialist handling as standard.",
  },
];

const steps = [
  {
    n: "1",
    title: "Get One Fixed-Price Quote",
    body: "Online or by phone in under 3 minutes. No form submissions to 5 companies. One price back to you in under 2 hours.",
  },
  {
    n: "2",
    title: "Your Coordinator Plans Everything",
    body: "A dedicated Movera coordinator builds your schedule — access timing, parking, stairs — so moving day has no surprises.",
  },
  {
    n: "3",
    title: "Our Crew Handles the Rest",
    body: "Trained removalists, not subcontractors. Wrapping, lifting, transport, and placement done start to finish.",
  },
];

const checklist = [
  "Fixed price — no hourly meter, no depot-to-depot tricks.",
  "Trained, background-checked movers. No subcontractors. Ever.",
  "Furniture wrap & floor protection included as standard.",
  "SMS tracking on the day — you always know where your things are.",
  "$100,000 goods-in-transit insurance on every move.",
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
];

const faqs = [
  { q: "How much does a removalist cost?", a: "It depends on the size of your move, distance and access — but you'll always get one fixed price upfront, confirmed before the day." },
  { q: "Do you charge by the hour or a fixed price?", a: "Fixed price as standard. We assess volume, distance and access first, so the number we quote is the number on the invoice." },
  { q: "Do you do last-minute or same-day moves?", a: "Yes — subject to crew availability. Call us and we'll do our best to get a truck to you the same day." },
  { q: "Are my belongings insured during the move?", a: "Every move includes $100,000 goods-in-transit cover as standard, with optional comprehensive cover available." },
  { q: "Do you move interstate?", a: "Yes — regular runs to Sydney, Melbourne, Brisbane, Adelaide and Canberra, on our own trucks." },
  { q: "Do you handle packing, fragile items, and pianos?", a: "Yes. We supply materials for full or partial packing and specialise in pianos, pool tables, antiques and other fragile items." },
];

export default function Home() {
  return (
    <div className="bg-gray-50 font-sans text-ink-600">
      <Nav />

      {/* Hero */}
      <section className="max-w-[1180px] mx-auto px-8 pt-16 pb-10 grid lg:grid-cols-[1.15fr_0.85fr] gap-14 items-start">
        <div>
          <div className="text-xs font-display font-semibold tracking-[1.5px] uppercase text-ink-400 mb-6">
            Fixed price, no hidden fees, family owned
          </div>
          <h1 className="font-display font-bold text-5xl leading-[1.1] text-ink-800 m-0 mb-6">
            Reliable Removalists Australia Trusts.
          </h1>
          <p className="text-[17px] leading-[1.65] max-w-[520px] mb-8">
            Home, office, and interstate moves — done by our own trained crew, not a subcontractor from a
            comparison site. One fixed price. No forms, no 5-way bidding war, no nasty surprises on the day.
          </p>
          <div className="flex flex-wrap items-center gap-4 mb-8">
            <Button variant="secondary">☎ 02 8503 4444</Button>
            <Button variant="outline">See How It Works</Button>
          </div>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-ink-600">
            <span>✓ Fully Insured</span>
            <span className="text-border">•</span>
            <span className="text-gold-400">★★★★★</span>
            <span>4.9 Google Rating</span>
            <span className="text-border">•</span>
            <span>⌂ Family Owned &amp; Operated</span>
          </div>
        </div>

        {/* Quote card */}
        <Card className="rounded-md p-8 shadow-floating">
          <div className="font-display font-bold text-2xl text-ink-800 mb-1.5">
            Get your free fixed-price quote
          </div>
          <p className="m-0 mb-6 text-sm text-ink-400 leading-[1.5]">
            One price. No callbacks from 5 competing movers. Back to you in under 2 hours.
          </p>
          <div className="grid gap-4">
            <div className="grid gap-1.5">
              <Label className="text-xs uppercase tracking-wide">What are you moving?</Label>
              <Select defaultValue="Home — 1-2 bedroom">
                <option>Home — 1-2 bedroom</option>
                <option>Home — 3-4 bedroom</option>
                <option>Home — 5+ bedroom</option>
                <option>Office / commercial</option>
                <option>Storage only</option>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-1.5">
                <Label className="text-xs uppercase tracking-wide">From</Label>
                <Input placeholder="Suburb" className="bg-white" />
              </div>
              <div className="grid gap-1.5">
                <Label className="text-xs uppercase tracking-wide">To</Label>
                <Input placeholder="Suburb" className="bg-white" />
              </div>
            </div>
            <div className="grid gap-1.5">
              <Label className="text-xs uppercase tracking-wide">Preferred date</Label>
              <Input type="date" className="bg-white" />
            </div>
            <Button variant="primary" className="w-full mt-1">
              Get My Free Quote →
            </Button>
            <div className="text-center text-xs text-ink-400">No obligation · Fully insured · $100k cover</div>
          </div>
        </Card>
      </section>

      {/* Photo banner */}
      <section className="max-w-[1180px] mx-auto px-8 pb-16">
        <div className="relative rounded-md overflow-hidden border border-border shadow-raised">
          <div className="h-[360px] bg-[repeating-linear-gradient(45deg,#EEF6F4,#EEF6F4_12px,#DCEEEA_12px,#DCEEEA_24px)] grid place-items-center font-mono text-xs text-[#5E8A80]">
            moving crew &amp; truck photo
          </div>
          <div className="absolute bottom-5 left-5 bg-white/95 rounded-pill px-4 py-2 text-xs font-display font-semibold text-ink-800 flex items-center gap-2">
            <span className="w-2 h-2 rounded-pill bg-clay-500" />
            Live move · Fitzroy → St Kilda
          </div>
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

      {/* Services */}
      <section className="max-w-[1180px] mx-auto px-8 py-16">
        <div className="text-xs font-display font-semibold tracking-[1.5px] uppercase text-ink-400 mb-3">
          Services
        </div>
        <h2 className="font-display font-bold text-[28px] leading-[1.2] text-ink-800 m-0 mb-8 max-w-[640px]">
          Removalist Services — Every Move, Handled
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((s) => (
            <div key={s.title} className="bg-white rounded-md overflow-hidden border border-border">
              <div className="relative h-[120px] bg-[repeating-linear-gradient(45deg,#EEF6F4,#EEF6F4_10px,#DCEEEA_10px,#DCEEEA_20px)]">
                <div className="absolute bottom-3 left-3">
                  <IconTile>M</IconTile>
                </div>
              </div>
              <div className="p-5">
                <div className="font-display font-semibold text-[16px] text-ink-800 mb-2">{s.title}</div>
                <p className="m-0 text-sm leading-[1.6]">{s.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-white">
        <div className="max-w-[1180px] mx-auto px-8 py-16">
          <div className="text-xs font-display font-semibold tracking-[1.5px] uppercase text-ink-400 mb-3">
            How It Works
          </div>
          <h2 className="font-display font-bold text-[28px] text-ink-800 m-0 mb-10">Simple from start to finish</h2>
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
          <div className="rounded-md overflow-hidden h-[380px] bg-[repeating-linear-gradient(45deg,#22302B,#22302B_14px,#14211D_14px,#14211D_28px)] grid place-items-center font-mono text-xs text-white/50">
            crew loading truck photo
          </div>
          <div>
            <div className="text-xs font-display font-semibold tracking-[1.5px] uppercase text-teal-500 mb-3">
              Why Movera vs. comparison sites
            </div>
            <h2 className="font-display font-bold text-[28px] leading-[1.25] text-white m-0 mb-5">
              No middleman. No bidding war. Just your move, done properly.
            </h2>
            <p className="text-[15px] leading-[1.7] text-white/70 mb-7 max-w-[480px]">
              Comparison sites sell your details to 4-5 movers who undercut each other — and cut corners. With
              Movera you get one dedicated crew, one fixed price, and a coordinator who knows your move inside
              out.
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

      {/* Reviews */}
      <section className="max-w-[1180px] mx-auto px-8 py-16">
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
      </section>

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
