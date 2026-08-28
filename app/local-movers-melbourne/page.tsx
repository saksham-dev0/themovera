import type { Metadata } from "next";
import Image from "next/image";
import { LandingQuoteForm } from "@/components/landing/LandingQuoteForm";
import { MobileCallBar } from "@/components/landing/MobileCallBar";
import { FaqDialog } from "@/components/landing/FaqDialog";
import { ServiceAreaTabs } from "@/components/landing/ServiceAreaTabs";
import {
  HOURLY_RATE,
  PHONE_DISPLAY,
  PHONE_TEL,
  faqs,
  features,
  serviceAreas,
  services,
  steps,
  testimonials,
  trustBadges,
  whyChooseUs,
} from "./content";

export const metadata: Metadata = {
  title: "Local Movers Melbourne | Two Men and a Truck from $60/hr — Movera",
  description:
    "Hire local removalists in Melbourne. Two Men and a Truck from $60/hr, cheap furniture removals, packers and movers, $100k cover. Trusted, reliable and efficient removalists near me.",
};

const navLinks = [
  { label: "HOME", href: "#top" },
  { label: "SERVICES", href: "#services" },
  { label: "WHY US", href: "#why-us" },
  { label: "REVIEWS", href: "#reviews" },
  { label: "FAQ", href: "#faq" },
  { label: "AREAS", href: "#areas" },
];

const sectionLabel = "mb-3 font-display text-xs font-semibold uppercase tracking-[1.5px] text-teal-500";
const sectionTitle = "m-0 mb-8 font-display text-[26px] leading-[1.25] font-bold text-ink-800 sm:text-[30px]";

function CtaPair({ tone = "light" }: { tone?: "light" | "dark" }) {
  return (
    <div className="flex flex-wrap gap-3">
      <a
        href="#quote-form"
        className="cursor-pointer rounded-sm bg-clay-500 px-6 py-3.5 font-display text-[15px] font-semibold text-white no-underline transition-colors hover:bg-clay-600"
      >
        GET A FREE QUOTE →
      </a>
      <a
        href={`tel:${PHONE_TEL}`}
        className={`cursor-pointer rounded-sm border-2 px-6 py-3 font-display text-[15px] font-semibold no-underline transition-colors ${
          tone === "dark"
            ? "border-white/70 text-white hover:bg-white/10"
            : "border-teal-500 text-teal-500 hover:bg-teal-50"
        }`}
      >
        ☎ CALL NOW {PHONE_DISPLAY}
      </a>
    </div>
  );
}

export default function LocalMoversMelbourne() {
  return (
    <div id="top" className="bg-gray-50 font-sans text-ink-600">
      {/* Top info bar */}
      <div className="bg-ink-800 text-white/80">
        <div className="mx-auto flex max-w-[1180px] flex-wrap items-center justify-center gap-x-6 gap-y-1 px-5 py-2 font-display text-xs font-semibold sm:justify-between">
          <span>Mon – Sat: 7:00 AM – 8:00 PM · Melbourne Removalists</span>
          <a href={`tel:${PHONE_TEL}`} className="no-underline hover:text-teal-500">
            ☎ {PHONE_DISPLAY}
          </a>
        </div>
      </div>

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
            <div className="font-display text-lg font-bold leading-none tracking-[1px] text-white">
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

          <a
            href={`tel:${PHONE_TEL}`}
            className="ml-auto whitespace-nowrap rounded-sm border-2 border-sage-500 px-4 py-2 font-display text-xs font-semibold tracking-wide text-white no-underline hover:bg-sage-500/15"
          >
            ☎ CALL NOW {PHONE_DISPLAY}
          </a>
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
        <div className="relative mx-auto grid max-w-[1180px] items-start gap-10 px-5 py-12 lg:grid-cols-[1.15fr_0.85fr] lg:py-16">
          <div>
            <h1 className="m-0 font-display text-[34px] font-bold leading-[1.15] text-white sm:text-[46px]">
              Two Men and a Truck,
              <span className="block text-sage-500">Starts From {HOURLY_RATE}*</span>
            </h1>
            <p className="mt-4 mb-6 max-w-[560px] text-[15px] leading-[1.7] text-white/80">
              Hire local removalists who actually turn up. Movera moves Melbourne homes and offices
              every day — cheap furniture removals, full packers and movers service, and one honest
              price with no hidden fees. <span className="text-white/60">*T&amp;Cs apply.</span>
            </p>

            {/* 2 · Trust factor strip, directly under the hero quote */}
            <div className="mb-7 grid grid-cols-2 gap-px overflow-hidden rounded-md border border-white/15 bg-white/15 sm:grid-cols-3 lg:grid-cols-5">
              {trustBadges.map((badge) => (
                <div key={badge.label} className="bg-ink-900/70 px-3 py-4 text-center">
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

      {/* 3 · Features */}
      <section className="bg-white">
        <div className="mx-auto max-w-[1180px] px-5 py-14 text-center">
          <div className={sectionLabel}>Why Movera</div>
          <h2 className={`${sectionTitle} mx-auto max-w-[640px]`}>
            Trusted removalists Melbourne families keep re-booking
          </h2>
          <div className="grid grid-cols-2 gap-5 lg:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="rounded-md border border-border bg-gray-50 px-5 py-7 text-center transition-shadow hover:shadow-raised"
              >
                <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-pill bg-teal-100 font-display text-2xl font-bold text-teal-500">
                  {feature.icon}
                </div>
                <div className="mb-2 font-display text-[14px] font-bold uppercase tracking-wide text-ink-800">
                  {feature.title}
                </div>
                <p className="m-0 text-[13px] leading-[1.6] text-ink-600">{feature.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4 · Rating band */}
      <section className="bg-ink-900">
        <div className="mx-auto flex max-w-[1180px] flex-col items-center gap-6 px-5 py-10 text-center sm:flex-row sm:justify-between sm:text-left">
          <div>
            <div className="font-display text-[34px] font-bold leading-none text-sage-500">4.8 ★</div>
            <div className="mt-1 text-sm text-white/70">Based on 2,700+ verified reviews</div>
          </div>
          <div className="max-w-[520px] text-[15px] leading-[1.7] text-white/80">
            Reliable and efficient removalists across Melbourne — 5,000+ moves completed, $100,000
            goods-in-transit cover on every job.
          </div>
          <a
            href="#quote-form"
            className="whitespace-nowrap rounded-sm bg-clay-500 px-6 py-3.5 font-display text-[15px] font-semibold text-white no-underline hover:bg-clay-600"
          >
            GET A FREE QUOTE →
          </a>
        </div>
      </section>

      {/* 5 · Why choose us */}
      <section id="why-us" className="cv-auto scroll-mt-24 bg-gray-50">
        <div className="mx-auto max-w-[1180px] px-5 py-14">
          <div className={sectionLabel}>Why Choose Us?</div>
          <h2 className={`${sectionTitle} max-w-[680px]`}>
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
        </div>
      </section>

      {/* 6 · Services */}
      <section id="services" className="cv-auto scroll-mt-24 bg-white">
        <div className="mx-auto max-w-[1180px] px-5 py-14">
          <div className={sectionLabel}>Our Services</div>
          <h2 className={`${sectionTitle} max-w-[680px]`}>
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
        <div className="mx-auto max-w-[1180px] px-5 py-14">
          <div className={sectionLabel}>Our Process</div>
          <h2 className={`${sectionTitle} max-w-[680px]`}>
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
        </div>
      </section>

      {/* 8 · Testimonials */}
      <section id="reviews" className="cv-auto scroll-mt-24 bg-white">
        <div className="mx-auto max-w-[1180px] px-5 py-14">
          <div className={sectionLabel}>Client Testimonials</div>
          <h2 className={`${sectionTitle} max-w-[680px]`}>Real Melbourne moves, in their words</h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {testimonials.map((review) => (
              <div key={review.name} className="rounded-md border border-border bg-gray-50 p-6">
                <div className="mb-3 text-lg text-gold-400">★★★★★</div>
                <p className="m-0 mb-5 text-sm leading-[1.65] text-ink-600">
                  &ldquo;{review.quote}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <div className="grid h-9 w-9 shrink-0 place-items-center rounded-pill bg-teal-500 font-display text-xs font-semibold text-white">
                    {review.initials}
                  </div>
                  <div className="font-display text-sm font-semibold text-ink-800">
                    {review.name}
                    <span className="block font-sans text-xs font-normal text-ink-400">
                      {review.suburb}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9 · Who we are */}
      <section className="cv-auto bg-ink-900">
        <div className="mx-auto grid max-w-[1180px] items-center gap-10 px-5 py-14 lg:grid-cols-2">
          <div>
            <div className="mb-3 font-display text-xs font-semibold uppercase tracking-[1.5px] text-sage-500">
              Who We Are
            </div>
            <h2 className="m-0 mb-5 font-display text-[26px] font-bold leading-[1.25] text-white sm:text-[30px]">
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
        <div className="mx-auto max-w-[1180px] px-5 py-14">
          <div className={`${sectionLabel} text-center`}>Frequently Asked Questions</div>
          <h2 className={`${sectionTitle} mx-auto max-w-[680px] text-center`}>
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
        </div>
      </section>

      {/* 11 · Areas we service */}
      <section id="areas" className="cv-auto scroll-mt-24 bg-white">
        <div className="mx-auto max-w-[1180px] px-5 py-14">
          <div className={`${sectionLabel} text-center`}>Areas We Service</div>
          <h2 className={`${sectionTitle} mx-auto max-w-[680px] text-center`}>
            Local removalists across every corner of Melbourne
          </h2>
          <ServiceAreaTabs areas={serviceAreas} />
        </div>
      </section>

      {/* 12 · Closing quote form */}
      <section className="cv-auto bg-gray-50">
        <div className="mx-auto grid max-w-[1180px] items-center gap-10 px-5 py-14 lg:grid-cols-2">
          <div>
            <div className={sectionLabel}>Get a Free Quote</div>
            <h2 className={`${sectionTitle} max-w-[520px]`}>
              We make your move stress-free — starting with the price
            </h2>
            <p className="mb-6 max-w-[520px] text-[15px] leading-[1.75] text-ink-600">
              Send us your pickup and drop-off suburbs and we&apos;ll come back with an affordable
              removalists quote for your date. Prefer to talk it through? Call{" "}
              <a href={`tel:${PHONE_TEL}`} className="font-semibold text-teal-500 no-underline">
                {PHONE_DISPLAY}
              </a>{" "}
              and speak to a real coordinator.
            </p>
            <CtaPair />
          </div>
          <LandingQuoteForm
            heading="Book Two Men and a Truck"
            subheading="Tell us where you're moving. We'll email a thank-you confirmation straight away and call you with your price."
            source="local-movers-melbourne-footer"
          />
        </div>
      </section>

      {/* Footer — self-contained, no outbound links */}
      <footer className="bg-ink-900 pb-20 md:pb-0">
        <div className="mx-auto max-w-[1180px] px-5 pt-12 pb-8">
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
                <FaqDialog items={faqs} />
              </div>
            </div>

            <div>
              <div className="mb-3.5 font-display text-sm font-semibold text-teal-500">Contact</div>
              <a
                href={`tel:${PHONE_TEL}`}
                className="mb-2 block font-display text-xl font-bold text-white no-underline hover:text-teal-500"
              >
                ☎ {PHONE_DISPLAY}
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
