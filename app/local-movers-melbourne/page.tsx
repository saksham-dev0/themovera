import type { Metadata } from "next";
import Image from "next/image";
import { LandingQuoteForm } from "@/components/landing/LandingQuoteForm";
import { MobileCallBar } from "@/components/landing/MobileCallBar";
import { FaqDialog } from "@/components/landing/FaqDialog";
import { ServiceAreaTabs } from "@/components/landing/ServiceAreaTabs";
import { ReviewsMarquee } from "@/components/ui/ReviewsMarquee";
import {
  IconCalendar,
  IconClock,
  IconGoogle,
  IconInsurance,
  IconMapPin,
  IconPhone,
  IconShield,
  IconStar,
  IconTag,
  IconTeam,
  IconTruck,
} from "@/components/landing/Icons";
import {
  HOURLY_RATE_DISPLAY,
  PHONE_DISPLAY,
  PHONE_TEL,
  faqs,
  features,
  serviceAreas,
  services,
  pricingNotes,
  pricingPlans,
  steps,
  trustBadges,
  whyChooseUs,
} from "./content";
import { JsonLd } from "@/components/seo/JsonLd";
import { faqSchema, organizationSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Local Movers Melbourne | Two Men and a Truck from $65/hr — Movera",
  description:
    "Hire local removalists in Melbourne. Two Men and a Truck from $65/hr, cheap furniture removals, packers and movers, $100k cover. Trusted, reliable and efficient removalists near me.",
  alternates: { canonical: "/local-movers-melbourne" },
  openGraph: {
    title: "Local Movers Melbourne | Two Men and a Truck from $65/hr — Movera",
    description: "Hire local removalists in Melbourne. Two Men and a Truck from $65/hr, cheap furniture removals, packers and movers, $100k cover. Trusted, reliable and efficient removalists near me.",
    url: "/local-movers-melbourne",
  },
};

const navLinks = [
  { label: "HOME", href: "#top" },
  { label: "SERVICES", href: "#services" },
  { label: "WHY US", href: "#why-us" },
  { label: "REVIEWS", href: "#reviews" },
  { label: "PRICING", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
  { label: "AREAS", href: "#areas" },
];

const sectionLabel = "mb-3 font-display text-sm font-semibold uppercase tracking-[1.5px] text-teal-500 sm:text-[15px]";
const sectionTitle =
  "m-0 mb-6 font-display text-[28px] leading-[1.25] font-bold text-ink-800 sm:text-[34px] lg:whitespace-nowrap";

const icons = {
  tag: IconTag,
  shield: IconShield,
  clock: IconClock,
  team: IconTeam,
  insurance: IconInsurance,
  star: IconStar,
  truck: IconTruck,
  pin: IconMapPin,
  calendar: IconCalendar,
  google: IconGoogle,
} as const;

function Icon({ name, className }: { name: string; className?: string }) {
  const Component = icons[name as keyof typeof icons] ?? IconStar;
  return <Component className={className} />;
}

/**
 * Call button: "CALL NOW" sits above the box as a small label so the phone
 * number itself gets the largest type on the button.
 */
function CallButton({ tone = "light", className = "" }: { tone?: "light" | "dark"; className?: string }) {
  return (
    <a
      href={`tel:${PHONE_TEL}`}
      className={`inline-flex flex-col items-center rounded-sm border-2 px-3 py-2 no-underline transition-colors sm:px-5 ${
        tone === "dark"
          ? "border-sage-500 text-white hover:bg-sage-500/15"
          : "border-teal-500 text-teal-500 hover:bg-teal-50"
      } ${className}`}
    >
      <span
        className={`font-display text-[10px] font-semibold uppercase tracking-[1.5px] ${
          tone === "dark" ? "text-sage-500" : "text-teal-500/80"
        }`}
      >
        Call Now
      </span>
      <span className="flex items-center gap-2 font-display text-[20px] font-bold leading-tight sm:text-[22px]">
        <IconPhone className="h-4 w-4" />
        {PHONE_DISPLAY}
      </span>
    </a>
  );
}

function CtaPair({
  tone = "light",
  align = "left",
}: {
  tone?: "light" | "dark";
  align?: "left" | "center";
}) {
  return (
    <div
      className={`flex flex-wrap items-stretch gap-3 ${
        align === "center" ? "justify-center" : ""
      }`}
    >
      <a
        href="#quote-form"
        className="flex items-center rounded-sm bg-clay-500 px-6 py-3.5 font-display text-[15px] font-semibold text-white no-underline transition-colors hover:bg-clay-600"
      >
        GET A FREE QUOTE →
      </a>
      <CallButton tone={tone} />
    </div>
  );
}

export default function LocalMoversMelbourne() {
  return (
    <div id="top" className="bg-gray-50 font-sans text-ink-600">
      <JsonLd data={[organizationSchema, faqSchema(faqs)]} />
      {/* Nav — anchors only, no outbound links */}
      <header className="sticky top-0 z-30 bg-ink-900">
        <div className="mx-auto flex max-w-[1180px] items-center gap-6 px-5 py-3.5">
          <div className="flex shrink-0 items-center gap-2.5">
            <div className="h-10 w-10 shrink-0 overflow-hidden rounded-sm border border-border bg-white p-1">
              <Image
                src="/landing/logo.webp"
                alt="Movera"
                width={32}
                height={32}
                priority
                className="h-full w-full object-contain"
              />
            </div>
            <div className="hidden font-display text-lg font-bold leading-none tracking-[1px] text-white sm:block">
              MOVERA
            </div>
          </div>

          <nav className="hidden flex-1 items-center gap-6 lg:flex">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="font-display text-[13px] font-semibold tracking-wide text-white no-underline hover:text-teal-500"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <CallButton tone="dark" className="ml-auto shrink-0" />
        </div>
      </header>

      {/* 1 · Hero: quote line → trust factor → form */}
      <section className="relative overflow-hidden">
        <Image
          src="/landing/hero.webp"
          alt=""
          fill
          sizes="100vw"
          quality={62}
          priority
          fetchPriority="high"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-ink-900/75" />
        <div className="relative mx-auto grid max-w-[1180px] items-start gap-10 px-5 py-10 lg:grid-cols-[1fr_400px] lg:py-14">
          <div>
            <h1 className="m-0 font-display text-[24px] font-bold leading-[1.2] text-white min-[400px]:text-[30px] sm:text-[42px] lg:text-[46px]">
              <span className="block whitespace-nowrap">Two Men and a Truck,</span>
              <span className="block whitespace-nowrap text-sage-500">Starts From {HOURLY_RATE_DISPLAY}*</span>
            </h1>
            {/* Disclaimer sits with the headline above it — small and faded. */}
            <p className="m-0 mt-1.5 font-sans text-[11px] leading-none tracking-wide text-white/45 sm:text-[12px]">
              *T&amp;Cs apply.
            </p>
            <p className="mt-4 mb-6 max-w-[560px] text-[15px] leading-[1.7] text-white/80">
              Hire local removalists who actually turn up. Movera moves Melbourne homes and offices
              every day — cheap furniture removals, full packers and movers service, and one honest
              price with no hidden fees.
            </p>

            {/* 2 · Trust factor strip, directly under the hero quote */}
            <div className="mb-7 grid grid-cols-2 gap-px overflow-hidden rounded-md border border-white/15 bg-white/15 sm:grid-cols-3">
              {trustBadges.map((badge) => (
                <div
                  key={badge.label}
                  className="flex flex-col items-center bg-ink-900/70 px-3 py-4 text-center"
                >
                  <Icon name={badge.icon} className="mb-2 h-6 w-6 text-sage-500" />
                  <div className="font-display text-[15px] font-bold leading-tight text-sage-500">
                    {badge.value}
                  </div>
                  <div className="mt-1 text-[11px] uppercase leading-[1.35] tracking-wide text-white/70">
                    {badge.label}
                  </div>
                </div>
              ))}
            </div>

            <CtaPair tone="dark" />
          </div>

          <LandingQuoteForm id="quote-form" />
        </div>
      </section>

      {/* 3 · Social proof: rating band + reviews slider, straight under the hero */}
      {/* Rating band */}
      <section className="bg-ink-900">
        <div className="mx-auto flex max-w-[1180px] flex-col items-center gap-6 px-5 py-10 text-center sm:flex-row sm:justify-between sm:text-left">
          <div>
            <div className="flex items-center justify-center gap-2.5 font-display text-[34px] font-bold leading-none text-sage-500 sm:justify-start">
              4.8
              <IconStar className="h-7 w-7" />
              <IconGoogle className="h-7 w-7" />
            </div>
            <div className="mt-1 text-sm text-white/70">Based on 2,700+ verified reviews</div>
          </div>
          <div className="max-w-[520px] text-[15px] leading-[1.7] text-white/80">
            Reliable and efficient removalists across Melbourne — 5,000+ moves completed, $100,000
            goods-in-transit cover on every job.
          </div>
          <CtaPair tone="dark" />
        </div>
      </section>


      <section id="reviews" className="cv-auto scroll-mt-24 overflow-hidden bg-white py-9">
        <div className="mx-auto mb-8 max-w-[1180px] px-5 text-center">
          <div className={sectionLabel}>Customer Reviews</div>
          <h2 className={`${sectionTitle} mb-0 text-center`}>
            Real Melbourne moves, in our customers&apos; own words
          </h2>
        </div>

        {/* 4a · Video reviews first */}
        <div className="mx-auto mb-4 max-w-[1180px] px-5 text-center">
          <h3 className="m-0 mb-1.5 font-display text-[20px] font-bold text-ink-800 sm:text-[24px]">
            Video Reviews
          </h3>
          <p className="m-0 text-sm leading-[1.65] text-ink-600">
            Melbourne customers filmed on moving day — unscripted, unedited.
          </p>
        </div>
        <ReviewsMarquee variant="video" />

        {/* 4b · Written reviews second */}
        <div className="mx-auto mb-4 mt-10 max-w-[1180px] px-5 text-center">
          <h3 className="m-0 mb-1.5 font-display text-[20px] font-bold text-ink-800 sm:text-[24px]">
            Written Reviews
          </h3>
          <p className="m-0 text-sm leading-[1.65] text-ink-600">
            4.8 stars from 2,700+ verified reviews across Melbourne.
          </p>
        </div>
        <ReviewsMarquee variant="written" direction="rtl" />

        <div className="mx-auto mt-9 max-w-[1180px] px-5">
          <CtaPair align="center" />
        </div>
      </section>

      {/* 4 · Features */}
      <section className="bg-white">
        <div className="mx-auto max-w-[1180px] px-5 py-10 text-center">
          <div className={sectionLabel}>Why Movera</div>
          <h2 className={sectionTitle}>
            Trusted removalists Melbourne families keep re-booking
          </h2>
          <div className="grid grid-cols-2 gap-5 lg:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="rounded-md border border-border bg-gray-50 px-5 py-7 text-center transition-shadow hover:shadow-raised"
              >
                <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-pill bg-teal-100 text-teal-500">
                  <Icon name={feature.icon} className="h-7 w-7" />
                </div>
                <div className="mb-2 font-display text-[14px] font-bold uppercase tracking-wide text-ink-800">
                  {feature.title}
                </div>
                <p className="m-0 text-[13px] leading-[1.6] text-ink-600">{feature.body}</p>
              </div>
            ))}
          </div>
          <div className="mt-8">
            <CtaPair align="center" />
          </div>
        </div>
      </section>

      {/* 5 · Why choose us */}
      <section id="why-us" className="cv-auto scroll-mt-24 bg-gray-50">
        <div className="mx-auto max-w-[1180px] px-5 py-10">
          <div className={sectionLabel}>Why Choose Us?</div>
          <h2 className={sectionTitle}>
            Hire local removalists, not a lead-generation website
          </h2>
          <div className="grid gap-5 sm:grid-cols-2">
            {whyChooseUs.map((item) => (
              <div key={item.title} className="rounded-md border border-border bg-white p-6">
                <div className="mb-2 flex items-center gap-2.5">
                  <span className="grid h-6 w-6 shrink-0 place-items-center rounded-pill bg-teal-500 text-xs text-white">
                    ✓
                  </span>
                  <span className="font-display text-[16px] font-semibold text-ink-800">
                    {item.title}
                  </span>
                </div>
                <p className="m-0 text-sm leading-[1.7] text-ink-600">{item.body}</p>
              </div>
            ))}
          </div>
          <div className="mt-8">
            <CtaPair />
          </div>
        </div>
      </section>

      {/* 6 · Services */}
      <section id="services" className="cv-auto scroll-mt-24 bg-white">
        <div className="mx-auto max-w-[1180px] px-5 py-10">
          <div className={sectionLabel}>Our Services</div>
          <h2 className={sectionTitle}>
            Removalists in Melbourne for every kind of move
          </h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <div
                key={service.title}
                className="overflow-hidden rounded-md border border-border bg-white transition-shadow hover:shadow-raised"
              >
                <div className="relative h-[150px]">
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover"
                  />
                </div>
                <div className="p-5">
                  <div className="mb-2 font-display text-[16px] font-semibold text-ink-800">
                    {service.title}
                  </div>
                  <p className="m-0 text-sm leading-[1.65] text-ink-600">{service.body}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8">
            <CtaPair />
          </div>
        </div>
      </section>

      {/* 7 · How it works */}
      <section className="cv-auto bg-gray-50">
        <div className="mx-auto max-w-[1180px] px-5 py-10">
          <div className={sectionLabel}>Our Process</div>
          <h2 className={sectionTitle}>
            Moving house in Melbourne in three simple steps
          </h2>
          <div className="grid gap-8 sm:grid-cols-3">
            {steps.map((step) => (
              <div key={step.n}>
                <div
                  className="mb-3 font-display text-6xl font-bold text-transparent"
                  style={{ WebkitTextStroke: "1.5px #2c5f8a" }}
                >
                  {step.n}
                </div>
                <div className="mb-2 font-display text-lg font-semibold text-ink-800">
                  {step.title}
                </div>
                <p className="m-0 max-w-[320px] text-sm leading-[1.7] text-ink-600">{step.body}</p>
              </div>
            ))}
          </div>
          <div className="mt-8">
            <CtaPair />
          </div>
        </div>
      </section>

      {/* 8 · Our Pricing */}
      <section id="pricing" className="cv-auto scroll-mt-24 bg-white">
        <div className="mx-auto max-w-[1180px] px-5 py-10">
          <div className={`${sectionLabel} text-center`}>Our Pricing</div>
          <h2 className={`${sectionTitle} text-center`}>
            Straightforward hourly rates, no hidden fees
          </h2>
          <p className="mx-auto -mt-2 mb-8 max-w-[640px] text-center text-[15px] leading-[1.7] text-ink-600">
            Pick the crew size that fits your move. Every rate below includes the truck, the
            equipment and $100,000 goods-in-transit cover — the number we quote is the number on
            your invoice.
          </p>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {pricingPlans.map((plan) => (
              <div
                key={plan.name}
                className={`relative flex flex-col rounded-md border bg-white p-6 transition-shadow hover:shadow-raised ${
                  plan.popular ? "border-teal-500 bg-teal-50 shadow-raised" : "border-border"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-pill bg-clay-500 px-3 py-1 font-display text-[10px] font-bold uppercase tracking-[1.5px] text-white">
                    Most Booked
                  </div>
                )}
                <div className="mb-3 font-display text-[15px] font-bold uppercase tracking-wide text-ink-800">
                  {plan.name}
                </div>
                <div className="mb-1 flex items-baseline gap-1">
                  <span className="font-display text-[38px] font-bold leading-none text-teal-500">
                    {plan.rate}
                  </span>
                  <span className="font-display text-sm font-semibold text-ink-400">
                    {plan.unit}
                  </span>
                </div>
                <p className="m-0 mb-4 text-[13px] leading-[1.6] text-ink-600">{plan.bestFor}</p>
                <div className="mb-5 grid gap-2.5 border-t border-border pt-4">
                  {plan.includes.map((item) => (
                    <div key={item} className="flex items-start gap-2 text-[13px] leading-[1.5]">
                      <span className="mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-pill bg-teal-500 text-[9px] text-white">
                        ✓
                      </span>
                      {item}
                    </div>
                  ))}
                </div>
                <a
                  href="#quote-form"
                  className={`mt-auto block rounded-sm px-4 py-3 text-center font-display text-sm font-semibold no-underline transition-colors ${
                    plan.popular
                      ? "bg-clay-500 text-white hover:bg-clay-600"
                      : "border-2 border-teal-500 text-teal-500 hover:bg-teal-50"
                  }`}
                >
                  GET A FREE QUOTE →
                </a>
              </div>
            ))}
          </div>

          <div className="mt-7 rounded-md border border-border bg-gray-50 px-5 py-5">
            <div className="mb-2.5 font-display text-xs font-semibold uppercase tracking-[1.5px] text-ink-400">
              What the rate covers
            </div>
            <ul className="m-0 grid list-none gap-2 p-0 sm:grid-cols-2">
              {pricingNotes.map((note) => (
                <li key={note} className="flex items-start gap-2 text-[13px] leading-[1.6]">
                  <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-pill bg-teal-500" />
                  {note}
                </li>
              ))}
            </ul>
            <p className="m-0 mt-3 text-[11px] leading-[1.5] text-ink-400">
              *Rates shown are starting rates and depend on access, distance and date. T&amp;Cs
              apply.
            </p>
          </div>

          <div className="mt-8">
            <CtaPair align="center" />
          </div>
        </div>
      </section>

      {/* 9 · Who we are */}
      <section className="cv-auto bg-ink-900">
        <div className="mx-auto grid max-w-[1180px] items-center gap-10 px-5 py-10 lg:grid-cols-2">
          <div>
            <div className="mb-3 font-display text-sm font-semibold uppercase tracking-[1.5px] text-sage-500 sm:text-[15px]">
              Who We Are
            </div>
            <h2 className="m-0 mb-5 font-display text-[28px] font-bold leading-[1.25] text-white sm:text-[34px]">
              Melbourne removalists you can call, not a quote comparison form
            </h2>
            <p className="mb-4 text-[15px] leading-[1.75] text-white/75">
              Movera is a Melbourne moving company running our own crews and trucks. When you book
              two men with a truck through us, we quote the job, we schedule the crew, and we answer
              the phone if your settlement time shifts. There is no bidding, no unknown subcontractor
              turning up, and no surprise line on the invoice.
            </p>
            <p className="m-0 mb-6 text-[15px] leading-[1.75] text-white/75">
              From a single wardrobe to a full four-bedroom house, we bring blankets, trolleys,
              straps and wrap on every truck — so whether you booked cheap furniture movers for an
              hour or a full packers and movers service for the weekend, the standard is the same.
            </p>
            <CtaPair tone="dark" />
          </div>
          <div className="relative h-[300px] overflow-hidden rounded-md lg:h-[380px]">
            <Image
              src="/landing/fleet-desktop.webp"
              alt="Movera truck fleet in Melbourne"
              fill
              sizes="(max-width: 1024px) 100vw, 560px"
              className="hidden object-cover sm:block"
            />
            <Image
              src="/landing/fleet-mobile.webp"
              alt="Movera truck fleet in Melbourne"
              fill
              sizes="100vw"
              className="object-cover sm:hidden"
            />
          </div>
        </div>
      </section>

      {/* 10 · FAQ */}
      <section id="faq" className="cv-auto scroll-mt-24 bg-gray-50">
        <div className="mx-auto max-w-[1180px] px-5 py-10">
          <div className={`${sectionLabel} text-center`}>Frequently Asked Questions</div>
          <h2 className={`${sectionTitle} text-center`}>
            Removalists near me — your questions, answered
          </h2>
          <div className="mx-auto grid max-w-[820px] gap-3">
            {faqs.slice(0, 6).map((faq) => (
              <details
                key={faq.q}
                className="group overflow-hidden rounded-[10px] border border-border bg-white"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-5 py-4 font-display text-sm font-semibold text-ink-800">
                  {faq.q}
                  <span className="text-base text-teal-500 group-open:hidden">▾</span>
                  <span className="hidden text-base text-teal-500 group-open:inline">▴</span>
                </summary>
                <div className="border-t border-border bg-teal-50 px-5 py-4 text-sm leading-[1.7] text-ink-600">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
          <div className="mt-6 text-center">
            <FaqDialog
              items={faqs}
              triggerLabel="View all FAQs →"
              triggerClassName="cursor-pointer rounded-sm border-2 border-teal-500 bg-white px-6 py-3 font-display text-[15px] font-semibold text-teal-500 transition-colors hover:bg-teal-50"
            />
          </div>
          <div className="mt-6">
            <CtaPair align="center" />
          </div>
        </div>
      </section>

      {/* 11 · Areas we service */}
      <section id="areas" className="cv-auto scroll-mt-24 bg-white">
        <div className="mx-auto max-w-[1180px] px-5 py-10">
          <div className={`${sectionLabel} text-center`}>Areas We Service</div>
          <h2 className={`${sectionTitle} text-center`}>
            Local removalists across every corner of Melbourne
          </h2>
          <ServiceAreaTabs areas={serviceAreas} />
          <div className="mt-8">
            <CtaPair align="center" />
          </div>
        </div>
      </section>

      {/* 12 · Closing quote form, over a customer-service backdrop */}
      <section className="cv-auto relative overflow-hidden bg-ink-900">
        <Image
          src="/landing/support.webp"
          alt=""
          fill
          sizes="100vw"
          quality={60}
          className="object-cover"
        />
        <div className="absolute inset-0 bg-ink-900/80" />
        <div className="relative mx-auto grid max-w-[1180px] items-center gap-10 px-5 py-10 lg:grid-cols-[1fr_400px]">
          <div>
            <div className="mb-3 font-display text-sm font-semibold uppercase tracking-[1.5px] text-sage-500 sm:text-[15px]">
              Get a Free Quote
            </div>
            <h2 className="m-0 mb-6 max-w-[560px] font-display text-[28px] font-bold leading-[1.25] text-white sm:text-[34px]">
              We make your move stress-free — starting with the price
            </h2>
            <p className="mb-6 max-w-[520px] text-[15px] leading-[1.75] text-white/75">
              Send us your pickup and drop-off suburbs and we&apos;ll come back with an affordable
              removalists quote for your date. Prefer to talk it through? Our Melbourne coordinators
              answer the phone seven days a week.
            </p>
            <CtaPair tone="dark" />
          </div>
          <LandingQuoteForm
            heading="Book Two Men and a Truck"
            subheading="Tell us where you're moving. We'll email a thank-you confirmation straight away and call you with your price."
            source="local-movers-melbourne-footer"
          />
        </div>
      </section>

      {/* Footer — self-contained, no outbound links */}
      <footer className="bg-ink-900 pb-24 md:pb-0">
        <div className="mx-auto max-w-[1180px] px-5 pt-10 pb-8">
          <div className="grid gap-10 border-b border-white/10 pb-10 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <div className="mb-4 flex items-center gap-2.5">
                <div className="h-10 w-10 overflow-hidden rounded-sm bg-white p-1">
                  <Image
                    src="/landing/logo.webp"
                    alt="Movera"
                    width={32}
                    height={32}
                    className="h-full w-full object-contain"
                  />
                </div>
                <div className="font-display text-lg font-bold tracking-[1px] text-white">
                  MOVERA
                </div>
              </div>
              <p className="m-0 mb-5 max-w-[260px] text-sm leading-[1.7] text-white/70">
                Trusted removalists Melbourne relies on for local house moves, office relocations and
                furniture removals.
              </p>
              {/* Social icons are display-only — no outbound links on this page */}
              <div className="flex gap-2.5">
                {[
                  { label: "Facebook", icon: "/landing/facebook.webp" },
                  { label: "Twitter", icon: "/landing/twitter.webp" },
                  { label: "Instagram", icon: "/landing/instagram.webp" },
                  { label: "YouTube", icon: "/landing/youtube.webp" },
                ].map((social) => (
                  <span
                    key={social.label}
                    aria-label={social.label}
                    className="grid h-9 w-9 place-items-center rounded-pill border-[1.5px] border-ink-400"
                  >
                    <Image src={social.icon} alt={social.label} width={20} height={20} />
                  </span>
                ))}
              </div>
            </div>

            <div>
              <div className="mb-3.5 font-display text-sm font-semibold text-teal-500">Services</div>
              <div className="grid gap-2.5 text-sm text-white/80">
                {services.map((service) => (
                  <span key={service.title}>{service.title}</span>
                ))}
              </div>
            </div>

            <div>
              <div className="mb-3.5 font-display text-sm font-semibold text-teal-500">
                Quick Links
              </div>
              <div className="grid gap-2.5 text-sm">
                {navLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    className="text-white no-underline hover:text-teal-500"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </div>

            <div>
              <div className="mb-3.5 font-display text-sm font-semibold text-teal-500">Contact</div>
              <a
                href={`tel:${PHONE_TEL}`}
                className="mb-2 flex items-center gap-2 font-display text-[26px] font-bold text-white no-underline hover:text-teal-500"
              >
                <IconPhone className="h-5 w-5" />
                {PHONE_DISPLAY}
              </a>
              <div className="text-sm leading-[1.8] text-white/70">
                Mon – Sat: 7:00 AM – 8:00 PM
                <br />
                32-44 Keys Road, Cheltenham VIC 3192
                <br />
                Servicing all Melbourne suburbs
              </div>
            </div>
          </div>

          <div className="pt-8 text-center text-xs text-white/50">
            © {new Date().getFullYear()} Movera — Melbourne Removalists. Move right with Movera.
          </div>
        </div>
      </footer>

      <MobileCallBar />
    </div>
  );
}
