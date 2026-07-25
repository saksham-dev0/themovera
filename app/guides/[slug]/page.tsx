import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Nav } from "@/components/ui/Nav";
import { CTABand, Footer } from "@/components/ui/Footer";
import { guides, getGuide } from "@/app/guides/data";

export function generateStaticParams() {
  return guides.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const guide = getGuide(slug);
  if (!guide) return {};
  return {
    title: `${guide.title} | Movera Removals & Storage`,
    description: guide.summary,
  };
}

export default async function GuidePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const guide = getGuide(slug);
  if (!guide) notFound();

  return (
    <div className="bg-gray-50 font-sans text-ink-600">
      <Nav />

      <section className="max-w-[1180px] mx-auto px-8 pt-16 pb-10">
        <div className="text-xs font-display font-semibold tracking-[1.5px] uppercase text-ink-400 mb-6">
          Moving Guides
        </div>
        <h1 className="font-display font-bold text-5xl leading-[1.1] text-ink-800 m-0 mb-6 max-w-[720px]">
          {guide.title}
        </h1>
        <p className="text-[17px] leading-[1.65] max-w-[620px]">{guide.summary}</p>
      </section>

      <section className="bg-white">
        <div className="max-w-[820px] mx-auto px-8 py-16 grid gap-10">
          {guide.sections.map((s) => (
            <div key={s.heading}>
              <h2 className="font-display font-bold text-xl text-ink-800 m-0 mb-4">{s.heading}</h2>
              <div className="grid gap-3">
                {s.body.map((p) => (
                  <p key={p} className="m-0 text-[15px] leading-[1.7]">
                    {p}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="max-w-[1180px] mx-auto px-8 py-16">
        <CTABand />
      </div>

      <Footer />
    </div>
  );
}
