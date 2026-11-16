import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { Nav } from "@/components/ui/Nav";
import { Footer } from "@/components/ui/Footer";
import { services, getService } from "@/app/services/data";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema, serviceSchema } from "@/lib/schema";
import { ClosingCtaBand, ContentSections, PageHero } from "@/components/content/ContentBlocks";

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
  const url = `/services/${slug}`;
  return {
    title: service.metaTitle,
    description: service.metaDescription,
    alternates: { canonical: url },
    openGraph: { title: service.metaTitle, description: service.metaDescription, url },
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
      <JsonLd
        data={[
          serviceSchema({
            name: service.h1,
            description: service.metaDescription,
            path: `/services/${slug}`,
          }),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Services", path: "/services" },
            { name: service.title, path: `/services/${slug}` },
          ]),
        ]}
      />
      <Nav />

      <PageHero
        eyebrow={
          <>
            <Link href="/services" className="text-ink-400 no-underline hover:text-teal-500">
              Services
            </Link>{" "}
            / {service.title}
          </>
        }
        title={service.h1}
        intro={service.intro}
        image={service.heroImage}
        ctaLabel={service.cta.label}
      />

      <ContentSections blocks={service.sections} />

      <ClosingCtaBand cta={service.cta} />

      <Footer />
    </div>
  );
}
