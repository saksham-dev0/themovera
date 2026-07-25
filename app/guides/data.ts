export type GuideSection = {
  heading: string;
  body: string[];
};

export type Guide = {
  slug: string;
  title: string;
  summary: string;
  sections: GuideSection[];
};

export const guides: Guide[] = [
  {
    slug: "moving-checklist",
    title: "The Complete Moving Checklist",
    summary: "What to do 6 weeks out, moving week, and on the day — so nothing gets left behind.",
    sections: [
      {
        heading: "6-8 weeks before",
        body: [
          "Book your removalist and lock in your date — good crews get booked out, especially on weekends and end-of-month.",
          "Start sorting what you're keeping, donating, and throwing out. Every box you don't pack is a box you don't have to carry.",
          "If you're changing suburbs or states, start a list of who needs your new address: banks, subscriptions, registrations.",
        ],
      },
      {
        heading: "2-3 weeks before",
        body: [
          "Begin packing non-essential rooms first — spare rooms, garages, out-of-season clothing.",
          "Label every box with its destination room, not just its contents. It makes unpacking day dramatically faster.",
          "Confirm parking, lift access or stair count with your removalist so moving day has no surprises.",
        ],
      },
      {
        heading: "Moving week",
        body: [
          "Pack an essentials box — toiletries, chargers, medication, a change of clothes — and keep it with you, not on the truck.",
          "Defrost the fridge and freezer the night before if it's coming with you.",
          "Confirm arrival time and any access details with your crew the day before.",
        ],
      },
      {
        heading: "On the day",
        body: [
          "Do a final walkthrough of every room, including cupboards, before the truck leaves.",
          "Keep valuables and important documents with you rather than on the truck.",
          "At the new place, direct the crew room by room using your box labels — this is where the labelling pays off.",
        ],
      },
    ],
  },
  {
    slug: "packing-tips",
    title: "Packing Tips That Actually Prevent Damage",
    summary: "How to pack fragile items, furniture, and everyday boxes so nothing arrives broken.",
    sections: [
      {
        heading: "Start with the right materials",
        body: [
          "Use proper packing paper for fragile items, not just newspaper — ink transfer aside, newspaper offers less cushioning.",
          "Double-wall boxes for anything heavy (books, tools); standard boxes are fine for lightweight items like linen or clothing.",
          "Bubble wrap and furniture blankets for anything with a polished or delicate surface.",
        ],
      },
      {
        heading: "Fragile and valuable items",
        body: [
          "Wrap plates individually and pack them on their edge, not flat — flat-stacked plates crack far more easily under weight.",
          "Fill every gap in a box of fragile items. Movement inside the box is what causes breakage, not the move itself.",
          "For pianos, artwork, mirrors and antiques, specialist handling and equipment matter more than extra padding — this is where a professional removalist earns their fee.",
        ],
      },
      {
        heading: "Furniture",
        body: [
          "Disassemble what you can — bed frames, table legs — and keep the hardware in a labelled bag taped to the item.",
          "Wrap corners and edges of wooden furniture; corners take the brunt of bumps during loading.",
          "Protect fabric upholstery from dust and scuffs with shrink wrap or moving blankets, not plastic bags that trap moisture.",
        ],
      },
      {
        heading: "Boxing basics",
        body: [
          "Heavy items (books) in small boxes, light items (linen, pillows) in large boxes — keeps every box liftable.",
          "Tape the bottom of every box in an H-pattern, not just a straight line, so it doesn't give way under weight.",
          "Label every box with contents and destination room on at least two sides, so it's readable from any angle in the truck.",
        ],
      },
    ],
  },
  {
    slug: "choosing-a-removalist",
    title: "How to Choose a Removalist You Can Trust",
    summary: "The questions to ask before you book, and the red flags that mean you shouldn't.",
    sections: [
      {
        heading: "Ask about pricing upfront",
        body: [
          "Fixed price or hourly? Hourly quotes can look cheaper but run over on the day — ask what happens if the job takes longer than estimated.",
          "Is the quote based on an actual assessment of your move, or a guess over the phone? A real assessment of volume, distance and access is what makes a fixed price reliable.",
          "Are there depot-to-depot charges, callout fees, or fuel surcharges added after the quote? Ask for this in writing.",
        ],
      },
      {
        heading: "Ask who's actually doing the move",
        body: [
          "Comparison sites collect your details and sell them to whichever mover bids lowest — you often don't know who's turning up until the day.",
          "Ask directly: is this your own crew, or a subcontractor? Consistency in training and accountability usually comes from a company that employs its own movers.",
          "Ask what insurance covers your belongings in transit, and get the coverage amount in writing.",
        ],
      },
      {
        heading: "Red flags to watch for",
        body: [
          "A quote given with no questions about volume, access, or distance.",
          "No fixed address or ABN listed anywhere on the company's site.",
          "Reluctance to confirm crew details, insurance cover, or cancellation policy in writing.",
        ],
      },
      {
        heading: "What good looks like",
        body: [
          "A dedicated coordinator who plans your move — access timing, parking, stairs — before the day arrives.",
          "A fixed price confirmed in writing before your move, with no hidden extras.",
          "Trained, background-checked movers who are employees, not subcontractors picked up for the day.",
        ],
      },
    ],
  },
];

export function getGuide(slug: string): Guide | undefined {
  return guides.find((g) => g.slug === slug);
}
