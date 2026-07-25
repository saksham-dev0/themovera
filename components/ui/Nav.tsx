"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { services } from "@/app/services/data";

const socials = [
  { label: "Facebook", icon: "/facebook.png", href: "#" },
  { label: "Twitter", icon: "/twitter.png", href: "#" },
  { label: "Instagram", icon: "/instagram.png", href: "#" },
  { label: "YouTube", icon: "/youtube.png", href: "#" },
];

const navItems = [
  { label: "HOME", href: "/" },
  { label: "ABOUT", href: "/about" },
  { label: "CONTACT", href: "/contact" },
  { label: "REVIEWS", href: "/reviews" },
  { label: "RESOURCES", href: "/guides" },
];

export function Nav() {
  const [servicesOpen, setServicesOpen] = useState(false);

  return (
    <div className="sticky top-0 z-20">
      <div className="bg-white hidden md:flex justify-end items-center gap-6 px-8 py-2.5 text-[13px]">
        <span className="text-teal-500 font-bold">☎ 02 8503 4444</span>
        <span className="text-ink-800 font-bold">✉ hello@movera.com.au</span>
        <span className="text-ink-800 font-bold">Contact Us</span>
        <div className="flex gap-3 items-center">
          {socials.map((s) => (
            <a key={s.label} href={s.href} aria-label={s.label} className="relative h-4 w-4 shrink-0">
              <Image src={s.icon} alt={s.label} fill className="object-contain" />
            </a>
          ))}
        </div>
      </div>
      <div className="bg-ink-900">
        <div className="max-w-[1180px] mx-auto flex items-center gap-9 px-8 py-4.5">
          <div className="flex items-center gap-2.5 shrink-0">
            <div className="relative h-10 w-10 bg-white rounded-sm overflow-hidden shrink-0">
              <Image src="/Logo.png" alt="Movera" fill className="object-contain p-1" priority />
            </div>
            <div>
              <div className="font-display font-bold text-base tracking-[2px] text-white leading-none">MOVERA</div>
              <div className="text-[9px] tracking-[3px] text-ink-400 mt-1">REMOVALS &amp; STORAGE</div>
            </div>
          </div>
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

            {navItems.slice(1).map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="font-display font-semibold text-[13px] tracking-wide text-white no-underline hover:text-teal-500"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <button className="ml-auto font-display font-semibold text-xs tracking-wide text-white bg-transparent border-2 border-sage-500 hover:bg-sage-500/15 rounded-sm px-4.5 py-2.5 cursor-pointer whitespace-nowrap">
            GET A QUOTE
          </button>
        </div>
      </div>
    </div>
  );
}
