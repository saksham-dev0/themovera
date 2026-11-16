import Link from "next/link";
import { Nav } from "@/components/ui/Nav";
import { Footer } from "@/components/ui/Footer";
import { services } from "@/app/services/data";
import { ClosingCtaBand, PageHero, Photo } from "@/components/content/ContentBlocks";
import { photos } from "@/components/content/images";

const metaTitle = "Removal Services Melbourne | Movera";
const metaDescription =
  "View Movera’s removal services in Melbourne, including local moves, office relocations, packing, furniture removals, specialty items and loading support.";

export const metadata = {
  title: metaTitle,
  description: metaDescription,
  alternates: { canonical: "/services" },
  openGraph: { title: metaTitle, description: metaDescription, url: "/services" },
};

export default function ServicesIndexPage() {
  return (
    <div className="bg-gray-50 font-sans text-ink-600">
      <Nav />

      <PageHero
        eyebrow="Services"
        title="Removal Services Melbourne"
        intro={[
          "Movera provides moving support for homes, apartments and businesses across Melbourne.",
          "Some customers need help with a full move, while others only need support with furniture, packing, loading or selected items. The service can be matched to what you actually need rather than using the same approach for every move.",
        ]}
        image={photos.houseStreet("Movera removalists moving a household in Melbourne")}
        ctaLabel="Request a Moving Quote"
      />

      {/* One row per service, alternating image side */}
      <div className="bg-white border-y border-border">
        {services.map((s, i) => (
          <section key={s.slug} className={i > 0 ? "border-t border-border" : ""}>
            <div className="max-w-[1180px] mx-auto px-5 sm:px-8 py-14 grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">
              <div className={i % 2 === 1 ? "lg:order-2" : ""}>
                <h2 className="font-display font-bold text-[26px] sm:text-[28px] leading-[1.2] text-ink-800 m-0 mb-5">
                  <Link href={`/services/${s.slug}`} className="text-inherit no-underline hover:text-teal-500">
                    {s.overview.heading}
                  </Link>
                </h2>
                {s.overview.body.map((p) => (
                  <p key={p} className="text-[15px] leading-[1.75] m-0 mb-4">
                    {p}
                  </p>
                ))}
                <Link
                  href={`/services/${s.slug}`}
                  className="inline-block mt-2 text-sm font-display font-semibold text-teal-500 no-underline hover:underline"
                >
                  {s.overview.linkLabel} →
                </Link>
              </div>
              <Link href={`/services/${s.slug}`} className={`block ${i % 2 === 1 ? "lg:order-1" : ""}`}>
                <Photo image={s.overview.image} />
              </Link>
            </div>
          </section>
        ))}
      </div>

      <section className="max-w-[1180px] mx-auto px-5 sm:px-8 py-16">
        <div className="max-w-[760px]">
          <h2 className="font-display font-bold text-[26px] sm:text-[28px] leading-[1.2] text-ink-800 m-0 mb-5">
            Moving Across Melbourne
          </h2>
          <p className="text-[15px] leading-[1.75] m-0 mb-4">
            Movera works with customers moving around Melbourne, including areas such as Melbourne CBD, South
            Melbourne, Port Melbourne, Richmond, South Yarra, Fitzroy, Carlton, Preston, Reservoir, Box Hill and
            Doncaster.
          </p>
          <p className="text-[15px] leading-[1.75] m-0">
            The details of each move can vary depending on the property, access, parking and what needs to be
            transported.
          </p>
        </div>
      </section>

      <ClosingCtaBand
        cta={{
          heading: "Not Sure Which Service You Need?",
          body: [
            "Send Movera the details of your move, including the two locations, property type and the main items involved.",
            "We can then help identify which service best fits the job.",
          ],
          label: "Request a Moving Quote",
        }}
      />

      <Footer />
    </div>
  );
}
