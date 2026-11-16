import Link from "next/link";
import { Nav } from "@/components/ui/Nav";
import { Footer } from "@/components/ui/Footer";
import { guides } from "@/app/guides/data";
import { ClosingCtaBand, ContentSections, PageHero, type Block } from "@/components/content/ContentBlocks";
import { photos } from "@/components/content/images";

const metaTitle = "Moving Guides Melbourne | Movera";
const metaDescription =
  "Read practical moving guides from Movera covering packing, house moves, apartments, office relocations and planning a move across Melbourne.";

export const metadata = {
  title: metaTitle,
  description: metaDescription,
  alternates: { canonical: "/guides" },
  openGraph: { title: metaTitle, description: metaDescription, url: "/guides" },
};

const sections: Block[] = [
  {
    heading: "Guides for Different Types of Moves",
    body: [
      "A house move does not need the same preparation as an apartment or office relocation.",
      "Apartment moves may involve lift bookings and building access, while office moves may need more planning around workstations, equipment and business hours.",
      "By keeping the advice grouped around different moving situations, it is easier to find information that matches your own move.",
    ],
    image: photos.packing("Boxes and packing materials prepared before moving day"),
  },
  {
    heading: "Melbourne Moving Advice",
    body: [
      "Moving around Melbourne can also involve local issues such as busy streets, parking limits, apartment access and different property layouts.",
      "Our guides can include practical advice for customers moving in areas such as Melbourne CBD, Richmond, South Yarra, Carlton, Reservoir, Doncaster and other Melbourne suburbs.",
    ],
    image: photos.houseStreet("Moving day on a Melbourne street"),
  },
];

export default function GuidesIndexPage() {
  return (
    <div className="bg-gray-50 font-sans text-ink-600">
      <Nav />

      <PageHero
        eyebrow="Moving Guides"
        title="Moving Guides"
        intro={[
          "Planning a move usually brings a lot of small questions.",
          "When should you start packing? What should be ready before the movers arrive? How do apartment lift bookings work? What details should you have ready before requesting a moving quote?",
          "The Movera guides are designed to answer practical questions like these and help customers prepare before moving day.",
        ]}
        ctaLabel="View Removal Services"
        ctaHref="/services"
      />

      <section className="bg-white border-y border-border">
        <div className="max-w-[1180px] mx-auto px-5 sm:px-8 py-14 sm:py-16">
          <h2 className="font-display font-bold text-[26px] sm:text-[28px] leading-[1.2] text-ink-800 m-0 mb-5">
            Helpful Information Before You Move
          </h2>
          <p className="text-[15px] leading-[1.75] m-0 mb-8 max-w-[760px]">
            Our moving guides can cover topics such as:
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {guides.map((g) => (
              <Link
                key={g.slug}
                href={`/guides/${g.slug}`}
                className="block bg-gray-50 rounded-md border border-border no-underline hover:shadow-raised transition-shadow p-6"
              >
                <h3 className="font-display font-semibold text-[17px] text-ink-800 m-0 mb-2">{g.title}</h3>
                <p className="m-0 mb-3 text-sm leading-[1.6] text-ink-600">{g.summary}</p>
                <span className="text-sm font-display font-semibold text-teal-500">Read guide →</span>
              </Link>
            ))}
          </div>
          <p className="text-[15px] leading-[1.75] m-0 max-w-[760px]">
            The guides are meant to give practical answers you can use while planning the move, not just general
            moving advice.
          </p>
        </div>
      </section>

      {/* Start at 1 so the first section is untinted after the white guide list */}
      <ContentSections blocks={sections} startIndex={1} />

      <ClosingCtaBand
        cta={{
          heading: "Looking for Help With a Move?",
          body: [
            "If you have already planned your move and need help with transport, furniture, packing or loading, you can also view Movera’s removal services.",
          ],
          label: "View Removal Services",
          href: "/services",
        }}
      />

      <Footer />
    </div>
  );
}
