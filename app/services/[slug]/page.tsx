import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Nav } from "@/components/ui/Nav";
import { CTABand, Footer } from "@/components/ui/Footer";
import { services, getService } from "@/app/services/data";

const trustStrip = [
  "A genuine quote based on your move — no hourly meter, no surprises on the day.",
  "Trained, vetted moving teams — including trusted local partner crews.",
  "$80,000 goods-in-transit insurance on every move.",
];

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) return {};
  return {
    title: `${service.title} | Movera Removals & Storage`,
    description: service.tagline,
  };
}

export default async function ServicePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) notFound();

  return (
    <div className="bg-gray-50 font-sans text-ink-600">
      <Nav />

      {/* Hero */}
      <section className="max-w-[1180px] mx-auto px-8 pt-16 pb-10">
        <div className="text-xs font-display font-semibold tracking-[1.5px] uppercase text-ink-400 mb-6">
          Services / {service.title}
        </div>
        <h1 className="font-display font-bold text-5xl leading-[1.1] text-ink-800 m-0 mb-6 max-w-[720px]">
          {service.title}
        </h1>
        <p className="text-[17px] leading-[1.65] max-w-[620px] mb-8">{service.tagline}</p>
        <div className="flex flex-wrap items-center gap-4">
          <Button variant="secondary">☎ 02 8503 4444</Button>
          <Button variant="primary">Get My Free Quote →</Button>
        </div>
      </section>

      {/* Photo banner */}
      <section className="max-w-[1180px] mx-auto px-8 pb-16">
        <div className="relative rounded-md overflow-hidden border border-border shadow-raised h-[360px]">
          <Image src={service.image} alt={service.title} fill className="object-cover" priority />
          <div className="absolute bottom-5 left-5 bg-white/95 rounded-pill px-4 py-2 text-xs font-display font-semibold text-ink-800 flex items-center gap-2">
            <span className="w-2 h-2 rounded-pill bg-clay-500" />
            {service.caption}
          </div>
        </div>
      </section>

      {/* Description + features */}
      <section className="max-w-[1180px] mx-auto px-8 pb-16 grid lg:grid-cols-[1.15fr_0.85fr] gap-14 items-start">
        <div>
          <h2 className="font-display font-bold text-[24px] text-ink-800 m-0 mb-4">
            What&rsquo;s included
          </h2>
          <p className="text-[15px] leading-[1.75] mb-8 max-w-[600px]">{service.description}</p>
          <div className="flex flex-wrap gap-2.5">
            {service.idealFor.map((tag) => (
              <span
                key={tag}
                className="text-xs font-display font-semibold tracking-wide uppercase text-teal-500 bg-teal-100 rounded-pill px-3.5 py-1.5"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        <Card className="rounded-md p-8">
          <div className="font-display font-bold text-lg text-ink-800 mb-4">Service includes</div>
          <div className="grid gap-3">
            {service.features.map((item) => (
              <div key={item} className="flex items-start gap-3 text-sm text-ink-600">
                <span className="w-5 h-5 rounded-pill bg-teal-500 text-white grid place-items-center text-xs shrink-0 mt-0.5">
                  ✓
                </span>
                {item}
              </div>
            ))}
          </div>
        </Card>
      </section>

      {/* Trust strip */}
      <section className="bg-ink-900">
        <div className="max-w-[1180px] mx-auto px-8 py-14">
          <div className="text-xs font-display font-semibold tracking-[1.5px] uppercase text-teal-500 mb-5">
            Why move with Movera
          </div>
          <div className="grid sm:grid-cols-3 gap-6">
            {trustStrip.map((item) => (
              <div key={item} className="flex items-start gap-3 text-sm text-white/90">
                <span className="w-5 h-5 rounded-pill bg-teal-500 text-white grid place-items-center text-xs shrink-0 mt-0.5">
                  ✓
                </span>
                {item}
              </div>
            ))}
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
