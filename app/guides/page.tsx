import Link from "next/link";
import { Nav } from "@/components/ui/Nav";
import { CTABand, Footer } from "@/components/ui/Footer";
import { guides } from "@/app/guides/data";

export const metadata = {
  title: "Moving Guides | Movera Removals & Storage",
  description: "Practical, no-nonsense guides for planning and executing your move.",
};

export default function GuidesIndexPage() {
  return (
    <div className="bg-gray-50 font-sans text-ink-600">
      <Nav />

      <section className="max-w-[1180px] mx-auto px-8 pt-16 pb-16">
        <div className="text-xs font-display font-semibold tracking-[1.5px] uppercase text-ink-400 mb-3">
          Moving Guides
        </div>
        <h1 className="font-display font-bold text-5xl leading-[1.1] text-ink-800 m-0 mb-6 max-w-[720px]">
          Practical Guides For Your Move
        </h1>
        <p className="text-[17px] leading-[1.65] max-w-[620px] mb-12">
          No fluff — just what to do, when to do it, and how to avoid the mistakes that turn moving day into a
          bad day.
        </p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {guides.map((g) => (
            <Link
              key={g.slug}
              href={`/guides/${g.slug}`}
              className="block bg-white rounded-md overflow-hidden border border-border no-underline hover:shadow-raised transition-shadow p-6"
            >
              <div className="font-display font-semibold text-[16px] text-ink-800 mb-2">{g.title}</div>
              <p className="m-0 mb-3 text-sm leading-[1.6]">{g.summary}</p>
              <span className="text-sm font-display font-semibold text-teal-500">Read guide →</span>
            </Link>
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
