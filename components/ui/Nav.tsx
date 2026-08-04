"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { services } from "@/app/services/data";

const navItems = [
  { label: "ABOUT", href: "/about" },
  { label: "PRICING", href: "/pricing" },
  { label: "REVIEWS", href: "/reviews" },
  { label: "RESOURCES", href: "/guides" },
  { label: "FAQ", href: "/faq" },
  { label: "CONTACT", href: "/contact" },
];

export function InfoBar() {
  return (
    <div className="bg-ink-800 text-white/80">
      <div className="max-w-[1180px] mx-auto flex flex-wrap items-center justify-center sm:justify-between gap-x-6 gap-y-1.5 px-8 py-2 text-xs font-display font-medium">
        <span>Mon – Sat: 9:00 AM – 7:00 PM</span>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-1.5">
          <a href="mailto:hello@movera.com.au" className="hover:text-teal-500">
            hello@movera.com.au
          </a>
          <a href="tel:0285034444" className="hover:text-teal-500">
            ☎ 02 8503 4444
          </a>
        </div>
      </div>
    </div>
  );
}

export function Nav() {
  const [servicesOpen, setServicesOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="sticky top-0 z-20">
      {/* Dark nav bar */}
      <div className="bg-ink-900">
        <div className="max-w-[1180px] mx-auto flex items-center gap-9 px-8 py-4">
          <Link href="/" className="flex items-center gap-2.5 shrink-0 no-underline">
            <div className="relative h-11 w-11 bg-white rounded-sm overflow-hidden shrink-0 border border-border">
              <Image src="/Logo.png" alt="Movera" fill className="object-contain p-1" priority />
            </div>
            <div className="font-display font-bold text-lg tracking-[1px] text-white leading-none">MOVERA</div>
          </Link>

          <nav className="hidden lg:flex gap-7 flex-1 items-center">
            <Link
              href="/"
              className="font-display font-semibold text-[13px] tracking-wide text-white no-underline hover:text-teal-500"
            >
              HOME
            </Link>

            <div
              className="relative"
              onMouseEnter={() => setServicesOpen(true)}
              onMouseLeave={() => setServicesOpen(false)}
            >
              <button
                className="font-display font-semibold text-[13px] tracking-wide text-white bg-transparent border-0 p-0 cursor-pointer hover:text-teal-500"
                onClick={() => setServicesOpen((v) => !v)}
              >
                SERVICES ▾
              </button>
              {servicesOpen && (
                <div className="absolute top-full left-0 pt-3 w-64 z-30">
                  <div className="bg-white rounded-sm shadow-raised py-2">
                    {services.map((s) => (
                      <Link
                        key={s.slug}
                        href={`/services/${s.slug}`}
                        className="block px-4 py-2.5 text-[13px] font-display font-medium text-ink-800 no-underline hover:bg-gray-50 hover:text-teal-500"
                      >
                        {s.title}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="font-display font-semibold text-[13px] tracking-wide text-white no-underline hover:text-teal-500"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-3">
            <Link
              href="/contact"
              className="font-display font-semibold text-xs tracking-wide text-white bg-transparent border-2 border-sage-500 hover:bg-sage-500/15 rounded-sm px-4.5 py-2.5 cursor-pointer whitespace-nowrap no-underline"
            >
              CALL NOW
            </Link>
            <button
              className="lg:hidden flex flex-col justify-center gap-1.5 w-9 h-9 shrink-0 bg-transparent border-0 cursor-pointer"
              aria-label="Toggle menu"
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen((v) => !v)}
            >
              <span
                className={`block h-[2px] w-6 bg-white transition-transform ${mobileOpen ? "translate-y-[7px] rotate-45" : ""}`}
              />
              <span className={`block h-[2px] w-6 bg-white transition-opacity ${mobileOpen ? "opacity-0" : ""}`} />
              <span
                className={`block h-[2px] w-6 bg-white transition-transform ${mobileOpen ? "-translate-y-[7px] -rotate-45" : ""}`}
              />
            </button>
          </div>
        </div>

        {mobileOpen && (
          <nav className="lg:hidden border-t border-white/10 px-8 py-4 flex flex-col gap-1">
            <Link
              href="/"
              onClick={() => setMobileOpen(false)}
              className="font-display font-semibold text-[13px] tracking-wide text-white no-underline py-2.5 hover:text-teal-500"
            >
              HOME
            </Link>
            <Link
              href="/services"
              onClick={() => setMobileOpen(false)}
              className="font-display font-semibold text-[13px] tracking-wide text-white no-underline py-2.5 hover:text-teal-500"
            >
              SERVICES
            </Link>
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="font-display font-semibold text-[13px] tracking-wide text-white no-underline py-2.5 hover:text-teal-500"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        )}
      </div>

      {/* Scrolling announcement banner */}
      <div className="bg-clay-500 overflow-hidden whitespace-nowrap py-2.5">
        <div className="flex animate-marquee w-max">
          {[0, 1].map((i) => (
            <div key={i} className="flex items-center shrink-0 pr-16">
              <span className="font-display font-bold text-[13px] tracking-wide text-white flex items-center gap-2 pl-16">
                🚚 <strong>Welcome to Movera</strong> — Melbourne&apos;s most reliable removalists · $100,000
                goods-in-transit cover on every move
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
