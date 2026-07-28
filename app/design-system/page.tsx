import { Button } from "@/components/ui/Button";
import { Card, IconTile } from "@/components/ui/Card";
import { Input, Label, Select, Textarea } from "@/components/ui/Input";
import { Alert, Toast } from "@/components/ui/Alert";
import { StepBadge, Rating, RoadDivider } from "@/components/ui/Badge";
import { SegmentedToggle } from "@/components/ui/SegmentedToggle";
import { Tabs } from "@/components/ui/Tabs";
import { Accordion } from "@/components/ui/Accordion";
import { Tooltip } from "@/components/ui/Tooltip";
import { Dialog, DialogHeader } from "@/components/ui/Dialog";
import { Nav } from "@/components/ui/Nav";
import { CTABand, Footer } from "@/components/ui/Footer";

const colorGroups = [
  {
    name: "Brand · Harbour Blue",
    swatches: [
      { token: "teal-500", hex: "#2C5F8A", use: "Primary brand, links", cls: "bg-teal-500" },
      { token: "teal-600", hex: "#20496B", use: "Hover, emphasis", cls: "bg-teal-600" },
      { token: "teal-400", hex: "#274F72", use: "CTA band fill", cls: "bg-teal-400" },
      { token: "teal-200", hex: "#C6D8E5", use: "Road motif", cls: "bg-teal-200" },
      { token: "teal-100", hex: "#DCE8F1", use: "Icon tiles, tints", cls: "bg-teal-100" },
      { token: "teal-50", hex: "#EEF4F8", use: "Subtle washes", cls: "bg-teal-50" },
    ],
  },
  {
    name: "Accent · Sand",
    swatches: [
      { token: "clay-500", hex: "#8A6A34", use: "Primary CTA, step badges", cls: "bg-clay-500" },
      { token: "clay-600", hex: "#6E5429", use: "CTA hover", cls: "bg-clay-600" },
      { token: "clay-100", hex: "#E8D5B0", use: "Sand tint", cls: "bg-clay-100" },
      { token: "sage-500", hex: "#7FB25B", use: "Contact / phone only", cls: "bg-sage-500" },
      { token: "gold-400", hex: "#E8A93C", use: "Rating stars", cls: "bg-gold-400" },
    ],
  },
  {
    name: "Ink",
    swatches: [
      { token: "ink-900", hex: "#1B2A38", use: "Nav, footer surfaces", cls: "bg-ink-900" },
      { token: "ink-800", hex: "#22303D", use: "Headings", cls: "bg-ink-800" },
      { token: "ink-600", hex: "#4A5762", use: "Body text", cls: "bg-ink-600" },
      { token: "ink-400", hex: "#7C8790", use: "Muted, captions", cls: "bg-ink-400" },
    ],
  },
  {
    name: "Surface · Cream",
    swatches: [
      { token: "white", hex: "#FFFFFF", use: "Cards, page", cls: "bg-white border border-border" },
      { token: "gray-50", hex: "#F7F6F3", use: "Alt sections", cls: "bg-gray-50" },
      { token: "gray-100", hex: "#F0ECE2", use: "Input fill", cls: "bg-gray-100" },
      { token: "border", hex: "#E2DCC9", use: "Card borders, rules", cls: "bg-border" },
    ],
  },
];

const spacing = [
  { name: "space-1", px: "4px" },
  { name: "space-2", px: "8px" },
  { name: "space-3", px: "12px" },
  { name: "space-4", px: "16px" },
  { name: "space-6", px: "24px" },
  { name: "space-8", px: "32px" },
  { name: "space-12", px: "48px" },
  { name: "space-16", px: "64px" },
];

const tabItems = [
  {
    label: "Local Moves",
    body: "Complete local removals across Sydney, Melbourne and Brisbane — planned, packed and delivered by our own trained crews.",
  },
  {
    label: "Interstate",
    body: "Extensive rail network and secure mobile storage safely deliver your belongings to destinations all across Australia.",
  },
  {
    label: "Storage",
    body: "Mobile and self-storage options that bring secure, flexible space right to your door.",
  },
];

const faqs = [
  { q: "How is my quote calculated?", a: "By volume, distance and access — fixed or hourly, always transparent before you commit." },
  { q: "Are my belongings insured?", a: "Yes — full transit cover is included, with optional comprehensive cover available." },
  { q: "Can I store items mid-move?", a: "Absolutely. Mobile storage modules can hold your things for days or months." },
];

function SectionHeading({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-7">
      <h2 className="font-display font-bold text-[28px] text-ink-800 m-0 mb-1">{title}</h2>
      {subtitle && <p className="m-0 text-[15px] text-ink-600">{subtitle}</p>}
    </div>
  );
}

export default function DesignSystemPage() {
  return (
    <div className="bg-gray-50 font-sans text-ink-600 min-h-screen">
      <div className="max-w-[1180px] mx-auto px-8 pb-24">
        {/* Masthead */}
        <header className="pt-[72px] pb-12 border-b border-border">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-11 h-11 bg-ink-900 border-2 border-teal-500 rounded-sm grid place-items-center font-display font-bold text-2xl text-white">
              M
            </div>
            <div className="font-display font-semibold text-[13px] tracking-[3px] text-ink-800">MOVERA</div>
          </div>
          <h1 className="font-display font-bold text-5xl leading-[1.1] text-ink-800 m-0 mb-2">Design System</h1>
          <div className="inline-block w-[220px] h-[5px] bg-teal-500 rounded-pill mb-5" />
          <p className="text-[17px] leading-[1.6] max-w-[620px] m-0">
            Tokens and components for the Movera Removals &amp; Storage web presence. Calm harbour teal with warm
            clay accents, on soft warm whites with deep evergreen anchors.
          </p>
        </header>

        {/* Color */}
        <section className="pt-14">
          <SectionHeading
            title="Color"
            subtitle="Harbour teal leads. Warm clay is reserved for primary calls to action; sage only for live contact affordances."
          />
          {colorGroups.map((group) => (
            <div key={group.name} className="mb-7">
              <div className="font-display font-semibold text-[13px] tracking-[1.5px] uppercase text-ink-400 mb-3">
                {group.name}
              </div>
              <div className="flex flex-wrap gap-4">
                {group.swatches.map((sw) => (
                  <div key={sw.token} className="w-[168px]">
                    <div className={`h-[76px] rounded-md shadow-raised ${sw.cls}`} />
                    <div className="font-display font-semibold text-[13px] text-ink-800 mt-2.5 mb-0.5">{sw.token}</div>
                    <div className="font-mono text-xs text-ink-400">{sw.hex}</div>
                    <div className="text-xs text-ink-400">{sw.use}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </section>

        {/* Typography */}
        <section className="pt-14">
          <SectionHeading title="Typography" subtitle="Poppins for headings and labels; Mulish for running text." />
          <Card className="p-9 grid gap-6.5">
            <div className="grid grid-cols-[210px_1fr] gap-6 items-baseline">
              <div className="font-mono text-xs text-ink-400">display · Poppins 700 · 56/1.1</div>
              <div className="font-display font-bold text-[56px] leading-[1.1] text-ink-800">Stress-free moving</div>
            </div>
            <div className="grid grid-cols-[210px_1fr] gap-6 items-baseline">
              <div className="font-mono text-xs text-ink-400">h1 · Poppins 700 · 40/1.15</div>
              <div className="font-display font-bold text-4xl leading-[1.15] text-ink-800">
                Moving &amp; Storage Made Simple
              </div>
            </div>
            <div className="grid grid-cols-[210px_1fr] gap-6 items-baseline">
              <div className="font-mono text-xs text-ink-400">h2 · Poppins 700 · 30/1.2</div>
              <div className="font-display font-bold text-3xl leading-[1.2] text-ink-800">Why Choose Movera?</div>
            </div>
            <div className="grid grid-cols-[210px_1fr] gap-6 items-baseline">
              <div className="font-mono text-xs text-ink-400">h3 · Poppins 600 · 20/1.3</div>
              <div className="font-display font-semibold text-xl leading-[1.3] text-ink-800">Set Your Destination</div>
            </div>
            <div className="grid grid-cols-[210px_1fr] gap-6 items-baseline">
              <div className="font-mono text-xs text-ink-400">body · Mulish 400 · 16/1.65</div>
              <div className="text-base leading-[1.65] max-w-[560px]">
                With over 13 years of combined moving and storage experience, we understand how to make it seamless
                and stress-free — supporting you every step of the way.
              </div>
            </div>
            <div className="grid grid-cols-[210px_1fr] gap-6 items-baseline">
              <div className="font-mono text-xs text-ink-400">small · Mulish 400 · 14/1.6</div>
              <div className="text-sm leading-[1.6] text-ink-400">
                Variable hourly rates · Truck rental + materials + labour
              </div>
            </div>
            <div className="grid grid-cols-[210px_1fr] gap-6 items-baseline">
              <div className="font-mono text-xs text-ink-400">nav label · Poppins 600 · 14 · +1px caps</div>
              <div className="font-display font-semibold text-sm tracking-[1px] text-ink-800">
                LOCAL REMOVALISTS &nbsp;·&nbsp; INTERSTATE &nbsp;·&nbsp; STORAGE
              </div>
            </div>
            <div className="grid grid-cols-[210px_1fr] gap-6 items-baseline">
              <div className="font-mono text-xs text-ink-400">link · Mulish 600 · teal-500</div>
              <div className="text-base">
                Our convenient{" "}
                <a href="#" className="text-teal-500 underline font-semibold">
                  mobile storage
                </a>{" "}
                options bring solutions to your door.
              </div>
            </div>
          </Card>
        </section>

        {/* Spacing / radius / shadow */}
        <section className="pt-14">
          <SectionHeading title="Spacing, Radius & Elevation" />
          <div className="grid grid-cols-3 gap-6">
            <Card className="rounded-md">
              <div className="font-display font-semibold text-[13px] tracking-[1.5px] uppercase text-ink-400 mb-4">
                Spacing · 4px base
              </div>
              <div className="grid gap-2.5">
                {spacing.map((sp) => (
                  <div key={sp.name} className="flex items-center gap-3">
                    <div className="font-mono text-xs text-ink-400 w-[70px]">{sp.name}</div>
                    <div className="h-3.5 bg-teal-500 rounded-sm" style={{ width: sp.px }} />
                    <div className="font-mono text-xs text-ink-400">{sp.px}</div>
                  </div>
                ))}
              </div>
            </Card>
            <Card className="rounded-md">
              <div className="font-display font-semibold text-[13px] tracking-[1.5px] uppercase text-ink-400 mb-4">
                Radius
              </div>
              <div className="grid gap-3.5">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-10 bg-teal-100 border-2 border-teal-500 rounded-sm" />
                  <div className="font-mono text-xs text-ink-400">radius-sm · 8px · badges, chips</div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-14 h-10 bg-teal-100 border-2 border-teal-500 rounded-md" />
                  <div className="font-mono text-xs text-ink-400">radius-md · 14px · cards, panels</div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-14 h-10 bg-teal-100 border-2 border-teal-500 rounded-pill" />
                  <div className="font-mono text-xs text-ink-400">radius-pill · 999px · buttons, inputs</div>
                </div>
              </div>
            </Card>
            <Card className="rounded-md">
              <div className="font-display font-semibold text-[13px] tracking-[1.5px] uppercase text-ink-400 mb-4">
                Elevation
              </div>
              <div className="grid gap-4.5">
                <div className="bg-white border border-border rounded-sm p-3.5 font-mono text-xs text-ink-400">
                  card · border only
                </div>
                <div className="bg-white rounded-sm p-3.5 shadow-raised font-mono text-xs text-ink-400">
                  raised · 0 2 12 / 8%
                </div>
                <div className="bg-white rounded-sm p-3.5 shadow-floating font-mono text-xs text-ink-400">
                  floating · 0 10 30 / 16%
                </div>
              </div>
            </Card>
          </div>
        </section>

        {/* Buttons */}
        <section className="pt-14">
          <SectionHeading
            title="Buttons"
            subtitle="Clay = primary quote actions. Teal = secondary navigation actions. Sage and outline variants live on dark surfaces."
          />
          <Card className="p-9 grid gap-6 rounded-md">
            <div className="flex flex-wrap items-center gap-5">
              <Button variant="primary">Get a Quote ›</Button>
              <Button variant="secondary">Meet the team ›</Button>
              <Button variant="outline">Learn more</Button>
              <Button variant="ghost">Read more ›</Button>
            </div>
            <div className="flex flex-wrap items-center gap-5 bg-ink-900 rounded-md px-7 py-6">
              <Button variant="dark-outline">GET A QUOTE</Button>
              <Button variant="dark-sage">☎ 02 8503 4444</Button>
              <div className="font-mono text-xs text-ink-400">on ink-900 surfaces</div>
            </div>
            <div className="flex flex-wrap items-center gap-5">
              <Button variant="primary" disabled>
                Get a Quote
              </Button>
              <div className="font-mono text-xs text-ink-400">disabled · 40% chroma</div>
              <div className="flex items-center gap-2.5 ml-auto">
                <button
                  aria-label="Previous"
                  className="w-11 h-11 rounded-pill border-none bg-teal-500 hover:bg-teal-600 text-white text-lg cursor-pointer"
                >
                  ‹
                </button>
                <button
                  aria-label="Next"
                  className="w-11 h-11 rounded-pill border-none bg-teal-500 hover:bg-teal-600 text-white text-lg cursor-pointer"
                >
                  ›
                </button>
                <div className="font-mono text-xs text-ink-400">carousel arrows</div>
              </div>
            </div>
          </Card>
        </section>

        {/* Forms & controls */}
        <section className="pt-14">
          <SectionHeading title="Forms & Controls" />
          <Card className="p-9 grid gap-7 rounded-md">
            <div>
              <div className="font-mono text-xs text-ink-400 mb-3">quote bar · pill input + attached primary</div>
              <div className="inline-flex items-center gap-2 bg-white rounded-pill p-1.5 shadow-floating max-w-[560px] w-full box-border">
                <Input placeholder="Where are you moving from?" className="flex-1 min-w-0" />
                <Button variant="secondary" className="whitespace-nowrap rounded-pill">
                  Get a Quote ›
                </Button>
              </div>
            </div>
            <div className="flex flex-wrap gap-12 items-start">
              <div>
                <div className="font-mono text-xs text-ink-400 mb-3">segmented toggle</div>
                <SegmentedToggle options={["Moving", "Storage"]} />
              </div>
              <div>
                <div className="font-mono text-xs text-ink-400 mb-3">text field states</div>
                <div className="flex gap-4 flex-wrap">
                  <Input placeholder="Default" className="bg-white" />
                  <Input defaultValue="Focused" readOnly />
                </div>
              </div>
              <div>
                <div className="font-mono text-xs text-ink-400 mb-3">carousel pagination</div>
                <div className="flex items-center gap-2.5 pt-3.5">
                  <div className="w-14 h-2 rounded-pill bg-teal-500" />
                  <div className="w-2 h-2 rounded-pill bg-[#CCD5D0]" />
                  <div className="w-2 h-2 rounded-pill bg-[#CCD5D0]" />
                  <div className="w-2 h-2 rounded-pill bg-[#CCD5D0]" />
                </div>
              </div>
            </div>
          </Card>
        </section>

        {/* Badges & indicators */}
        <section className="pt-14">
          <SectionHeading title="Badges & Indicators" />
          <Card className="p-9 flex flex-wrap gap-12 items-start rounded-md">
            <div>
              <div className="font-mono text-xs text-ink-400 mb-3">step markers</div>
              <div className="flex gap-3.5">
                {["1", "2", "3", "4", "5"].map((s) => (
                  <StepBadge key={s}>{s}</StepBadge>
                ))}
              </div>
            </div>
            <div>
              <div className="font-mono text-xs text-ink-400 mb-3">rating</div>
              <Rating score={4.8} count={5527} />
            </div>
            <div>
              <div className="font-mono text-xs text-ink-400 mb-3">icon tile</div>
              <div className="flex gap-3.5">
                <IconTile tone="teal">H</IconTile>
                <IconTile tone="clay">H</IconTile>
              </div>
            </div>
            <div>
              <div className="font-mono text-xs text-ink-400 mb-3">heading underline accent</div>
              <div className="font-display font-bold text-2xl text-ink-800">
                Stress-free moving
                <div className="w-full h-1 bg-teal-500 rounded-pill mt-1.5" />
              </div>
            </div>
          </Card>
        </section>

        {/* Cards */}
        <section className="pt-14">
          <SectionHeading title="Cards" />
          <div className="grid grid-cols-3 gap-6 mb-6">
            <Card>
              <div className="flex items-center gap-3 mb-3.5">
                <IconTile tone="teal">H</IconTile>
                <div className="font-display font-semibold text-[17px] text-ink-800">Local Movers</div>
              </div>
              <p className="m-0 text-[15px] leading-[1.65]">
                Trusted local removalists offering complete removals services, from planning to execution, for a
                stress-free relocation.
              </p>
            </Card>
            <Card>
              <StepBadge>1</StepBadge>
              <div className="font-display font-semibold text-[17px] text-ink-800 mt-3.5 mb-2">
                Set Your Destination
              </div>
              <p className="m-0 text-[15px] leading-[1.65]">
                Call us or complete our quick online form to let us know where you&apos;re moving and what needs
                relocating.
              </p>
            </Card>
            <div className="bg-white border border-border rounded-[12px] overflow-hidden hover:shadow-raised transition-shadow">
              <div className="h-[110px] bg-[repeating-linear-gradient(45deg,#EEF6F4,#EEF6F4_12px,#DCEEEA_12px,#DCEEEA_24px)] grid place-items-center font-mono text-xs text-[#5E8A80]">
                team / location photo
              </div>
              <div className="px-6 py-5">
                <div className="font-display font-semibold text-[17px] text-ink-800 mb-1.5">Sydney</div>
                <a href="#" className="text-sm font-bold text-teal-500">
                  Sydney Removalists ›
                </a>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-6">
            <div className="bg-gray-50 rounded-[12px] p-6.5">
              <div className="font-display font-semibold text-[17px] text-ink-800 mb-3.5">
                DIY
                <br />
                Moving yourself
              </div>
              <div className="text-sm leading-[1.6] text-ink-600">Truck rental + materials + labour + time</div>
              <div className="font-mono text-[11px] text-ink-400 mt-4.5">compare · neutral</div>
            </div>
            <div className="bg-teal-50 rounded-[12px] p-6.5">
              <div className="font-display font-semibold text-[17px] text-ink-800 mb-3.5">
                Hire
                <br />2 Movers &amp; Truck
              </div>
              <div className="text-sm leading-[1.6] text-ink-600">Variable hourly rates</div>
              <div className="font-mono text-[11px] text-[#6E948A] mt-4.5">compare · tint</div>
            </div>
            <div className="bg-teal-500 rounded-[12px] p-6.5">
              <div className="font-display font-semibold text-[17px] text-white mb-3.5">
                Moving with
                <br />
                Movera
              </div>
              <div className="text-sm leading-[1.6] text-teal-50">Transparent fixed or hourly pricing</div>
              <div className="font-mono text-[11px] text-teal-100 mt-4.5">compare · highlighted</div>
            </div>
          </div>
        </section>

        {/* Navigation */}
        <section className="pt-14">
          <SectionHeading title="Navigation" />
          <Nav />
        </section>

        {/* CTA band & footer */}
        <section className="pt-14">
          <SectionHeading title="CTA Band & Footer" />
          <div className="rounded-md overflow-hidden border border-border">
            <CTABand />
            <Footer />
          </div>
        </section>

        {/* Dialog */}
        <section className="pt-14">
          <SectionHeading
            title="Dialog"
            subtitle="Floating elevation on a 40% ink scrim. One clay primary per dialog; dismiss is always available top-right."
          />
          <Dialog>
            <DialogHeader />
            <div className="px-7 pt-4.5 pb-7">
              <div className="font-display font-bold text-[22px] text-ink-800 mb-2">Ready for a quote?</div>
              <p className="m-0 mb-5.5 text-[15px] leading-[1.65]">
                Tell us where you&apos;re moving and we&apos;ll get back to you within one business day with
                transparent, fixed pricing.
              </p>
              <div className="flex gap-3">
                <Button variant="primary" className="flex-1">
                  Get a Quote ›
                </Button>
                <Button variant="outline">Not now</Button>
              </div>
            </div>
          </Dialog>
        </section>

        {/* Form */}
        <section className="pt-14">
          <SectionHeading
            title="Form"
            subtitle="Labels in Poppins 600 ink-800; pill fields on gray-100; a single clay submit. Errors use a warm red with 4px focus ring."
          />
          <Card className="p-9 max-w-[640px] box-border rounded-md">
            <div className="font-display font-bold text-[22px] text-ink-800 mb-6">Get your moving quote</div>
            <div className="grid grid-cols-2 gap-5">
              <div className="grid gap-2">
                <Label>Full name</Label>
                <Input placeholder="Jane Citizen" />
              </div>
              <div className="grid gap-2">
                <Label>Phone</Label>
                <Input placeholder="04xx xxx xxx" />
              </div>
              <div className="grid gap-2">
                <Label>Moving from</Label>
                <Input defaultValue="Wolli Creek NSW" readOnly className="bg-white" />
              </div>
              <div className="grid gap-2">
                <Label className="text-danger">Moving to</Label>
                <Input defaultValue="???" readOnly error className="bg-white" />
                <div className="text-xs text-danger">Please enter a suburb or postcode</div>
              </div>
              <div className="grid gap-2 col-span-2">
                <Label>Service</Label>
                <Select defaultValue="Local move">
                  <option>Local move</option>
                  <option>Interstate move</option>
                  <option>Storage</option>
                </Select>
              </div>
              <div className="grid gap-2 col-span-2">
                <Label>Anything else?</Label>
                <Textarea placeholder="Piano, pool table, fragile items…" rows={3} />
              </div>
              <label className="col-span-2 flex items-center gap-2.5 text-sm cursor-pointer">
                <span className="w-5 h-5 rounded-sm bg-teal-500 inline-grid place-items-center text-white text-xs shrink-0">
                  ✓
                </span>
                Send me moving tips and updates
              </label>
              <div className="col-span-2 flex items-center gap-4 mt-1">
                <Button variant="primary">Get a Quote ›</Button>
                <div className="text-[13px] text-ink-400">No obligation · replies within 1 business day</div>
              </div>
            </div>
          </Card>
        </section>

        {/* Alerts & toasts */}
        <section className="pt-14">
          <SectionHeading title="Alerts & Toasts" />
          <Card className="p-9 grid gap-4 max-w-[640px] box-border rounded-md">
            <Alert tone="info">
              <strong>Heads up:</strong> public holiday surcharges apply on 26 Jan.
            </Alert>
            <Alert tone="success">
              <strong>Quote sent!</strong> We&apos;ll be in touch within one business day.
            </Alert>
            <Alert tone="danger">
              <strong>Something went wrong.</strong> Please try again or call 1300 465 569.
            </Alert>
            <Toast>Booking confirmed</Toast>
          </Card>
        </section>

        {/* Tabs, accordion & tooltip */}
        <section className="pt-14">
          <SectionHeading title="Tabs, Accordion & Tooltip" />
          <div className="grid grid-cols-2 gap-6">
            <Card className="p-7 rounded-md">
              <div className="font-mono text-xs text-ink-400 mb-4">tabs · underline style</div>
              <Tabs items={tabItems} />
              <div className="font-mono text-xs text-ink-400 mt-6 mb-3">tooltip</div>
              <Tooltip label="Fixed pricing, no surprises">
                <button className="font-display font-semibold text-sm text-teal-500 bg-teal-50 border-none rounded-pill px-5 py-2.5 cursor-default">
                  Transparent pricing ⓘ
                </button>
              </Tooltip>
            </Card>
            <Card className="p-7 rounded-md">
              <div className="font-mono text-xs text-ink-400 mb-4">accordion · FAQ pattern</div>
              <Accordion items={faqs} />
            </Card>
          </div>
        </section>

        {/* Decorative motifs */}
        <section className="pt-14">
          <SectionHeading
            title="Decorative Motifs"
            subtitle='The dashed "road" divider threads sections together; keep it teal-200 with white dashes.'
          />
          <Card className="p-9 grid gap-5 rounded-md">
            <RoadDivider />
            <div className="font-mono text-xs text-ink-400">
              road divider · teal-200 fill, 4px dashed white centerline, pill ends · used as section separator and
              step-path
            </div>
          </Card>
        </section>
      </div>
    </div>
  );
}
