/**
 * Pure quote maths shared by the Convex backend and the /crm browser UI, so the
 * total a salesperson sees while typing is exactly the total that gets saved
 * and emailed. No Convex imports here — keep it framework-free.
 */
import type { Infer } from "convex/values";
import type {
  estimateInventoryItem,
  estimateLabour,
  estimateLine,
  estimateMoveInfo,
  estimateQuotation,
  estimateStorage,
} from "../schema";

export type MoveInfo = Infer<typeof estimateMoveInfo>;
export type InventoryItem = Infer<typeof estimateInventoryItem>;
export type Line = Infer<typeof estimateLine>;
export type Labour = Infer<typeof estimateLabour>;
export type Storage = Infer<typeof estimateStorage>;
export type Quotation = Infer<typeof estimateQuotation>;

export type EstimateData = {
  moveInfo: MoveInfo;
  inventory: InventoryItem[];
  materials: Line[];
  labour: Labour;
  storage: Storage;
  quotation: Quotation;
};

export const GST_RATE = 0.1;

/**
 * Truck sizes and customer hourly rates (2 removalists), matching the public
 * /pricing page (lib/pricing.ts). `capacity` is usable load volume in m³.
 */
export const TRUCKS = [
  { size: "Small", capacity: 20, rate: 130 },
  { size: "Medium", capacity: 30, rate: 140 },
  { size: "Large", capacity: 40, rate: 150 },
  { size: "Extra-Large", capacity: 50, rate: 160 },
] as const;

/** Added to the hourly rate for every removalist beyond the included two. */
export const EXTRA_MOVER_RATE = 55;
/** Added to the hourly rate for every truck beyond the first. */
export const EXTRA_TRUCK_RATE = 70;
/** m³ one removalist loads + unloads per hour, door to door. */
export const M3_PER_MOVER_HOUR = 2.6;

export function round2(n: number) {
  return Math.round(n * 100) / 100;
}

/** Round hours up to the nearest quarter hour. */
export function quarterHours(n: number) {
  return Math.ceil(n * 4) / 4;
}

export function inventoryVolume(items: InventoryItem[]) {
  return round2(items.reduce((sum, i) => sum + i.qty * i.cubicMetres, 0));
}

export function inventoryCount(items: InventoryItem[]) {
  return items.reduce((sum, i) => sum + i.qty, 0);
}

export function lineTotal(lines: Line[]) {
  return round2(lines.reduce((sum, l) => sum + l.qty * l.unitPrice, 0));
}

/** Hourly rate for a crew/truck combination from the standard rate card. */
export function standardHourlyRate(truckSize: string, crewSize: number, trucks: number) {
  const truck = TRUCKS.find((t) => t.size === truckSize) ?? TRUCKS[0];
  return (
    truck.rate +
    Math.max(0, crewSize - 2) * EXTRA_MOVER_RATE +
    Math.max(0, trucks - 1) * EXTRA_TRUCK_RATE
  );
}

/** Multiplier for slow access: stairs per floor, lifts, and long carries. */
function accessFactor(a: MoveInfo["pickup"]) {
  let f = 1;
  if (a.access === "Stairs") f += 0.1 * Math.max(1, a.floor);
  if (a.access === "Lift") f += 0.08;
  if (a.parkingMetres > 20) f += Math.min(0.3, (a.parkingMetres - 20) / 100);
  return f;
}

/**
 * Suggest crew, trucks and hours from the inventory volume and access. This is
 * the "how it got there" explanation shown on the Labour step.
 */
export function suggestLabour(moveInfo: MoveInfo, volume: number) {
  const largest = TRUCKS[TRUCKS.length - 1];
  const trucks = Math.max(1, Math.ceil(volume / largest.capacity));
  const perTruck = volume / trucks;
  const truck = TRUCKS.find((t) => t.capacity >= perTruck) ?? largest;

  let crewSize = 2;
  if (volume > 30) crewSize = 3;
  if (volume > 45) crewSize = 4;
  if (trucks > 1) crewSize = Math.max(crewSize, trucks * 2);

  const factor = (accessFactor(moveInfo.pickup) + accessFactor(moveInfo.dropoff)) / 2;
  const workHours = volume > 0 ? (volume / (crewSize * M3_PER_MOVER_HOUR)) * factor : 0;
  const stopHours = moveInfo.extraStops * 0.5;
  const driveHours = moveInfo.distanceKm > 0 ? moveInfo.distanceKm / 40 : 0; // ~40 km/h metro
  const estimatedHours = quarterHours(Math.max(2, workHours + stopHours + driveHours));

  return {
    trucks,
    truckSize: truck.size as string,
    crewSize,
    hourlyRate: standardHourlyRate(truck.size, crewSize, trucks),
    estimatedHours,
    factor: round2(factor),
    workHours: round2(workHours),
    driveHours: round2(driveHours),
    stopHours,
  };
}

export function storageTotal(s: Storage) {
  if (!s.required) return 0;
  return round2(s.units * s.weeks * s.weeklyRate + s.handlingFee);
}

export type QuoteTotals = {
  volume: number;
  itemCount: number;
  billableHours: number;
  labourCost: number;
  packingCost: number;
  accessFees: number;
  materialsTotal: number;
  storageTotal: number;
  extraFeesTotal: number;
  movingFee: number;
  fuelLevy: number;
  subtotal: number;
  discount: number;
  gst: number;
  total: number;
  low: number;
  high: number;
  deposit: number;
};

/**
 * The full quotation. For hourly quotes the range is ± `hoursSpread` hours of
 * labour; fixed quotes have no range.
 */
export function computeQuote(e: EstimateData): QuoteTotals {
  const { labour: l, quotation: q } = e;
  const billableHours = Math.max(l.minimumHours, l.estimatedHours + l.travelHours);

  const labourCost = q.pricingType === "fixed" ? q.fixedPrice : round2(billableHours * l.hourlyRate);
  const packingCost = round2(l.packingHours * l.packingRate);
  const accessFees = round2(l.stairFee + l.heavyItemFee);
  const materials = lineTotal(e.materials);
  const storage = storageTotal(e.storage);
  const extraFees = lineTotal(q.extraFees);
  const movingFee = q.pricingType === "fixed" ? 0 : q.movingFee;

  const subtotal = round2(
    labourCost + packingCost + accessFees + materials + storage + extraFees + movingFee + q.fuelLevy,
  );
  const discount = round2(
    Math.min(subtotal, q.discountType === "percent" ? (subtotal * q.discount) / 100 : q.discount),
  );
  const afterDiscount = subtotal - discount;
  const gst = q.includeGst ? round2(afterDiscount * GST_RATE) : 0;
  const total = round2(afterDiscount + gst);

  // Range: shift labour by ± spread hours (never below the minimum).
  let low = total;
  let high = total;
  if (q.pricingType === "hourly" && q.hoursSpread > 0) {
    const gstMul =
      (q.includeGst ? 1 + GST_RATE : 1) * (q.discountType === "percent" ? 1 - q.discount / 100 : 1);
    const lowHours = Math.max(l.minimumHours, billableHours - q.hoursSpread);
    low = round2(total - (billableHours - lowHours) * l.hourlyRate * gstMul);
    high = round2(total + q.hoursSpread * l.hourlyRate * gstMul);
  }

  return {
    volume: inventoryVolume(e.inventory),
    itemCount: inventoryCount(e.inventory),
    billableHours,
    labourCost,
    packingCost,
    accessFees,
    materialsTotal: materials,
    storageTotal: storage,
    extraFeesTotal: extraFees,
    movingFee,
    fuelLevy: q.fuelLevy,
    subtotal,
    discount,
    gst,
    total,
    low,
    high,
    deposit: round2((total * q.depositPercent) / 100),
  };
}

export const DEFAULT_TERMS =
  "Hourly quotes are charged in 15-minute increments after the minimum hours, from arrival at pickup to completion at drop-off, plus the call-out fee. " +
  "Includes $100,000 goods-in-transit cover, blankets, trolleys and straps. " +
  "Fixed-price quotes cover the inventory listed; additional items may change the price. " +
  "A deposit secures your booking and is deducted from the final invoice. Cancellations within 48 hours of the move may forfeit the deposit.";
