const navItems = ["LOCAL REMOVALISTS", "INTERSTATE", "BUSINESS", "STORAGE", "RESOURCES"];

export function Nav() {
  return (
    <div className="sticky top-0 z-20">
      <div className="bg-white hidden md:flex justify-end items-center gap-6 px-8 py-2.5 text-[13px]">
        <span className="text-teal-500 font-bold">☎ 02 8503 4444</span>
        <span className="text-ink-800 font-bold">✉ hello@movera.com.au</span>
        <span className="text-ink-800 font-bold">Contact Us</span>
        <div className="flex gap-3 text-ink-800">
          <span>f</span>
          <span>t</span>
          <span>ig</span>
          <span>yt</span>
        </div>
      </div>
      <div className="bg-ink-900">
        <div className="max-w-[1180px] mx-auto flex items-center gap-9 px-8 py-4.5">
          <div>
            <div className="border-2 border-teal-500 px-3.5 py-1.5 font-display font-bold text-base tracking-[2px] text-white">
              MOVERA
            </div>
            <div className="text-[9px] tracking-[3px] text-ink-400 text-center mt-1">— REMOVALS &amp; STORAGE —</div>
          </div>
          <nav className="hidden lg:flex gap-7 flex-1">
            {navItems.map((item) => (
              <a
                key={item}
                href="#"
                className="font-display font-semibold text-[13px] tracking-wide text-white no-underline hover:text-teal-500"
              >
                {item}
              </a>
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
