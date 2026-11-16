import { Nav } from "@/components/ui/Nav";
import { Footer } from "@/components/ui/Footer";
import { ClosingCtaBand, ContentSections, PageHero, type Block } from "@/components/content/ContentBlocks";
import { photos } from "@/components/content/images";

const metaTitle = "About Movera | Melbourne Removalists";
const metaDescription =
  "Learn more about Movera and its removal services across Melbourne for homes, apartments, offices, furniture, packing and specialty items.";

export const metadata = {
  title: metaTitle,
  description: metaDescription,
  alternates: { canonical: "/about" },
  openGraph: { title: metaTitle, description: metaDescription, url: "/about" },
};

const sections: Block[] = [
  {
    heading: "Moving Support Across Melbourne",
    body: [
      "Movera works with customers in Melbourne and nearby suburbs.",
      "This includes areas such as Melbourne CBD, South Melbourne, Port Melbourne, Richmond, South Yarra, Fitzroy, Carlton, Preston, Reservoir, Box Hill and Doncaster.",
      "Different parts of Melbourne can bring different moving challenges. Central areas may involve limited parking or building access, while larger suburban properties may involve more furniture and longer carrying distances.",
    ],
    image: photos.houseStreet("Movera removalists moving a household in a Melbourne suburb"),
  },
  {
    heading: "Services for Different Types of Moves",
    body: ["Movera supports a range of moving needs, including:"],
    list: [
      "Local house and apartment moves",
      "Office and commercial relocations",
      "Packing and unpacking",
      "Furniture removals",
      "Specialty item removals",
      "Loading and unloading",
    ],
    after: ["Customers may need one service or a combination depending on the move."],
    links: [
      { label: "Local Removals", href: "/services/local-removals" },
      { label: "Office & Commercial Relocations", href: "/services/office-commercial-relocations" },
      { label: "Packing & Unpacking", href: "/services/packing-unpacking" },
      { label: "Furniture Removals", href: "/services/furniture-removals" },
      { label: "Specialty Item Removals", href: "/services/specialty-item-removals" },
      { label: "Loading & Unloading", href: "/services/loading-unloading" },
    ],
  },
  {
    heading: "Planning Around the Property",
    body: [
      "The layout of the property can affect how a move is handled.",
      "Stairs, lifts, parking, loading areas and narrow entrances can all change how much planning is required.",
      "Before the move, it helps to share these details so the job can be arranged around the actual property rather than only the distance between addresses.",
    ],
    image: photos.loading("Movera crew planning and loading a move"),
  },
  {
    heading: "A Practical Approach to Moving",
    body: [
      "Movera focuses on understanding what needs to be moved before the job begins.",
      "For some customers, that may mean moving most of a household. For others, it may only involve selected furniture, office equipment or a few larger items.",
      "Providing clear information about the property and belongings helps make the move easier to plan.",
    ],
  },
];

export default function AboutPage() {
  return (
    <div className="bg-gray-50 font-sans text-ink-600">
      <Nav />

      <PageHero
        eyebrow="About Movera"
        title="About Movera"
        intro={[
          "Movera provides removal services for homes, apartments and businesses across Melbourne.",
          "The work can range from a local house move to an office relocation, furniture-only job, packing support or moving larger specialty items. The service is based around the details of each job, including the property, access and what needs to be moved.",
        ]}
        image={photos.team("The Movera removals team in Melbourne")}
        ctaLabel="Request a Moving Quote"
      />

      <ContentSections blocks={sections} />

      <ClosingCtaBand
        cta={{
          heading: "Need Help With a Move in Melbourne?",
          body: [
            "If you are planning a move, send Movera the pickup location, delivery location, preferred date and an idea of what needs to be moved.",
          ],
          label: "Request a Moving Quote",
        }}
      />

      <Footer />
    </div>
  );
}
