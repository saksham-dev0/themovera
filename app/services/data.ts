export type Service = {
  slug: string;
  title: string;
  tagline: string;
  description: string;
  features: string[];
  idealFor: string[];
  image: string;
  caption: string;
};

export const services: Service[] = [
  {
    slug: "local-removals",
    image: "/House.png",
    caption: "Local move · packed and loaded with care",
    title: "Local Removals",
    tagline: "Across the street or across the city — simple, efficient, stress-free.",
    description:
      "Whether you're moving across the street or to the other side of the city, our local removals service is designed to make the process simple, efficient, and stress-free. From apartments and family homes to townhouses and units, our experienced movers handle every move with professionalism and care. We carefully plan each relocation, protect your furniture during transport, and ensure every item arrives safely at its new destination.",
    features: [
      "Careful move planning tailored to your property type",
      "Furniture wrapping and protection as standard",
      "Experienced crews for apartments, houses, townhouses and units",
      "Safe, damage-free transport door to door",
    ],
    idealFor: ["Apartments", "Family homes", "Townhouses", "Units"],
  },
  {
    slug: "office-commercial-relocations",
    image: "/office_removal.png",
    caption: "Office fit-out relocated after-hours",
    title: "Office & Commercial Relocations",
    tagline: "Efficient business moves that keep downtime to a minimum.",
    description:
      "We help businesses relocate efficiently while minimising downtime. Whether it's an office, retail space, or commercial premises, we carefully move furniture, equipment, and workspaces with an organised approach to keep business disruption to a minimum.",
    features: [
      "Organised, scheduled moves built around your business hours",
      "Careful handling of furniture, equipment and workstations",
      "Suited to offices, retail spaces and commercial premises",
      "Minimal disruption to day-to-day operations",
    ],
    idealFor: ["Offices", "Retail spaces", "Commercial premises"],
  },
  {
    slug: "packing-unpacking",
    image: "/movera_storage.png",
    caption: "Boxes, wrap and materials ready to go",
    title: "Packing & Unpacking",
    tagline: "Quality materials, proven technique, everything secured for transport.",
    description:
      "Our professional packing and unpacking service helps protect belongings using quality packing materials and proven techniques. Whether customers need a complete packing service or assistance with fragile items, we ensure everything is securely prepared for transport.",
    features: [
      "Full or partial packing services to suit your needs",
      "Quality packing materials included",
      "Specialist care for fragile and valuable items",
      "Unpacking support at your new destination",
    ],
    idealFor: ["Full-service packing", "Fragile items", "Time-poor movers"],
  },
  {
    slug: "furniture-removals",
    image: "/House_removalist.png",
    caption: "Furniture wrapped and carried with care",
    title: "Furniture Removals",
    tagline: "Everyday and oversized pieces, moved without the worry.",
    description:
      "From everyday household furniture to oversized or delicate pieces, we move every item with care using professional equipment, protective wrapping, and safe handling techniques to minimise the risk of damage.",
    features: [
      "Professional equipment for heavy and oversized items",
      "Protective wrapping on every piece",
      "Safe handling techniques to minimise damage risk",
      "Experience with delicate and awkward-shaped furniture",
    ],
    idealFor: ["Household furniture", "Oversized pieces", "Delicate items"],
  },
  {
    slug: "specialty-item-removals",
    image: "/movera.jpeg",
    caption: "Specialty items handled with purpose-built care",
    title: "Specialty Item Removals",
    tagline: "Extra care for the items that can't be replaced.",
    description:
      "We safely transport items that require extra care, including pianos, artwork, mirrors, antiques, large televisions, gym equipment, pool tables, and other fragile or valuable belongings.",
    features: [
      "Pianos, artwork and mirrors handled by experienced crews",
      "Antiques and valuables given specialist attention",
      "Large TVs, gym equipment and pool tables safely transported",
      "Purpose-built equipment for fragile and heavy specialty items",
    ],
    idealFor: ["Pianos", "Artwork & antiques", "Pool tables", "Gym equipment"],
  },
  {
    slug: "loading-unloading",
    image: "/house_removal2.png",
    caption: "Loading crew maximising every truck",
    title: "Loading & Unloading Services",
    tagline: "Labour-only support for your own truck, trailer or container.",
    description:
      "For customers hiring their own truck, trailer, or shipping container, we provide labour-only moving services, including professional loading and unloading to maximise space, secure items properly, and reduce the risk of damage during transport.",
    features: [
      "Labour-only loading and unloading",
      "Space maximised inside your truck, trailer or container",
      "Items properly secured for transit",
      "Reduced risk of damage from improper loading",
    ],
    idealFor: ["Self-hired trucks", "Trailers", "Shipping containers"],
  },
];

export function getService(slug: string): Service | undefined {
  return services.find((s) => s.slug === slug);
}
