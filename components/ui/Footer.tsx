import Image from "next/image";

const columns = [
  {
    title: "Moving",
    links: [
      { label: "Local Moving", href: "/services/local-removals" },
      { label: "Interstate Relocation", href: "#" },
      { label: "Business Relocations", href: "/services/office-commercial-relocations" },
      { label: "Warehouse Relocations", href: "#" },
      { label: "Packing & Unpacking", href: "/services/packing-unpacking" },
      { label: "Box Shop", href: "#" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Reviews", href: "/reviews" },
      { label: "Pricing", href: "/pricing" },
      { label: "FAQ", href: "/faq" },
      { label: "Moving Guides", href: "/guides" },
      { label: "Meet the Team", href: "#" },
      { label: "Careers", href: "#" },
    ],
  },
];

const locations = [
  { city: "Melbourne", address: ["32-44 Keys Road,", "Cheltenham VIC 3192"] },
  { city: "Melbourne", address: ["32-44 Keys Road,", "Cheltenham VIC 3192"] },
  { city: "Melbourne", address: ["32-44 Keys Road,", "Cheltenham VIC 3192"] },
];

export function CTABand() {
  return (
    <div className="bg-teal-400 text-center py-14 px-8 rounded-md overflow-hidden">
      <div className="font-display font-bold text-[32px] leading-[1.25] text-white mb-6">
        Move the right way
        <br />
        Move with Movera
      </div>
      <div className="flex justify-center gap-4 flex-wrap">
        <button className="font-display font-semibold text-[15px] text-white bg-clay-500 hover:bg-clay-600 rounded-sm px-[26px] py-3.5 cursor-pointer">
          Get a Quote ›
        </button>
        <button className="font-display font-semibold text-[15px] text-white bg-clay-500 hover:bg-clay-600 rounded-sm px-[26px] py-3.5 cursor-pointer">
          Call 1300 465 569
        </button>
      </div>
    </div>
  );
}

export function Footer() {
  return (
    <footer className="bg-ink-900">
      <div className="max-w-[1180px] mx-auto px-8 pt-14 pb-10">
        <div className="flex justify-between items-start gap-8 flex-wrap mb-10">
          <div className="relative h-11 w-11 bg-white rounded-sm overflow-hidden">
            <Image src="/Logo.png" alt="Movera" fill className="object-contain p-1" />
          </div>
          <div className="text-right">
            <div className="font-display font-bold text-2xl text-white mb-2">☎ 1300 465 569</div>
            <div className="flex gap-6 text-sm text-white/80">
              <a href="#" className="hover:text-teal-500">Give Feedback</a>
              <a href="#" className="hover:text-teal-500">Contact Us</a>
              <a href="#" className="hover:text-teal-500">Meet the Team</a>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-10">
          <div>
            <div className="text-[15px] leading-[1.7] text-[#C9D1CC] max-w-[260px] mb-5">
              Your trusted partner for professional removals across Australia
            </div>
            <div className="flex gap-2.5">
              {[
                { label: "Facebook", icon: "/facebook.png" },
                { label: "Twitter", icon: "/twitter.png" },
                { label: "Instagram", icon: "/instagram.png" },
                { label: "YouTube", icon: "/youtube.png" },
              ].map((s) => (
                <a
                  key={s.label}
                  href="#"
                  aria-label={s.label}
                  className="relative w-9 h-9 border-[1.5px] border-ink-400 rounded-pill grid place-items-center"
                >
                  <Image src={s.icon} alt={s.label} fill className="object-contain p-2" />
                </a>
              ))}
            </div>
          </div>
          {columns.map((col) => (
            <div key={col.title}>
              <div className="font-display font-semibold text-sm text-teal-500 mb-3.5">{col.title}</div>
              <div className="grid gap-2.5 text-sm">
                {col.links.map((link) => (
                  <a key={link.label} href={link.href} className="text-white hover:text-teal-500">
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="border-t border-white/10 mt-10 pt-10 grid sm:grid-cols-3 gap-8">
          <div className="sm:col-span-3">
            <div className="font-display font-semibold text-sm text-teal-500 mb-4">Find Us</div>
          </div>
          {locations.map((loc, i) => (
            <div key={`${loc.city}-${i}`} className="text-sm text-white/80">
              <div className="font-display font-semibold text-white mb-1">{loc.city}</div>
              {loc.address.map((line) => (
                <div key={line}>{line}</div>
              ))}
            </div>
          ))}
        </div>

        <div className="border-t border-white/10 mt-10 pt-8 flex flex-col items-center gap-4 text-center">
          <div className="flex items-center gap-2 text-sm text-white">
            <span className="font-display font-bold">Excellent</span>
            <span className="text-gold-400">★★★★★</span>
            <span className="text-white/70">1,521 reviews on ProductReview</span>
          </div>
          <div className="font-display font-bold text-lg text-teal-500">
            MOVE THE RIGHT WAY <span className="text-white">MOVE WITH MOVERA</span>
          </div>
          <div className="flex gap-4 text-xs text-white/60">
            <a href="/privacy" className="hover:text-white">Privacy Policy</a>
            <span>|</span>
            <a href="/terms" className="hover:text-white">Terms &amp; Conditions</a>
            <span>|</span>
            <a href="/returns-refunds" className="hover:text-white">Returns &amp; Refunds</a>
          </div>
          <div className="text-xs text-white/40">
            Movera Transport Pty Ltd t/a Movera Removals &amp; Storage · ABN 26 161 560 489
          </div>
        </div>
      </div>
    </footer>
  );
}
