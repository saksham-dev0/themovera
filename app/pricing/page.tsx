import { Nav } from "@/components/ui/Nav";
import { Footer } from "@/components/ui/Footer";
import { ClosingCtaBand, ContentSections, PageHero, type Block } from "@/components/content/ContentBlocks";
import { photos } from "@/components/content/images";

const metaTitle = "Removalists Melbourne Cost | Movera Pricing";
const metaDescription =
  "See what can affect removalist costs in Melbourne, including property access, furniture, travel, packing and moving requirements. Request a quote from Movera.";

export const metadata = {
  title: metaTitle,
  description: metaDescription,
  alternates: { canonical: "/pricing" },
  openGraph: { title: metaTitle, description: metaDescription, url: "/pricing" },
};

const sections: Block[] = [
  {
    heading: "What Can Affect the Cost of a Move?",
    body: ["Several parts of the move can affect the final price.", "These can include:"],
    list: [
      "Pickup and delivery suburbs",
      "Property type",
      "Amount of furniture and boxes",
      "Stairs or lift access",
      "Parking distance",
      "Larger or heavier items",
      "Time needed for loading and unloading",
      "Packing or unpacking support",
      "Office or commercial moving requirements",
    ],
    after: ["Providing accurate information helps give a clearer picture of the work involved."],
  },
  {
    heading: "House and Apartment Moving Costs",
    body: [
      "House and apartment moves can have very different requirements.",
      "A house with easy driveway access may allow furniture to be moved directly between the property and vehicle. An apartment in Melbourne CBD, Richmond or South Yarra may involve lift bookings, loading areas or longer carrying distances.",
      "These differences can affect the time required even when the number of items is similar.",
    ],
    image: photos.houseStreet("House move in Melbourne with direct street access"),
  },
  {
    heading: "Furniture and Specialty Items",
    body: ["Larger items may need more preparation and handling than standard boxes.", "This can include:"],
    list: ["Sofas", "Wardrobes", "Dining tables", "Large appliances", "Pianos", "Pool tables", "Gym equipment"],
    listStyle: "chips",
    after: ["If the move includes an unusually large or heavy item, mention it when requesting the quote."],
    image: photos.furniture("Removalists carrying large furniture"),
    links: [
      { label: "Furniture Removals", href: "/services/furniture-removals" },
      { label: "Specialty Item Removals", href: "/services/specialty-item-removals" },
    ],
  },
  {
    heading: "Packing and Other Moving Support",
    body: [
      "The final cost may also depend on whether you need additional help beyond transport.",
      "Movera provides services such as:",
    ],
    list: [
      "Packing and unpacking",
      "Furniture removals",
      "Specialty item removals",
      "Loading and unloading",
      "Office and commercial relocations",
    ],
    after: ["These can be discussed based on what is required for your move."],
    links: [
      { label: "Packing & Unpacking", href: "/services/packing-unpacking" },
      { label: "Loading & Unloading", href: "/services/loading-unloading" },
      { label: "Office & Commercial Relocations", href: "/services/office-commercial-relocations" },
    ],
  },
  {
    heading: "Getting a Moving Quote",
    body: ["When requesting a quote, it helps to share:"],
    list: [
      "Moving date",
      "Pickup suburb",
      "Delivery suburb",
      "Property type",
      "Main furniture items",
      "Approximate number of boxes",
      "Access details",
      "Any special items",
      "Extra services you may need",
    ],
    after: ["This gives Movera enough information to understand the move before pricing it."],
  },
];

export default function PricingPage() {
  return (
    <div className="bg-gray-50 font-sans text-ink-600">
      <Nav />

      <PageHero
        eyebrow="Pricing"
        title="Removalists Melbourne Cost"
        intro={[
          "The cost of a move can vary depending on the property, the amount being moved and the access at both locations.",
          "A short move between two Melbourne suburbs may still take more time if there are stairs, limited parking or a larger amount of furniture. A longer move may be easier to manage if both properties have direct access.",
          "Movera looks at the details of the job before providing a moving quote.",
        ]}
        image={photos.fleet("Movera removal trucks in Melbourne")}
        ctaLabel="Request a Moving Quote"
      />

      <ContentSections blocks={sections} />

      <ClosingCtaBand
        cta={{
          heading: "Looking for a Removalist Quote in Melbourne?",
          body: ["Send Movera the details of your move and the services you need."],
          label: "Request a Moving Quote",
        }}
      />

      <Footer />
    </div>
  );
}
