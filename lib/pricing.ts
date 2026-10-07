/**
 * Customer hourly rates by truck size — the single source for every page that
 * shows pricing (/pricing, the home page, /local-movers-melbourne).
 */
export type TruckRate = {
  name: string;
  /** Short truck size shown on the card, e.g. "4.5t". */
  size: string;
  rate: string;
  unit: string;
  /** Bedroom count the truck suits. */
  bedrooms: number;
  removalists: number;
  popular: boolean;
};

export const truckRates: TruckRate[] = [
  { name: "4.5 Tonne Truck", size: "4.5t", rate: "$140", unit: "/hr", bedrooms: 2, removalists: 2, popular: true },
  { name: "6 Tonne Truck", size: "6t", rate: "$150", unit: "/hr", bedrooms: 3, removalists: 2, popular: false },
  { name: "8 Tonne Truck", size: "8t", rate: "$160", unit: "/hr", bedrooms: 3, removalists: 2, popular: false },
  { name: "10 Tonne Truck", size: "10t", rate: "$170–180", unit: "/hr", bedrooms: 3, removalists: 2, popular: false },
];

/** Lowest hourly rate, for "from $X/hr" copy. */
export const STARTING_RATE = "$140/hr";
