import Image from "next/image";
import Link from "next/link";
import { IconTile } from "@/components/ui/Card";
import { Nav } from "@/components/ui/Nav";
import { CTABand, Footer } from "@/components/ui/Footer";
import { services } from "@/app/services/data";

export const metadata = {
  title: "Our Services | Movera Removals & Storage",
  description: "Every type of move, handled by our own trained crew.",
};

export default function ServicesIndexPage() {
  return (
    <div className="bg-gray-50 font-sans text-ink-600">
      <Nav />

      <section className="max-w-[1180px] mx-auto px-8 pt-16 pb-16">
        <div className="text-xs font-display font-semibold tracking-[1.5px] uppercase text-ink-400 mb-3">
          Services
        </div>
        <h1 className="font-display font-bold text-5xl leading-[1.1] text-ink-800 m-0 mb-6 max-w-[720px]">
          Removalist Services — Every Move, Handled
        </h1>
        <p className="text-[17px] leading-[1.65] max-w-[620px] mb-10">
          Home, office, or specialty item — our trained crews handle every part of your move with the same
          genuine, work-based quote and no-surprises approach.
        </p>

        <div className="relative rounded-md overflow-hidden border border-border shadow-raised h-[300px] mb-12">
          <Image src="/movera.jpeg" alt="Movera crew moving furniture" fill className="object-cover" priority />
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((s) => (
            <Link
              key={s.slug}
              href={`/services/${s.slug}`}
              className="block bg-white rounded-md overflow-hidden border border-border no-underline hover:shadow-raised transition-shadow"
            >
              <div className="relative h-[160px]">
                <Image src={s.image} alt={s.title} fill className="object-cover" />
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

      <div className="max-w-[1180px] mx-auto px-8 pb-16">
        <CTABand />
      </div>

      <Footer />
    </div>
  );
}
