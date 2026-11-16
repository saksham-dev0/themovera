import type { Block, ClosingCta } from "@/components/content/ContentBlocks";
import { photos, type Img } from "@/components/content/images";

export type Service = {
  slug: string;
  /** Short name used in nav, footer and cards. */
  title: string;
  /** One-liner used on the homepage service cards. */
  tagline: string;
  /** Card image. */
  image: string;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  intro: string[];
  heroImage: Img;
  sections: Block[];
  cta: ClosingCta;
  /** Copy for this service on the /services overview page. */
  overview: { heading: string; body: string[]; linkLabel: string; image: Img };
};

const link = (slug: string, label: string) => ({ label, href: `/services/${slug}` });

export const services: Service[] = [
  // ───────────────────────────── Local Removals ─────────────────────────────
  {
    slug: "local-removals",
    title: "Local Removalists",
    tagline: "Across the street or across the city — simple, efficient, stress-free.",
    image: "/House.png",
    metaTitle: "Local Removalists Melbourne | Movera",
    metaDescription:
      "Movera provides local removal services across Melbourne for houses and apartments, with help for furniture, access planning, packing and transport.",
    h1: "Local Removalists Melbourne",
    intro: [
      "Moving within Melbourne can look very different depending on where you live and what needs to be moved.",
      "A house move in Doncaster or Reservoir may involve more furniture but easier access for the moving vehicle. An apartment move in South Yarra, Richmond or Melbourne CBD may need more planning around lifts, loading areas and street parking.",
      "Movera helps with local house and apartment moves across Melbourne. We can assist with furniture, boxes and larger household items, while planning the move around the access available at both properties.",
    ],
    heroImage: photos.house("Movera removalists loading a truck outside a Melbourne home"),
    sections: [
      {
        heading: "House and Apartment Moves Across Melbourne",
        body: [
          "Local removals can include full household moves, apartment moves or smaller jobs where only selected items need to be transported.",
          "A house move may involve beds, sofas, dining tables, wardrobes, appliances, boxes and outdoor furniture. Apartment moves can involve the same items, but the way they are moved may be different because of lifts, shared entrances or limited parking.",
          "Before the move, it helps to know what kind of property you are leaving and moving into. This allows the job to be planned around the actual access rather than treating every move in the same way.",
        ],
        image: photos.houseStreet("Movera team moving boxes and furniture from a Melbourne terrace house"),
      },
      {
        heading: "Moving Around Melbourne Suburbs",
        body: [
          "Movera provides local moving support across Melbourne and nearby suburbs.",
          "This can include moves around areas such as:",
        ],
        list: [
          "Melbourne CBD",
          "South Melbourne",
          "Port Melbourne",
          "Richmond",
          "South Yarra",
          "Fitzroy",
          "Carlton",
          "Preston",
          "Reservoir",
          "Box Hill",
          "Doncaster",
        ],
        listStyle: "chips",
        after: [
          "A move between two nearby suburbs may involve less travel, but the time needed at each property still depends on access, furniture and the amount being moved.",
        ],
      },
      {
        heading: "When Access Needs More Planning",
        body: [
          "Property access can have a big effect on how a local move is handled.",
          "For example, an apartment building may have a lift that needs to be booked before furniture can be moved. Some buildings may also have a loading area or set times for moving large items.",
          "Other properties may have:",
        ],
        list: [
          "Narrow entrances",
          "Stairs",
          "Limited street parking",
          "Long walking distance between the property and vehicle",
          "Basement access",
          "Large furniture that is difficult to carry through doorways",
        ],
        after: ["If any of these apply to your move, it is useful to mention them before the booking is confirmed."],
      },
      {
        heading: "Furniture and Larger Household Items",
        body: [
          "Large furniture often needs more planning than boxes and smaller belongings.",
          "Sofas, wardrobes, dining tables and larger appliances can take more space in the vehicle and may be harder to move through narrow areas.",
          "If you have a large or heavy item, let Movera know when requesting a quote. This gives a clearer picture of what needs to be moved and how the team should prepare for the job.",
          "For more specific furniture moves, Movera also provides a separate furniture removal service.",
        ],
        image: photos.furniture("Removalists carrying wrapped furniture to a moving truck"),
        links: [link("furniture-removals", "Furniture Removals")],
      },
      {
        heading: "Need Packing Help as Part of Your Move?",
        body: [
          "Some customers prefer to pack everything themselves, while others need help preparing part or all of the household.",
          "Movera also offers packing and unpacking services for customers who want support before or after the move.",
          "This can be useful when:",
        ],
        list: [
          "There is limited time before the moving date",
          "A larger number of boxes need to be prepared",
          "Fragile items need extra care",
          "Help is needed after arriving at the new property",
        ],
        after: ["Packing support can be discussed separately based on what you need."],
        image: photos.packing("Packing boxes and wrapping materials prepared for a move"),
        links: [link("packing-unpacking", "Packing & Unpacking")],
      },
      {
        heading: "What Information Helps With a Local Moving Quote?",
        body: ["When requesting a quote, try to provide:"],
        list: [
          "Pickup suburb",
          "Delivery suburb",
          "Type of property",
          "Preferred moving date",
          "Approximate amount of furniture and boxes",
          "Stairs or lift access",
          "Parking or loading restrictions",
          "Any large or heavy items",
        ],
        after: ["Clear information makes it easier to understand the job before the move is booked."],
      },
    ],
    cta: {
      heading: "Moving Within Melbourne?",
      body: [
        "If you are planning a house or apartment move in Melbourne, send Movera the details of your move and what needs to be transported.",
      ],
      label: "Request a Moving Quote",
    },
    overview: {
      heading: "Local Removals",
      body: [
        "Moving between Melbourne suburbs can still involve a lot of planning, especially when the properties have different access.",
        "Movera helps with house and apartment moves, including furniture, boxes and larger household items.",
      ],
      linkLabel: "Local Removals",
      image: photos.house("Local house move in Melbourne"),
    },
  },

  // ───────────────────────── Office & Commercial ─────────────────────────
  {
    slug: "office-commercial-relocations",
    title: "Office & Commercial Relocations",
    tagline: "Efficient business moves that keep downtime to a minimum.",
    image: "/office_removal.png",
    metaTitle: "Office Removalists Melbourne | Commercial Relocations",
    metaDescription:
      "Movera helps Melbourne businesses move offices and commercial spaces, including furniture, equipment, access planning, packing and transport between locations.",
    h1: "Office Removalists Melbourne",
    intro: [
      "Relocating a workplace involves more than transporting office furniture between two buildings.",
      "A business may need to keep staff working until late in the day, clear one floor before another, book a service lift, manage parking or make sure important equipment reaches the new site in the right order.",
      "Movera helps businesses with office and commercial relocations across Melbourne. Before anything is scheduled, Movera can look at the layout of both sites, access conditions and the furniture or equipment included in the relocation.",
    ],
    heroImage: photos.office("Movera crew relocating office furniture and equipment"),
    sections: [
      {
        heading: "Office Moves Across Melbourne",
        body: [
          "The amount of work involved can change significantly from one business location to another.",
          "A small office in Richmond may only have a few workstations and filing cabinets. A larger commercial space in Melbourne CBD may involve several rooms, shared access and more equipment to organise.",
          "Office relocations may include:",
        ],
        list: [
          "Desks and workstations",
          "Office chairs",
          "Meeting tables",
          "Filing cabinets",
          "Shelving",
          "Reception furniture",
          "Computers and monitors",
          "Printers",
          "Kitchen items",
          "General office storage",
        ],
        after: ["The amount and type of furniture helps determine how the move should be planned."],
      },
      {
        heading: "Access at Commercial Buildings",
        body: [
          "Commercial buildings often have rules that need to be checked before moving day.",
          "Some offices use service lifts rather than passenger lifts. Others have loading bays that need to be booked in advance or only allow moving work during certain hours.",
          "Before the relocation, it helps to confirm:",
        ],
        list: [
          "Building access times",
          "Service lift availability",
          "Loading bay access",
          "Parking restrictions",
          "Floor level",
          "Stairs",
          "Entry points for larger furniture",
          "Any building management requirements",
        ],
        after: [
          "These details become particularly important in central Melbourne locations, where the vehicle may not be able to stop directly outside the building.",
        ],
      },
      {
        heading: "Moving Office Furniture and Equipment",
        body: [
          "Office furniture can take up a large amount of space, especially when several desks, cabinets and storage units are being moved together.",
          "It is useful to identify which items are staying, which are moving and whether any furniture is unusually large.",
          "Equipment such as computers, screens and printers should also be grouped clearly so they can be handled separately from general furniture.",
          "If the business has larger or heavier items, let Movera know before the move is booked.",
        ],
        image: photos.fleet("Movera removal trucks ready for a commercial relocation"),
      },
      {
        heading: "Keeping the Office Move Organised",
        body: [
          "The order in which items are moved can matter.",
          "For example, some businesses may want workstations or essential equipment delivered first so staff can return sooner. Others may prefer furniture to be moved by room or department.",
          "Before the move, it can help to decide:",
        ],
        list: [
          "Which area should be cleared first",
          "Which items staff still need access to",
          "What should arrive first at the new office",
          "Who will be available at both addresses",
          "Whether the move will happen in one stage or more than one",
        ],
        after: ["A clear order can make the relocation easier to manage at both locations."],
      },
      {
        heading: "Packing Support for Office Relocations",
        body: [
          "Office packing can involve more than placing files into boxes.",
          "Shared storage, stationery, kitchen items, equipment and smaller office contents may all need to be sorted before the move.",
          "Movera also provides packing and unpacking support for businesses that need help preparing for the relocation.",
          "Labelling boxes by department, room or function can make it easier to place items correctly at the new workplace.",
        ],
        image: photos.packingWarehouse("Movera team packing and labelling boxes"),
        links: [link("packing-unpacking", "Packing & Unpacking")],
      },
      {
        heading: "What Information Is Useful for a Quote?",
        body: ["When asking for an office moving quote, it helps to provide:"],
        list: [
          "Current suburb",
          "New suburb",
          "Moving date",
          "Approximate office size",
          "Number of workstations",
          "Main furniture items",
          "Lift or stair access",
          "Loading or parking restrictions",
          "Larger equipment",
          "Any fixed building access times",
        ],
        after: [
          "The more accurate the information is, the easier it is to understand what the relocation will involve.",
        ],
      },
      {
        heading: "Commercial Relocations Across Melbourne",
        body: [
          "Movera helps businesses move between office and commercial locations across Melbourne.",
          "Whether the business is changing suburbs, moving to a larger office or relocating to another building, the move can be planned around the workplace and access at both sites.",
        ],
      },
    ],
    cta: {
      heading: "Planning an Office Relocation?",
      body: ["Send Movera the details of the current workplace, new location and the main items that need to be moved."],
      label: "Request an Office Moving Quote",
    },
    overview: {
      heading: "Office & Commercial Relocations",
      body: [
        "Business moves often need more coordination because staff, equipment, furniture and building access all need to be considered.",
        "Movera can help with office and commercial relocations across Melbourne, including workstations, cabinets, equipment and general office contents.",
      ],
      linkLabel: "Office & Commercial Relocations",
      image: photos.office("Office relocation in Melbourne"),
    },
  },

  // ─────────────────────────── Packing & Unpacking ───────────────────────────
  {
    slug: "packing-unpacking",
    title: "Packing & Unpacking",
    tagline: "Quality materials, proven technique, everything secured for transport.",
    image: "/Packing.png",
    metaTitle: "Packing and Moving Services Melbourne | Movera",
    metaDescription:
      "Movera provides packing and unpacking services in Melbourne for house, apartment and office moves, with help preparing boxes and household items.",
    h1: "Packing and Moving Services Melbourne",
    intro: [
      "Packing can take almost as much time as the move itself.",
      "Some people only need help with fragile items or a few rooms. Others want support packing most of the property before moving day. Movera provides packing and moving services in Melbourne for customers who want extra help getting their belongings ready for transport.",
      "The service can be used for house moves, apartment moves and office relocations.",
    ],
    heroImage: photos.packing("Packing boxes, wrap and materials ready for a Melbourne move"),
    sections: [
      {
        heading: "Packing Help Based on What You Need",
        body: [
          "Not every move needs the same level of packing support.",
          "You may want help with the full property, or only with areas that take more time to prepare.",
          "Packing support can include:",
        ],
        list: [
          "Kitchen items",
          "Books",
          "Clothes",
          "Decorative items",
          "Small household belongings",
          "Office contents",
          "Fragile items",
          "Boxes that need better organisation before transport",
        ],
        after: ["The amount of help can be discussed before the moving date."],
      },
      {
        heading: "Packing for House and Apartment Moves",
        body: [
          "A larger home may have several rooms to prepare, while an apartment may have fewer items but less space to work with.",
          "For apartment moves in areas such as Melbourne CBD, Richmond or South Yarra, packing early can also help when lift access or moving times are limited.",
          "For house moves in suburbs such as Doncaster, Reservoir or Box Hill, the main job may involve preparing a larger number of rooms, furniture items and household boxes.",
          "The packing plan can be based on the size of the property and what you want help with.",
        ],
        image: photos.houseStreet("Packed boxes being moved from a Melbourne house"),
      },
      {
        heading: "Packing Fragile and Smaller Items",
        body: [
          "Some belongings need more attention than standard household boxes.",
          "Glassware, ornaments, framed items and other breakable belongings should be packed in a way that reduces movement inside the box.",
          "It also helps to keep similar items together rather than mixing fragile belongings with heavier objects.",
          "When packing boxes, the aim is not only to fill them. They also need to be practical to carry, stack and unload at the new property.",
        ],
      },
      {
        heading: "Keeping Boxes Organised",
        body: [
          "Good labelling can save time after the move.",
          "Instead of marking every box simply as “household items,” it is more useful to note where it belongs.",
          "For example:",
        ],
        list: ["Kitchen", "Main bedroom", "Bathroom", "Office", "Living room", "Storage"],
        listStyle: "chips",
        after: [
          "You can also mark boxes that contain fragile belongings so they are easy to identify.",
          "This makes it simpler to place boxes in the correct part of the new property during unloading.",
        ],
        image: photos.packingWarehouse("Movera team packing and labelling moving boxes"),
      },
      {
        heading: "Packing Support for Office Moves",
        body: [
          "Packing and unpacking services can also be useful for office relocations.",
          "Businesses may need to organise files, stationery, small equipment, kitchen items and shared storage before the larger furniture is moved.",
          "Boxes can be labelled by department, room or workstation so staff can find items more easily at the new office.",
          "This can be especially useful when several work areas are being moved at the same time.",
        ],
        links: [link("office-commercial-relocations", "Office & Commercial Relocations")],
      },
      {
        heading: "Unpacking at the New Property",
        body: [
          "The job does not always end when the boxes arrive.",
          "Some customers also want help unpacking after the move.",
          "Unpacking support can help with opening boxes, placing general items in the correct rooms and reducing the amount of work left after moving day.",
          "The exact level of unpacking can be discussed based on what you need at the new property.",
        ],
      },
      {
        heading: "When Is Packing Support Useful?",
        body: ["Packing assistance may be useful when:"],
        list: [
          "You have limited time before moving day",
          "There are many rooms to prepare",
          "You are moving from an apartment with fixed access times",
          "Fragile belongings need more attention",
          "An office has several work areas to organise",
          "You want help with both packing and unpacking",
        ],
        after: [
          "You can choose the level of support that suits the move rather than using the same service for every property.",
        ],
      },
      {
        heading: "What Information Helps Before Booking?",
        body: ["When asking about packing services in Melbourne, it helps to share:"],
        list: [
          "Property type",
          "Number of rooms",
          "Moving date",
          "Areas you want help packing",
          "Any fragile items",
          "Whether office or household items are involved",
          "Whether unpacking is also required",
        ],
        after: ["These details make it easier to understand how much packing support may be needed."],
      },
    ],
    cta: {
      heading: "Need Help Packing for a Melbourne Move?",
      body: [
        "Tell Movera what needs to be packed, when you are moving and whether you also need help at the new property.",
      ],
      label: "Ask About Packing & Unpacking",
    },
    overview: {
      heading: "Packing & Unpacking",
      body: [
        "Packing can take a lot of time before moving day.",
        "Movera offers packing and unpacking support for customers who want help preparing household, office or fragile items before transport.",
        "The service can be used for a full property or only for selected rooms and belongings.",
      ],
      linkLabel: "Packing & Unpacking",
      image: photos.packing("Packing and unpacking service"),
    },
  },

  // ─────────────────────────── Furniture Removals ───────────────────────────
  {
    slug: "furniture-removals",
    title: "Furniture Removalists",
    tagline: "Everyday and oversized pieces, moved without the worry.",
    image: "/House_removalist.png",
    metaTitle: "Furniture Removalists Melbourne | Movera",
    metaDescription:
      "Movera helps move furniture across Melbourne, including sofas, beds, tables, wardrobes and larger household items between homes, apartments and offices.",
    h1: "Furniture Removalists Melbourne",
    intro: [
      "Moving furniture can be one of the more difficult parts of a house, apartment or office move.",
      "Large items can be awkward to carry, difficult to fit through doorways and more time-consuming when stairs, lifts or limited parking are involved. Movera helps with furniture removals across Melbourne for customers who need selected items moved or furniture included as part of a larger relocation.",
    ],
    heroImage: photos.furniture("Movera removalists carrying furniture to the truck"),
    sections: [
      {
        heading: "Moving Furniture Between Melbourne Properties",
        body: [
          "Furniture removal jobs can vary from a few individual items to most of the contents of a room or property.",
          "Movera can help with items such as:",
        ],
        list: [
          "Sofas",
          "Beds and mattresses",
          "Dining tables",
          "Chairs",
          "Wardrobes",
          "Cabinets",
          "Bookshelves",
          "Desks",
          "Outdoor furniture",
          "Larger household items",
        ],
        after: [
          "Before the move, it helps to know the size of the main items and whether there are any access issues at either address.",
        ],
      },
      {
        heading: "Furniture Moves for Houses and Apartments",
        body: [
          "A furniture move from a house may involve easier vehicle access but larger items and more space to cover.",
          "Apartment moves can involve different challenges. A sofa may fit easily inside the apartment but be more difficult to move through a shared hallway or lift.",
          "For properties in areas such as Melbourne CBD, Richmond or South Yarra, it can be useful to check:",
        ],
        list: [
          "Lift dimensions",
          "Building access times",
          "Loading areas",
          "Street parking",
          "Stairs",
          "Distance between the entrance and vehicle",
        ],
        after: [
          "For houses in suburbs such as Reservoir, Doncaster or Box Hill, access may be simpler, but larger furniture may still need careful planning around doorways, hallways and outdoor areas.",
        ],
        image: photos.houseStreet("Furniture being moved from a Melbourne house to a truck"),
      },
      {
        heading: "Large and Awkward Furniture",
        body: [
          "Some furniture needs more thought before it can be moved.",
          "Wardrobes, dining tables, larger sofas and heavy cabinets may be difficult to carry in one piece. In some cases, it may be easier to remove certain parts before the item is moved.",
          "If you have furniture that is unusually large, heavy or difficult to access, let Movera know when requesting the quote.",
          "Photos can also help explain the size and shape of an item before moving day.",
        ],
      },
      {
        heading: "Protecting Furniture During the Move",
        body: [
          "Furniture can pick up marks or damage if it is not handled carefully during loading, transport and unloading.",
          "The way an item is moved depends on its shape, weight and material. Larger pieces may need extra space inside the vehicle, while more delicate furniture may need to be positioned away from heavier items.",
          "It also helps to remove loose objects from cabinets, drawers or shelving before the move.",
        ],
        image: photos.loading("Furniture loaded and secured inside a moving truck"),
      },
      {
        heading: "Furniture-Only Moves",
        body: [
          "You do not need to be moving your whole home to use a furniture removal service.",
          "Furniture-only moves may be useful when:",
        ],
        list: [
          "Buying or collecting furniture",
          "Moving selected items to another address",
          "Helping a family member move furniture",
          "Moving furniture between rental properties",
          "Relocating office furniture",
          "Moving larger items that are difficult to transport alone",
        ],
        after: ["You can send the item list and addresses so the job can be checked before booking."],
      },
      {
        heading: "Furniture as Part of a Full Move",
        body: [
          "Furniture removals can also be included within a larger house or apartment move.",
          "In that case, it helps to separate the main furniture items from boxes and smaller belongings when providing information for the quote.",
          "This gives a clearer picture of how much needs to be moved and how the vehicle space may be used.",
        ],
        links: [link("local-removals", "Local Removals")],
      },
      {
        heading: "What Information Helps With a Furniture Moving Quote?",
        body: ["When asking about furniture removalists in Melbourne, provide:"],
        list: [
          "Pickup suburb",
          "Delivery suburb",
          "Furniture item list",
          "Approximate size of larger items",
          "Stairs or lift access",
          "Parking conditions",
          "Any narrow entrances or hallways",
          "Items that are especially heavy or delicate",
        ],
        after: ["These details make it easier to understand what is involved before the move is arranged."],
      },
    ],
    cta: {
      heading: "Need Furniture Moved in Melbourne?",
      body: [
        "Tell Movera what furniture needs to be moved, where it is being collected from and where it needs to go.",
      ],
      label: "Request a Furniture Moving Quote",
    },
    overview: {
      heading: "Furniture Removals",
      body: [
        "Large furniture can be difficult to move without the right planning.",
        "Movera helps move sofas, beds, tables, wardrobes, cabinets, office furniture and other larger items between Melbourne properties.",
        "This service can be used on its own or as part of a larger move.",
      ],
      linkLabel: "Furniture Removals",
      image: photos.furniture("Furniture removal in Melbourne"),
    },
  },

  // ───────────────────────── Specialty Item Removals ─────────────────────────
  {
    slug: "specialty-item-removals",
    title: "Specialty Item Removalists",
    tagline: "Extra care for the items that can't be replaced.",
    image: "/special-move.png",
    metaTitle: "Specialty Item Removalists Melbourne | Movera",
    metaDescription:
      "Movera helps move pianos, pool tables, gym equipment and other specialty items across Melbourne with planning for access, size and handling.",
    h1: "Specialty Item Removalists Melbourne",
    intro: [
      "Some items need more planning than standard furniture.",
      "A piano, pool table, gym machine or large decorative piece may be heavy, awkward to carry or difficult to move through a narrow entrance. The size of the item, the property layout and the access at both addresses can all affect how the job needs to be handled.",
      "Movera helps with specialty item removals across Melbourne for customers who need support moving larger, heavier or less straightforward items.",
    ],
    heroImage: photos.specialty("Movera team moving a specialty item"),
    sections: [
      {
        heading: "Piano Removals",
        body: [
          "A piano needs careful planning because its size, weight and structure make it very different from standard household furniture.",
          "The route between the room and the moving vehicle matters. Stairs, narrow hallways, tight corners and apartment lifts can all change how the move needs to be planned.",
          "For a piano job, send Movera the basic details below so the access and handling requirements are clear before the move.",
        ],
        list: [
          "Piano type",
          "Pickup suburb",
          "Delivery suburb",
          "Floor level",
          "Stairs",
          "Lift access",
          "Parking conditions",
          "Any narrow doors or passages",
        ],
        after: [
          "A few clear photos of the piano, doorway, stairs or lift area can also make the setup easier to understand before booking.",
        ],
      },
      {
        heading: "Pool Table Removals",
        body: [
          "Pool tables take up a large amount of space and may need more preparation before they can be moved.",
          "The size of the table, room access and distance to the vehicle are important details to check in advance.",
          "If a pool table needs to be moved between homes or commercial spaces, let Movera know the dimensions and whether there are stairs, tight corners or limited access at either property.",
        ],
        image: photos.loading("Heavy item loaded into a Movera truck"),
      },
      {
        heading: "Gym Equipment Removals",
        body: [
          "Home and commercial gym equipment can be difficult to move because many pieces are both heavy and bulky.",
          "This may include:",
        ],
        list: [
          "Treadmills",
          "Exercise bikes",
          "Weight benches",
          "Multi-station gym machines",
          "Free-weight storage",
          "Larger fitness equipment",
        ],
        after: [
          "If an item has separate parts or needs preparation before transport, this should be discussed before the moving date.",
        ],
      },
      {
        heading: "Artwork, Antiques and Delicate Items",
        body: [
          "Some items need attention because of their value, shape or surface rather than just their weight.",
          "Artwork, decorative pieces, antiques and similar belongings may need to be handled separately from standard household furniture.",
          "It is useful to share the size of the item and any access limitations before the move. This helps Movera understand how the item can be carried and positioned during transport.",
        ],
        image: photos.packingWarehouse("Delicate items being wrapped and packed by Movera staff"),
      },
      {
        heading: "Specialty Moves in Apartments and Busy Melbourne Areas",
        body: [
          "Specialty items can be harder to move from apartments or properties where access is restricted.",
          "In areas such as Melbourne CBD, South Yarra or Richmond, the vehicle may not be able to stop close to the entrance. Apartment buildings may also have lift bookings or set moving times.",
          "For these jobs, useful information includes:",
        ],
        list: [
          "Lift size",
          "Service lift availability",
          "Stairs",
          "Loading areas",
          "Parking distance",
          "Building access times",
          "Width of entrances or hallways",
        ],
        after: ["These details can make a big difference when the item is large or heavy."],
      },
      {
        heading: "What Should You Tell Movera Before Booking?",
        body: [
          "For a specialty item move, provide as much detail as possible about the item itself and the two properties.",
          "Useful information includes:",
        ],
        list: [
          "Type of item",
          "Approximate size",
          "Approximate weight, if known",
          "Pickup and delivery suburbs",
          "Floor levels",
          "Stairs or lifts",
          "Parking conditions",
          "Narrow entrances",
          "Whether the item comes apart",
          "Photos where useful",
        ],
        after: ["This helps clarify what the move will involve before it is arranged."],
      },
      {
        heading: "Moving More Than One Specialty Item?",
        body: [
          "A specialty move does not always involve only one item.",
          "You may need help moving several larger pieces along with standard furniture or boxes. In that case, Movera can look at the full list and plan the job around the different items involved.",
        ],
        links: [link("furniture-removals", "Furniture Removals")],
      },
    ],
    cta: {
      heading: "Need Help Moving a Specialty Item in Melbourne?",
      body: [
        "Send Movera the item details, pickup location, delivery location and any access information that may affect the move.",
      ],
      label: "Request a Specialty Item Moving Quote",
    },
    overview: {
      heading: "Specialty Item Removals",
      body: [
        "Some items need more attention because of their size, weight or shape.",
        "Movera can help with items such as pianos, pool tables, gym equipment and other specialty belongings where access and handling need to be checked before the move.",
      ],
      linkLabel: "Specialty Item Removals",
      image: photos.specialty("Specialty item removal"),
    },
  },

  // ─────────────────────────── Loading & Unloading ───────────────────────────
  {
    slug: "loading-unloading",
    title: "Loading & Unloading Services",
    tagline: "Labour-only support for your own truck, trailer or container.",
    image: "/loading-unloading.png",
    metaTitle: "Loading & Unloading Services Melbourne | Movera",
    metaDescription:
      "Movera helps with loading and unloading in Melbourne for moving trucks, containers, furniture and household items at homes, apartments and offices.",
    h1: "Loading & Unloading Services Melbourne",
    intro: [
      "Sometimes the main help you need is at the beginning or end of the move.",
      "You may already have a truck, van or container arranged, but still need people to carry furniture, boxes and larger items safely. Movera provides loading and unloading support across Melbourne for house moves, apartment moves and office relocations.",
      "The service can be used on its own or alongside other moving support.",
    ],
    heroImage: photos.loading("Movera crew loading furniture and boxes into a truck"),
    sections: [
      {
        heading: "Help Loading a Moving Vehicle",
        body: [
          "Loading is not just about fitting everything inside the vehicle.",
          "The order of the items matters. Larger furniture may need to go in first, while lighter boxes and smaller belongings can be placed around them. Heavy items should also be positioned so they do not shift unnecessarily during transport.",
          "Movera can help load:",
        ],
        list: [
          "Sofas",
          "Beds and mattresses",
          "Tables and chairs",
          "Wardrobes",
          "Cabinets",
          "Appliances",
          "Boxes",
          "Office furniture",
          "General household items",
        ],
        after: [
          "If you already have your own moving vehicle, let us know the size and the type of items that need to be loaded.",
        ],
      },
      {
        heading: "Unloading at the New Property",
        body: [
          "Unloading also needs some planning, especially when the property has stairs, lifts or limited access.",
          "It helps to know where larger items need to go before they are carried inside. A bed frame may need to go upstairs, while a sofa may need to be placed in a ground-floor living area.",
          "For apartment moves in areas such as Melbourne CBD, Richmond or South Yarra, lift access and parking can affect how unloading is handled.",
          "For houses in suburbs such as Reservoir, Doncaster or Box Hill, access may be more direct, but larger furniture can still require extra space to carry through entrances and hallways.",
        ],
        image: photos.houseStreet("Removalists unloading furniture at a Melbourne home"),
      },
      {
        heading: "Loading and Unloading for Containers",
        body: [
          "Some customers use storage or moving containers rather than a standard moving truck.",
          "In these cases, the job may involve loading furniture and boxes into the container at one property or unloading them after the container reaches the new address.",
          "It is useful to know:",
        ],
        list: [
          "Container size",
          "Where the container will be placed",
          "Distance from the property",
          "Number of stairs",
          "Type of furniture involved",
          "Approximate number of boxes",
          "Any large or heavy items",
        ],
        after: ["This helps Movera understand how much carrying and loading work is involved."],
      },
      {
        heading: "Labour-Only Moving Help",
        body: ["You may not need a full removal service.", "For example, you might already have:"],
        list: [
          "A hired truck",
          "A moving van",
          "A storage container",
          "Your own transport",
          "A vehicle provided by another company",
        ],
        after: [
          "In that case, Movera can help with the physical loading or unloading while you manage the transport separately.",
          "This can be useful for smaller moves, rental moves, furniture-only jobs or situations where you have already arranged the vehicle.",
        ],
        image: photos.fleet("Moving trucks parked ready for loading"),
      },
      {
        heading: "Access Can Change the Job",
        body: [
          "The amount of carrying involved can vary a lot between properties.",
          "A vehicle parked beside the entrance is very different from one parked further down the street or inside a loading area.",
          "Before booking, it helps to mention:",
        ],
        list: [
          "Stairs",
          "Lift access",
          "Parking distance",
          "Narrow hallways",
          "Apartment access rules",
          "Basement parking",
          "Larger furniture",
          "Heavy items",
        ],
        after: ["These details help give a clearer picture of what is required at each property."],
      },
      {
        heading: "What Information Should You Send?",
        body: [
          "For a loading or unloading job, Movera will need the basic details of the move.",
          "Useful information includes:",
        ],
        list: [
          "Suburb",
          "Property type",
          "Whether loading, unloading or both are needed",
          "Vehicle or container size",
          "Main furniture items",
          "Approximate number of boxes",
          "Stairs or lift access",
          "Parking conditions",
          "Any large or heavy items",
        ],
        after: ["Photos can also be useful if the access or furniture is difficult to describe."],
      },
    ],
    cta: {
      heading: "Need Help Loading or Unloading in Melbourne?",
      body: [
        "Tell Movera what needs to be moved, where the vehicle or container will be located and what access is available at the property.",
      ],
      label: "Ask About Loading & Unloading Support",
    },
    overview: {
      heading: "Loading & Unloading",
      body: [
        "You may already have a moving truck, van or container arranged but still need help with the physical work.",
        "Movera provides loading and unloading support for furniture, boxes and household or office items.",
      ],
      linkLabel: "Loading & Unloading",
      image: photos.loading("Loading and unloading service"),
    },
  },
];

export function getService(slug: string): Service | undefined {
  return services.find((s) => s.slug === slug);
}
