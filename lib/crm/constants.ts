/** Labels, colour coding and presets used across the /crm dashboard. */

export type LeadStatus = "new" | "contacted" | "quoted" | "follow_up" | "scheduled" | "booked" | "lost";
export type TimeSlot = "early" | "morning" | "midday" | "afternoon" | "evening";
export type JobStatus = "unassigned" | "assigned" | "confirmed" | "in_progress" | "completed" | "cancelled";
export type EstimateStatus = "draft" | "sent" | "accepted" | "declined";
export type ResourceKind = "trucker" | "subcontractor" | "crew";
export type Role = "admin" | "sales" | "operations";

export const LEAD_STATUSES: { id: LeadStatus; label: string; dot: string; chip: string; col: string }[] = [
  { id: "new", label: "New", dot: "bg-sky-500", chip: "bg-sky-50 text-sky-800 border-sky-200", col: "border-t-sky-500" },
  { id: "contacted", label: "Contacted", dot: "bg-indigo-500", chip: "bg-indigo-50 text-indigo-800 border-indigo-200", col: "border-t-indigo-500" },
  { id: "quoted", label: "Quote sent", dot: "bg-amber-500", chip: "bg-amber-50 text-amber-800 border-amber-200", col: "border-t-amber-500" },
  { id: "follow_up", label: "Follow-up", dot: "bg-orange-500", chip: "bg-orange-50 text-orange-800 border-orange-200", col: "border-t-orange-500" },
  { id: "scheduled", label: "Scheduled", dot: "bg-violet-500", chip: "bg-violet-50 text-violet-800 border-violet-200", col: "border-t-violet-500" },
  { id: "booked", label: "Closed – Booked", dot: "bg-emerald-500", chip: "bg-emerald-50 text-emerald-800 border-emerald-200", col: "border-t-emerald-500" },
  { id: "lost", label: "Closed – Lost", dot: "bg-rose-500", chip: "bg-rose-50 text-rose-800 border-rose-200", col: "border-t-rose-500" },
];

export const leadStatusMeta = (s: LeadStatus) => LEAD_STATUSES.find((x) => x.id === s) ?? LEAD_STATUSES[0];

export const LOST_REASONS = [
  "Price too high",
  "Booked another mover",
  "Date unavailable",
  "No response",
  "Move cancelled / postponed",
  "Out of service area",
  "Other",
];

/** Colour-coded job windows — shown on the schedule board and job cards. */
export const TIME_SLOTS: { id: TimeSlot; label: string; window: string; start: string; card: string; dot: string; text: string }[] = [
  { id: "early", label: "Early morning", window: "6–8am", start: "06:00", card: "bg-indigo-50 border-indigo-300", dot: "bg-indigo-500", text: "text-indigo-900" },
  { id: "morning", label: "Morning", window: "8–11am", start: "08:00", card: "bg-amber-50 border-amber-300", dot: "bg-amber-500", text: "text-amber-900" },
  { id: "midday", label: "Midday", window: "11am–1pm", start: "11:00", card: "bg-orange-50 border-orange-300", dot: "bg-orange-500", text: "text-orange-900" },
  { id: "afternoon", label: "Afternoon", window: "1–4pm", start: "13:00", card: "bg-sky-50 border-sky-300", dot: "bg-sky-500", text: "text-sky-900" },
  { id: "evening", label: "Evening", window: "4–7pm", start: "16:00", card: "bg-purple-50 border-purple-300", dot: "bg-purple-600", text: "text-purple-900" },
];

export const slotMeta = (s: TimeSlot) => TIME_SLOTS.find((x) => x.id === s) ?? TIME_SLOTS[1];

export const JOB_STATUSES: { id: JobStatus; label: string; chip: string }[] = [
  { id: "unassigned", label: "Unassigned", chip: "bg-rose-50 text-rose-800 border-rose-200" },
  { id: "assigned", label: "Assigned", chip: "bg-sky-50 text-sky-800 border-sky-200" },
  { id: "confirmed", label: "Crew confirmed", chip: "bg-indigo-50 text-indigo-800 border-indigo-200" },
  { id: "in_progress", label: "In progress", chip: "bg-amber-50 text-amber-800 border-amber-200" },
  { id: "completed", label: "Completed", chip: "bg-emerald-50 text-emerald-800 border-emerald-200" },
  { id: "cancelled", label: "Cancelled", chip: "bg-gray-100 text-ink-400 border-border" },
];

export const jobStatusMeta = (s: JobStatus) => JOB_STATUSES.find((x) => x.id === s) ?? JOB_STATUSES[0];

export const ESTIMATE_STATUSES: { id: EstimateStatus; label: string; chip: string }[] = [
  { id: "draft", label: "Draft", chip: "bg-gray-100 text-ink-600 border-border" },
  { id: "sent", label: "Sent", chip: "bg-amber-50 text-amber-800 border-amber-200" },
  { id: "accepted", label: "Accepted", chip: "bg-emerald-50 text-emerald-800 border-emerald-200" },
  { id: "declined", label: "Declined", chip: "bg-rose-50 text-rose-800 border-rose-200" },
];

export const estimateStatusMeta = (s: EstimateStatus) =>
  ESTIMATE_STATUSES.find((x) => x.id === s) ?? ESTIMATE_STATUSES[0];

export const RESOURCE_KINDS: { id: ResourceKind; label: string; icon: string }[] = [
  { id: "trucker", label: "Trucker", icon: "🚚" },
  { id: "subcontractor", label: "Sub-contractor", icon: "🤝" },
  { id: "crew", label: "In-house crew", icon: "👷" },
];

export const LEAD_SOURCES = ["website", "landing-page", "phone", "google-ads", "referral", "repeat", "walk-in", "manual"];

// ─────────────────────────── Quotation presets ───────────────────────────

/** Common household items with typical volumes (m³). */
export const ITEM_LIBRARY: Record<string, { name: string; m3: number }[]> = {
  "Living room": [
    { name: "3-seater sofa", m3: 1.4 },
    { name: "2-seater sofa", m3: 1.0 },
    { name: "Armchair", m3: 0.6 },
    { name: "Coffee table", m3: 0.3 },
    { name: "TV (up to 65\")", m3: 0.3 },
    { name: "TV unit", m3: 0.5 },
    { name: "Bookshelf", m3: 0.6 },
    { name: "Rug (rolled)", m3: 0.15 },
  ],
  "Dining & kitchen": [
    { name: "Dining table (6 seat)", m3: 0.9 },
    { name: "Dining chair", m3: 0.2 },
    { name: "Fridge (large)", m3: 1.0 },
    { name: "Fridge (small)", m3: 0.5 },
    { name: "Washing machine", m3: 0.5 },
    { name: "Dryer", m3: 0.5 },
    { name: "Microwave", m3: 0.1 },
    { name: "Bar stool", m3: 0.15 },
  ],
  Bedroom: [
    { name: "Queen bed + mattress", m3: 1.6 },
    { name: "King bed + mattress", m3: 2.0 },
    { name: "Single bed + mattress", m3: 0.9 },
    { name: "Bedside table", m3: 0.2 },
    { name: "Chest of drawers", m3: 0.6 },
    { name: "Wardrobe (freestanding)", m3: 1.4 },
    { name: "Dresser / tallboy", m3: 0.7 },
    { name: "Cot", m3: 0.5 },
  ],
  "Office & study": [
    { name: "Desk", m3: 0.7 },
    { name: "Office chair", m3: 0.3 },
    { name: "Filing cabinet", m3: 0.4 },
    { name: "Computer + monitor", m3: 0.2 },
  ],
  "Outdoor & garage": [
    { name: "Outdoor setting (table + 4)", m3: 1.2 },
    { name: "BBQ", m3: 0.6 },
    { name: "Bicycle", m3: 0.4 },
    { name: "Lawn mower", m3: 0.4 },
    { name: "Tool box / shelving", m3: 0.4 },
  ],
  "Boxes & misc": [
    { name: "Box (small/book)", m3: 0.04 },
    { name: "Box (medium)", m3: 0.07 },
    { name: "Box (large)", m3: 0.1 },
    { name: "Wardrobe box", m3: 0.3 },
    { name: "Plastic tub", m3: 0.08 },
    { name: "Suitcase", m3: 0.1 },
  ],
  "Special items": [
    { name: "Piano (upright)", m3: 1.5 },
    { name: "Pool table", m3: 2.0 },
    { name: "Gym equipment / treadmill", m3: 1.0 },
    { name: "Safe", m3: 0.4 },
    { name: "Artwork / mirror", m3: 0.1 },
    { name: "Aquarium", m3: 0.5 },
  ],
};

/** Starter inventories for "Load typical inventory". */
export const TYPICAL_INVENTORY: Record<string, [room: string, name: string, qty: number][]> = {
  "Studio / 1 bedroom": [
    ["Living room", "2-seater sofa", 1],
    ["Living room", "TV unit", 1],
    ["Living room", "TV (up to 65\")", 1],
    ["Dining & kitchen", "Fridge (small)", 1],
    ["Dining & kitchen", "Dining chair", 2],
    ["Bedroom", "Queen bed + mattress", 1],
    ["Bedroom", "Bedside table", 2],
    ["Bedroom", "Chest of drawers", 1],
    ["Boxes & misc", "Box (medium)", 15],
  ],
  "2 bedrooms": [
    ["Living room", "3-seater sofa", 1],
    ["Living room", "Armchair", 1],
    ["Living room", "Coffee table", 1],
    ["Living room", "TV unit", 1],
    ["Living room", "TV (up to 65\")", 1],
    ["Dining & kitchen", "Dining table (6 seat)", 1],
    ["Dining & kitchen", "Dining chair", 4],
    ["Dining & kitchen", "Fridge (large)", 1],
    ["Dining & kitchen", "Washing machine", 1],
    ["Bedroom", "Queen bed + mattress", 2],
    ["Bedroom", "Bedside table", 3],
    ["Bedroom", "Chest of drawers", 2],
    ["Boxes & misc", "Box (medium)", 25],
    ["Boxes & misc", "Box (large)", 10],
  ],
  "3 bedrooms": [
    ["Living room", "3-seater sofa", 1],
    ["Living room", "2-seater sofa", 1],
    ["Living room", "Coffee table", 1],
    ["Living room", "TV unit", 1],
    ["Living room", "TV (up to 65\")", 2],
    ["Living room", "Bookshelf", 1],
    ["Dining & kitchen", "Dining table (6 seat)", 1],
    ["Dining & kitchen", "Dining chair", 6],
    ["Dining & kitchen", "Fridge (large)", 1],
    ["Dining & kitchen", "Washing machine", 1],
    ["Dining & kitchen", "Dryer", 1],
    ["Bedroom", "King bed + mattress", 1],
    ["Bedroom", "Queen bed + mattress", 1],
    ["Bedroom", "Single bed + mattress", 1],
    ["Bedroom", "Bedside table", 4],
    ["Bedroom", "Chest of drawers", 3],
    ["Office & study", "Desk", 1],
    ["Office & study", "Office chair", 1],
    ["Outdoor & garage", "Outdoor setting (table + 4)", 1],
    ["Boxes & misc", "Box (medium)", 35],
    ["Boxes & misc", "Box (large)", 15],
  ],
  "4 bedrooms": [
    ["Living room", "3-seater sofa", 2],
    ["Living room", "Armchair", 2],
    ["Living room", "Coffee table", 1],
    ["Living room", "TV unit", 2],
    ["Living room", "TV (up to 65\")", 2],
    ["Living room", "Bookshelf", 2],
    ["Dining & kitchen", "Dining table (6 seat)", 1],
    ["Dining & kitchen", "Dining chair", 8],
    ["Dining & kitchen", "Fridge (large)", 2],
    ["Dining & kitchen", "Washing machine", 1],
    ["Dining & kitchen", "Dryer", 1],
    ["Bedroom", "King bed + mattress", 1],
    ["Bedroom", "Queen bed + mattress", 2],
    ["Bedroom", "Single bed + mattress", 1],
    ["Bedroom", "Bedside table", 6],
    ["Bedroom", "Chest of drawers", 4],
    ["Bedroom", "Wardrobe (freestanding)", 1],
    ["Office & study", "Desk", 1],
    ["Office & study", "Office chair", 1],
    ["Outdoor & garage", "Outdoor setting (table + 4)", 1],
    ["Outdoor & garage", "BBQ", 1],
    ["Boxes & misc", "Box (medium)", 50],
    ["Boxes & misc", "Box (large)", 20],
  ],
};
TYPICAL_INVENTORY["5+ bedrooms"] = [
  ...TYPICAL_INVENTORY["4 bedrooms"],
  ["Bedroom", "Queen bed + mattress", 1],
  ["Bedroom", "Bedside table", 2],
  ["Bedroom", "Chest of drawers", 1],
  ["Boxes & misc", "Box (medium)", 20],
];

export const MATERIAL_PRESETS: { name: string; unitPrice: number }[] = [
  { name: "Small box", unitPrice: 3.5 },
  { name: "Medium box", unitPrice: 4.5 },
  { name: "Large box", unitPrice: 5.5 },
  { name: "Book / wine box", unitPrice: 4 },
  { name: "Wardrobe box", unitPrice: 18 },
  { name: "Packing tape (roll)", unitPrice: 4 },
  { name: "Bubble wrap (10 m)", unitPrice: 15 },
  { name: "Butcher's paper (bundle)", unitPrice: 20 },
  { name: "Mattress bag (queen/king)", unitPrice: 15 },
  { name: "Mattress bag (single)", unitPrice: 10 },
  { name: "Stretch wrap (roll)", unitPrice: 25 },
  { name: "TV box", unitPrice: 35 },
];

export const FEE_PRESETS: { name: string; unitPrice: number }[] = [
  { name: "Piano handling", unitPrice: 150 },
  { name: "Pool table handling", unitPrice: 200 },
  { name: "Weekend surcharge", unitPrice: 50 },
  { name: "Public holiday surcharge", unitPrice: 120 },
  { name: "Tolls", unitPrice: 15 },
  { name: "Furniture assembly / disassembly", unitPrice: 60 },
  { name: "Rubbish removal", unitPrice: 90 },
  { name: "Extra stop", unitPrice: 40 },
];

export const PROPERTY_TYPES = ["House", "Apartment / unit", "Townhouse", "Office / commercial", "Storage unit"];
export const SIZE_OPTIONS = ["Single item", "Studio / 1 bedroom", "2 bedrooms", "3 bedrooms", "4 bedrooms", "5+ bedrooms"];
export const ACCESS_OPTIONS = ["Ground", "Stairs", "Lift"];
export const MOVE_TYPES = ["Residential", "Office", "Interstate", "Single item", "Storage only"];
