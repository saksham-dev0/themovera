/**
 * Melbourne suburbs served by Movera, grouped by region.
 *
 * The grouping drives the <optgroup> structure of the pickup / drop-off
 * dropdowns on the landing-page quote form.
 */
export type SuburbRegion = { region: string; suburbs: string[] };

export const suburbRegions: SuburbRegion[] = [
  {
    region: "Melbourne CBD & Inner",
    suburbs: [
      "Melbourne CBD", "Southbank", "Docklands", "Fitzroy", "Fitzroy North", "Collingwood",
      "Richmond", "South Yarra", "Prahran", "Windsor", "St Kilda", "St Kilda East",
      "Carlton", "Carlton North", "Parkville", "North Melbourne", "West Melbourne",
      "East Melbourne", "Abbotsford", "Cremorne", "Toorak", "South Melbourne",
      "Port Melbourne", "Albert Park", "Middle Park", "Brunswick", "Brunswick East",
      "Brunswick West", "Northcote", "Thornbury", "Coburg",
    ],
  },
  {
    region: "Bayside & South-East",
    suburbs: [
      "Brighton", "Brighton East", "Sandringham", "Hampton", "Mentone", "Cheltenham",
      "Highett", "Beaumaris", "Black Rock", "Bentleigh", "Bentleigh East", "Moorabbin",
      "Frankston", "Mordialloc", "Aspendale", "Chelsea", "Carrum", "Seaford",
      "Dandenong", "Springvale", "Clayton", "Oakleigh", "Malvern", "Malvern East",
      "Caulfield", "Elsternwick", "Glen Iris", "Ormond", "McKinnon", "Carnegie",
    ],
  },
  {
    region: "Eastern Suburbs",
    suburbs: [
      "Box Hill", "Doncaster", "Doncaster East", "Templestowe", "Balwyn", "Balwyn North",
      "Camberwell", "Hawthorn", "Hawthorn East", "Kew", "Kew East", "Surrey Hills",
      "Blackburn", "Mitcham", "Nunawading", "Ringwood", "Croydon", "Bayswater",
      "Boronia", "Ferntree Gully", "Glen Waverley", "Mount Waverley", "Wheelers Hill",
      "Vermont", "Burwood",
    ],
  },
  {
    region: "Northern Suburbs",
    suburbs: [
      "Preston", "Reservoir", "Epping", "Thomastown", "Lalor", "Bundoora", "Heidelberg",
      "Heidelberg Heights", "Ivanhoe", "Fairfield", "Alphington", "Eltham", "Greensborough",
      "Watsonia", "Diamond Creek", "Mill Park", "South Morang", "Craigieburn",
      "Essendon", "Moonee Ponds", "Ascot Vale", "Pascoe Vale", "Glenroy", "Broadmeadows",
    ],
  },
  {
    region: "Western & Inner West",
    suburbs: [
      "Footscray", "Seddon", "Yarraville", "Kingsville", "West Footscray", "Maribyrnong",
      "Braybrook", "Sunshine", "Albion", "Deer Park", "St Albans", "Altona",
      "Altona North", "Altona Meadows", "Williamstown", "Newport", "Spotswood",
      "Point Cook", "Werribee", "Hoppers Crossing", "Tarneit", "Truganina",
      "Caroline Springs", "Melton",
    ],
  },
];

/** Escape hatch so an unlisted suburb never blocks a quote request. */
export const OTHER_SUBURB = "Other — not listed";

/** Flat list, used by the site-wide hero suburb search. */
export const melbourneSuburbs: string[] = suburbRegions.flatMap((group) => group.suburbs);
