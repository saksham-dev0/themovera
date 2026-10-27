/**
 * Customer hourly rates by truck size — the single source for every page that
 * shows pricing (/pricing, the home page, /local-movers-melbourne).
 */
export type TruckRate = {
  name: string;
  /** Short truck size shown on the card, e.g. "Small". */
  size: string;
  rate: string;
  unit: string;
  /** Bedroom count the truck suits. */
  bedrooms: number;
  removalists: number;
  popular: boolean;
};

export const truckRates: TruckRate[] = [
  { name: "Small Truck", size: "Small", rate: "$130", unit: "/hr", bedrooms: 2, removalists: 2, popular: true },
  { name: "Medium Truck", size: "Medium", rate: "$140", unit: "/hr", bedrooms: 3, removalists: 2, popular: false },
  { name: "Large Truck", size: "Large", rate: "$150", unit: "/hr", bedrooms: 4, removalists: 2, popular: false },
  { name: "Extra-Large Truck", size: "Extra-Large", rate: "$160", unit: "/hr", bedrooms: 3, removalists: 2, popular: false },
];

/** Lowest hourly rate, for "from $X/hr" copy. */
export const STARTING_RATE = "$130/hr";
