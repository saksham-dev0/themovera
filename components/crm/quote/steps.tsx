"use client";

import { useState } from "react";
import { Btn, Field, NumberInput, Segmented, SelectInput, TextArea, TextInput } from "../ui";
import {
  ACCESS_OPTIONS,
  FEE_PRESETS,
  ITEM_LIBRARY,
  MATERIAL_PRESETS,
  MOVE_TYPES,
  PROPERTY_TYPES,
  SIZE_OPTIONS,
  TIME_SLOTS,
  TYPICAL_INVENTORY,
} from "@/lib/crm/constants";
import { money } from "@/lib/crm/format";
import {
  CALL_OUT_HOURS,
  MINIMUM_HOURS,
  TRUCKS,
  computeQuote,
  inventoryVolume,
  standardHourlyRate,
  storageTotal,
  suggestLabour,
  type EstimateData,
  type InventoryItem,
  type Line,
  type MoveInfo,
} from "@/convex/crm/quoteMath";

export const STEPS = [
  { id: "move", label: "Move info", icon: "①" },
  { id: "inventory", label: "Inventory", icon: "②" },
  { id: "materials", label: "Materials", icon: "③" },
  { id: "labour", label: "Labour", icon: "④" },
  { id: "storage", label: "Storage", icon: "⑤" },
  { id: "quotation", label: "Quotation", icon: "⑥" },
] as const;

export type Section = keyof EstimateData;
export type StepProps = {
  data: EstimateData;
  change: <K extends Section>(section: K, value: EstimateData[K]) => void;
  readOnly: boolean;
};

function H({ children, sub }: { children: React.ReactNode; sub?: string }) {
  return (
    <div className="mb-3">
      <h3 className="m-0 font-display text-base font-semibold text-ink-800">{children}</h3>
      {sub && <p className="m-0 text-xs text-ink-400">{sub}</p>}
    </div>
  );
}

// ─────────────────────────────── 1. Move info ───────────────────────────────

function AccessBlock({
  title,
  value,
  onChange,
}: {
  title: string;
  value: MoveInfo["pickup"];
  onChange: (v: MoveInfo["pickup"]) => void;
}) {
  const set = <K extends keyof MoveInfo["pickup"]>(k: K, v: MoveInfo["pickup"][K]) => onChange({ ...value, [k]: v });
  return (
    <div className="rounded-md border border-border p-4">
      <div className="mb-3 font-display text-sm font-semibold text-ink-800">{title}</div>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Address" className="col-span-2">
          {(id) => <TextInput id={id} value={value.address} onChange={(e) => set("address", e.target.value)} />}
        </Field>
        <Field label="Property">
          {(id) => (
            <SelectInput id={id} value={value.propertyType} onChange={(e) => set("propertyType", e.target.value)}>
              {[...new Set([value.propertyType, ...PROPERTY_TYPES])].filter(Boolean).map((p) => (
                <option key={p}>{p}</option>
              ))}
            </SelectInput>
          )}
        </Field>
        <Field label="Size">
          {(id) => (
            <SelectInput id={id} value={value.bedrooms} onChange={(e) => set("bedrooms", e.target.value)}>
              <option value="">—</option>
              {SIZE_OPTIONS.map((p) => (
                <option key={p}>{p}</option>
              ))}
            </SelectInput>
          )}
        </Field>
        <Field label="Access">
          {(id) => (
            <SelectInput id={id} value={value.access} onChange={(e) => set("access", e.target.value)}>
              {ACCESS_OPTIONS.map((p) => (
                <option key={p}>{p}</option>
              ))}
            </SelectInput>
          )}
        </Field>
        <Field label="Floor / levels">{(id) => <NumberInput id={id} value={value.floor} onChange={(n) => set("floor", n)} />}</Field>
        <Field label="Truck-to-door distance" className="col-span-2" hint="Long carries slow the crew down.">
          {(id) => <NumberInput id={id} value={value.parkingMetres} suffix="metres" onChange={(n) => set("parkingMetres", n)} />}
        </Field>
      </div>
    </div>
  );
}

export function MoveInfoStep({ data, change }: StepProps) {
  const m = data.moveInfo;
  const set = <K extends keyof MoveInfo>(k: K, v: MoveInfo[K]) => change("moveInfo", { ...m, [k]: v });
  return (
    <div className="flex flex-col gap-5">
      <div>
        <H sub="Pre-filled from the website form — check it with the customer.">Customer & date</H>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <Field label="Customer name">{(id) => <TextInput id={id} value={m.customerName} onChange={(e) => set("customerName", e.target.value)} />}</Field>
          <Field label="Phone">{(id) => <TextInput id={id} value={m.phone} onChange={(e) => set("phone", e.target.value)} />}</Field>
          <Field label="Email">{(id) => <TextInput id={id} type="email" value={m.email} onChange={(e) => set("email", e.target.value)} />}</Field>
          <Field label="Move type">
            {(id) => (
              <SelectInput id={id} value={m.moveType} onChange={(e) => set("moveType", e.target.value)}>
                {MOVE_TYPES.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </SelectInput>
            )}
          </Field>
          <Field label="Move date">{(id) => <TextInput id={id} type="date" value={m.moveDate} onChange={(e) => set("moveDate", e.target.value)} />}</Field>
        </div>
        <div className="mt-3">
          <div className="mb-1 text-xs font-semibold text-ink-600">Arrival window</div>
          <div className="flex flex-wrap gap-1.5">
            {TIME_SLOTS.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => set("timeSlot", s.id)}
                className={`rounded-sm border-2 px-3 py-1.5 text-left cursor-pointer ${s.card} ${m.timeSlot === s.id ? "ring-2 ring-teal-500 ring-offset-2" : "opacity-70 hover:opacity-100"}`}
              >
                <span className={`flex items-center gap-1.5 text-xs font-bold ${s.text}`}>
                  <span className={`h-2 w-2 rounded-pill ${s.dot}`} />
                  {s.label}
                </span>
                <span className="text-[11px] text-ink-600">{s.window}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <AccessBlock title="Pickup" value={m.pickup} onChange={(v) => set("pickup", v)} />
        <AccessBlock title="Drop-off" value={m.dropoff} onChange={(v) => set("dropoff", v)} />
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <Field label="Extra stops">{(id) => <NumberInput id={id} value={m.extraStops} onChange={(n) => set("extraStops", n)} />}</Field>
        <Field label="Distance pickup → drop-off" hint="Adds drive time to the labour estimate.">
          {(id) => <NumberInput id={id} value={m.distanceKm} suffix="km" onChange={(n) => set("distanceKm", n)} />}
        </Field>
        <Field label="Notes" className="sm:col-span-3">
          {(id) => <TextArea id={id} rows={3} value={m.notes} onChange={(e) => set("notes", e.target.value)} placeholder="Special items, access codes, parking permits…" />}
        </Field>
      </div>
    </div>
  );
}

// ─────────────────────────────── 2. Inventory ───────────────────────────────

export function InventoryStep({ data, change }: StepProps) {
  const rooms = Object.keys(ITEM_LIBRARY);
  const [room, setRoom] = useState(rooms[0]);
  const [custom, setCustom] = useState({ name: "", m3: 0.3 });
  const items = data.inventory;
  const size = data.moveInfo.pickup.bedrooms;
  const typicalKey = TYPICAL_INVENTORY[size] ? size : null;

  function add(roomName: string, name: string, m3: number, qty = 1) {
    const i = items.findIndex((x) => x.room === roomName && x.name === name);
    if (i >= 0) {
      const next = [...items];
      next[i] = { ...next[i], qty: next[i].qty + qty };
      change("inventory", next);
    } else {
      change("inventory", [...items, { room: roomName, name, qty, cubicMetres: m3, special: roomName === "Special items" }]);
    }
  }

  function loadTypical(key: string) {
    let next = [...items];
    for (const [r, name, qty] of TYPICAL_INVENTORY[key]) {
      const m3 = ITEM_LIBRARY[r]?.find((x) => x.name === name)?.m3 ?? 0.3;
      const i = next.findIndex((x) => x.room === r && x.name === name);
      if (i >= 0) next[i] = { ...next[i], qty: next[i].qty + qty };
      else next = [...next, { room: r, name, qty, cubicMetres: m3, special: false }];
    }
    change("inventory", next);
  }

  const setItem = (idx: number, patch: Partial<InventoryItem>) => {
    const next = [...items];
    next[idx] = { ...next[idx], ...patch };
    change("inventory", next.filter((x) => x.qty > 0));
  };

  const volume = inventoryVolume(items);
  const grouped = [...new Set(items.map((i) => i.room))];

  return (
    <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
      <div>
        <H sub="Tap an item to add it. Tap again to add another.">Item library</H>
        {typicalKey && (
          <Btn variant="outline" size="sm" className="mb-3" onClick={() => loadTypical(typicalKey)}>
            ⚡ Load typical {typicalKey} inventory
          </Btn>
        )}
        {!typicalKey && (
          <div className="mb-3 flex flex-wrap gap-1">
            {Object.keys(TYPICAL_INVENTORY).map((k) => (
              <Btn key={k} variant="outline" size="sm" onClick={() => loadTypical(k)}>
                ⚡ Typical {k}
              </Btn>
            ))}
          </div>
        )}
        <div className="mb-2 flex flex-wrap gap-1">
          {rooms.map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRoom(r)}
              className={`rounded-pill border px-2.5 py-1 text-xs font-semibold cursor-pointer ${room === r ? "border-teal-500 bg-teal-50 text-teal-600" : "border-border bg-white text-ink-600"}`}
            >
              {r}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-3">
          {ITEM_LIBRARY[room].map((it) => {
            const count = items.find((x) => x.room === room && x.name === it.name)?.qty ?? 0;
            return (
              <button
                key={it.name}
                type="button"
                onClick={() => add(room, it.name, it.m3)}
                className={`relative rounded-sm border px-2.5 py-2 text-left text-xs cursor-pointer hover:border-teal-500 ${count ? "border-teal-200 bg-teal-50" : "border-border bg-white"}`}
              >
                <div className="font-semibold text-ink-800">{it.name}</div>
                <div className="text-ink-400">{it.m3} m³</div>
                {count > 0 && <span className="absolute right-1.5 top-1.5 rounded-pill bg-teal-500 px-1.5 text-[10px] font-bold text-white">{count}</span>}
              </button>
            );
          })}
        </div>
        <div className="mt-4 rounded-md border border-dashed border-border p-3">
          <div className="mb-2 text-xs font-semibold text-ink-600">Custom item in “{room}”</div>
          <div className="flex gap-2">
            <TextInput placeholder="e.g. Marble statue" value={custom.name} onChange={(e) => setCustom({ ...custom, name: e.target.value })} />
            <NumberInput value={custom.m3} step={0.05} suffix="m³" onChange={(n) => setCustom({ ...custom, m3: n })} className="w-32 shrink-0" />
            <Btn
              variant="outline"
              disabled={!custom.name.trim()}
              onClick={() => {
                add(room, custom.name.trim(), custom.m3);
                setCustom({ name: "", m3: 0.3 });
              }}
            >
              Add
            </Btn>
          </div>
        </div>
      </div>

      <div>
        <H sub={`${items.reduce((s, i) => s + i.qty, 0)} items · ${volume} m³`}>Customer inventory</H>
        {items.length === 0 ? (
          <div className="rounded-md border border-dashed border-border p-8 text-center text-sm text-ink-400">No items yet.</div>
        ) : (
          <div className="overflow-hidden rounded-md border border-border">
            <table className="w-full border-collapse text-sm">
              <thead className="bg-gray-50 text-left text-[11px] uppercase tracking-wide text-ink-400">
                <tr>
                  <th className="px-3 py-2">Item</th>
                  <th className="px-2 py-2 w-28">Qty</th>
                  <th className="px-2 py-2 w-24">m³ each</th>
                  <th className="px-2 py-2 w-16 text-center" title="Fragile / heavy / special handling">Special</th>
                  <th className="w-8" />
                </tr>
              </thead>
              <tbody>
                {grouped.map((r) => (
                  <RoomRows key={r} room={r} items={items} setItem={setItem} />
                ))}
              </tbody>
            </table>
          </div>
        )}
        {items.length > 0 && (
          <div className="mt-2 flex justify-end">
            <Btn variant="ghost" size="sm" onClick={() => change("inventory", [])}>
              Clear inventory
            </Btn>
          </div>
        )}
      </div>
    </div>
  );
}

function RoomRows({ room, items, setItem }: { room: string; items: InventoryItem[]; setItem: (i: number, p: Partial<InventoryItem>) => void }) {
  const rows = items.map((it, idx) => ({ it, idx })).filter(({ it }) => it.room === room);
  const vol = rows.reduce((s, { it }) => s + it.qty * it.cubicMetres, 0);
  return (
    <>
      <tr className="bg-gray-50/60">
        <td colSpan={5} className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide text-ink-600">
          {room} <span className="font-normal text-ink-400">· {Math.round(vol * 100) / 100} m³</span>
        </td>
      </tr>
      {rows.map(({ it, idx }) => (
        <tr key={`${it.room}-${it.name}`} className="border-t border-border">
          <td className="px-3 py-1.5 text-ink-800">{it.name}</td>
          <td className="px-2 py-1.5">
            <div className="flex items-center gap-1">
              <button type="button" className="h-6 w-6 rounded-sm border border-border cursor-pointer" onClick={() => setItem(idx, { qty: it.qty - 1 })} aria-label="Less">
                −
              </button>
              <span className="w-7 text-center tabular-nums">{it.qty}</span>
              <button type="button" className="h-6 w-6 rounded-sm border border-border cursor-pointer" onClick={() => setItem(idx, { qty: it.qty + 1 })} aria-label="More">
                +
              </button>
            </div>
          </td>
          <td className="px-2 py-1.5">
            <NumberInput value={it.cubicMetres} step={0.05} onChange={(n) => setItem(idx, { cubicMetres: n })} />
          </td>
          <td className="px-2 py-1.5 text-center">
            <input type="checkbox" className="accent-teal-500" checked={it.special} onChange={(e) => setItem(idx, { special: e.target.checked })} aria-label="Special handling" />
          </td>
          <td className="pr-2 text-right">
            <button type="button" onClick={() => setItem(idx, { qty: 0 })} className="text-ink-400 hover:text-danger cursor-pointer" aria-label="Remove">
              ×
            </button>
          </td>
        </tr>
      ))}
    </>
  );
}

// ─────────────────────────────── 3. Materials ───────────────────────────────

function LinesEditor({
  lines,
  onChange,
  presets,
  addLabel,
}: {
  lines: Line[];
  onChange: (l: Line[]) => void;
  presets: { name: string; unitPrice: number }[];
  addLabel: string;
}) {
  const add = (name: string, unitPrice: number, qty = 1) => {
    const i = lines.findIndex((l) => l.name === name);
    if (i >= 0) {
      const next = [...lines];
      next[i] = { ...next[i], qty: next[i].qty + qty };
      onChange(next);
    } else onChange([...lines, { name, qty, unitPrice }]);
  };
  const set = (i: number, p: Partial<Line>) => {
    const next = [...lines];
    next[i] = { ...next[i], ...p };
    onChange(next);
  };
  return (
    <div>
      <div className="mb-3 flex flex-wrap gap-1.5">
        {presets.map((p) => (
          <button
            key={p.name}
            type="button"
            onClick={() => add(p.name, p.unitPrice)}
            className="rounded-pill border border-border bg-white px-2.5 py-1 text-xs font-semibold text-ink-600 hover:border-teal-500 cursor-pointer"
          >
            + {p.name} <span className="text-ink-400">{money(p.unitPrice, true)}</span>
          </button>
        ))}
        <button
          type="button"
          onClick={() => onChange([...lines, { name: "", qty: 1, unitPrice: 0 }])}
          className="rounded-pill border border-dashed border-ink-400 px-2.5 py-1 text-xs font-semibold text-ink-600 cursor-pointer"
        >
          + {addLabel}
        </button>
      </div>
      {lines.length > 0 && (
        <div className="overflow-hidden rounded-md border border-border">
          <table className="w-full border-collapse text-sm">
            <thead className="bg-gray-50 text-left text-[11px] uppercase tracking-wide text-ink-400">
              <tr>
                <th className="px-3 py-2">Item</th>
                <th className="w-24 px-2 py-2">Qty</th>
                <th className="w-32 px-2 py-2">Unit price</th>
                <th className="w-24 px-2 py-2 text-right">Total</th>
                <th className="w-8" />
              </tr>
            </thead>
            <tbody>
              {lines.map((l, i) => (
                <tr key={i} className="border-t border-border">
                  <td className="px-2 py-1.5">
                    <TextInput value={l.name} onChange={(e) => set(i, { name: e.target.value })} placeholder="Description" />
                  </td>
                  <td className="px-2 py-1.5">
                    <NumberInput value={l.qty} onChange={(n) => set(i, { qty: n })} />
                  </td>
                  <td className="px-2 py-1.5">
                    <NumberInput value={l.unitPrice} step={0.5} prefix="$" onChange={(n) => set(i, { unitPrice: n })} />
                  </td>
                  <td className="px-2 py-1.5 text-right tabular-nums">{money(l.qty * l.unitPrice, true)}</td>
                  <td className="pr-2 text-right">
                    <button type="button" onClick={() => onChange(lines.filter((_, j) => j !== i))} className="text-ink-400 hover:text-danger cursor-pointer" aria-label="Remove">
                      ×
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-ink-800 font-semibold">
                <td colSpan={3} className="px-3 py-2 text-right">
                  Subtotal
                </td>
                <td className="px-2 py-2 text-right tabular-nums">{money(lines.reduce((s, l) => s + l.qty * l.unitPrice, 0), true)}</td>
                <td />
              </tr>
            </tfoot>
          </table>
        </div>
      )}
    </div>
  );
}

/** Rough materials list from the inventory (boxes, tape, mattress bags). */
function suggestMaterials(items: InventoryItem[]): Line[] {
  const count = (pred: (i: InventoryItem) => boolean) => items.filter(pred).reduce((s, i) => s + i.qty, 0);
  const price = (n: string) => MATERIAL_PRESETS.find((p) => p.name === n)?.unitPrice ?? 0;
  const small = count((i) => i.name.startsWith("Box (small"));
  const medium = count((i) => i.name.startsWith("Box (medium"));
  const large = count((i) => i.name.startsWith("Box (large"));
  const wardrobe = count((i) => i.name === "Wardrobe box");
  const bigBeds = count((i) => /^(Queen|King) bed/.test(i.name));
  const singleBeds = count((i) => /^Single bed/.test(i.name));
  const tvs = count((i) => i.name.startsWith("TV ("));
  const boxes = small + medium + large;
  const out: Line[] = [];
  if (small) out.push({ name: "Small box", qty: small, unitPrice: price("Small box") });
  if (medium) out.push({ name: "Medium box", qty: medium, unitPrice: price("Medium box") });
  if (large) out.push({ name: "Large box", qty: large, unitPrice: price("Large box") });
  if (wardrobe) out.push({ name: "Wardrobe box", qty: wardrobe, unitPrice: price("Wardrobe box") });
  if (boxes) out.push({ name: "Packing tape (roll)", qty: Math.ceil(boxes / 12), unitPrice: price("Packing tape (roll)") });
  if (bigBeds) out.push({ name: "Mattress bag (queen/king)", qty: bigBeds, unitPrice: price("Mattress bag (queen/king)") });
  if (singleBeds) out.push({ name: "Mattress bag (single)", qty: singleBeds, unitPrice: price("Mattress bag (single)") });
  if (tvs) out.push({ name: "TV box", qty: tvs, unitPrice: price("TV box") });
  return out;
}

export function MaterialsStep({ data, change }: StepProps) {
  const suggestion = suggestMaterials(data.inventory);
  return (
    <div>
      <H sub="Boxes, tape, wrap and bags supplied to the customer.">Packing materials</H>
      {suggestion.length > 0 && (
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2 rounded-md border border-teal-200 bg-teal-50 px-4 py-3 text-sm">
          <span className="text-teal-600">
            From the inventory: {suggestion.map((s) => `${s.qty}× ${s.name}`).join(", ")}
          </span>
          <Btn size="sm" onClick={() => change("materials", suggestion)}>
            Use suggestion
          </Btn>
        </div>
      )}
      <LinesEditor lines={data.materials} onChange={(l) => change("materials", l)} presets={MATERIAL_PRESETS} addLabel="Custom material" />
    </div>
  );
}

// ─────────────────────────────── 4. Labour ───────────────────────────────

export function LabourStep({ data, change }: StepProps) {
  const l = data.labour;
  const set = <K extends keyof EstimateData["labour"]>(k: K, v: EstimateData["labour"][K]) => change("labour", { ...l, [k]: v });
  const volume = inventoryVolume(data.inventory);
  const s = suggestLabour(data.moveInfo, volume);
  const specials = data.inventory.filter((i) => i.special).reduce((a, i) => a + i.qty, 0);
  const rateCard = standardHourlyRate(l.truckSize, l.crewSize, l.trucks);
  const stairFloors =
    (data.moveInfo.pickup.access === "Stairs" ? data.moveInfo.pickup.floor : 0) +
    (data.moveInfo.dropoff.access === "Stairs" ? data.moveInfo.dropoff.floor : 0);

  return (
    <div className="flex flex-col gap-5">
      <div className="rounded-md border border-teal-200 bg-teal-50 p-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wide text-teal-600">Recommended from {volume} m³ inventory</div>
            <div className="mt-1 font-display text-lg font-bold text-ink-800">
              {s.crewSize} removalists · {s.trucks} × {s.truckSize} truck · {s.estimatedHours} hrs @ {money(s.hourlyRate)}/hr
            </div>
            <div className="mt-1 text-xs text-ink-600">
              Load/unload {s.workHours} h (access factor ×{s.factor}) + drive {s.driveHours} h + stops {s.stopHours} h · rounded to ¼ hr, minimum 2 h
            </div>
          </div>
          <Btn
            onClick={() =>
              change("labour", {
                ...l,
                crewSize: s.crewSize,
                trucks: s.trucks,
                truckSize: s.truckSize,
                hourlyRate: s.hourlyRate,
                estimatedHours: s.estimatedHours,
                stairFee: l.stairFee || stairFloors * 25,
                heavyItemFee: l.heavyItemFee || specials * 50,
              })
            }
          >
            Apply recommendation
          </Btn>
        </div>
        {volume === 0 && <div className="mt-2 text-xs text-amber-800">Add inventory in step ② for an accurate recommendation.</div>}
      </div>

      <div>
        <H>Crew & trucks</H>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <Field label="Crew size">{(id) => <NumberInput id={id} min={1} value={l.crewSize} suffix="movers" onChange={(n) => set("crewSize", n)} />}</Field>
          <Field label="Trucks">{(id) => <NumberInput id={id} value={l.trucks} onChange={(n) => set("trucks", n)} />}</Field>
          <Field label="Truck size">
            {(id) => (
              <SelectInput id={id} value={l.truckSize} onChange={(e) => set("truckSize", e.target.value)}>
                {TRUCKS.map((t) => (
                  <option key={t.size} value={t.size}>
                    {t.size} ({t.capacity} m³)
                  </option>
                ))}
              </SelectInput>
            )}
          </Field>
          <Field
            label="Hourly rate"
            hint={
              l.hourlyRate !== rateCard ? (
                <button type="button" className="text-teal-500 underline cursor-pointer" onClick={() => set("hourlyRate", rateCard)}>
                  Rate card: {money(rateCard)}/hr — use
                </button>
              ) : (
                "Matches rate card"
              )
            }
          >
            {(id) => <NumberInput id={id} prefix="$" suffix="/hr" value={l.hourlyRate} onChange={(n) => set("hourlyRate", n)} />}
          </Field>
        </div>
      </div>

      <div>
        <H>Time</H>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <Field label="Moving hours (est.)" hint="Billed in 30-min increments">
            {(id) => <NumberInput id={id} step={0.5} value={l.estimatedHours} suffix="hrs" onChange={(n) => set("estimatedHours", n)} />}
          </Field>
          <Field label="Call-out (depot travel)" hint={`Standard: ${CALL_OUT_HOURS} hr at the hourly rate`}>
            {(id) => <NumberInput id={id} step={0.5} value={l.travelHours} suffix="hrs" onChange={(n) => set("travelHours", n)} />}
          </Field>
          <Field label="Minimum hours" hint={`Standard: ${MINIMUM_HOURS} hrs`}>
            {(id) => <NumberInput id={id} step={0.5} value={l.minimumHours} suffix="hrs" onChange={(n) => set("minimumHours", n)} />}
          </Field>
        </div>
      </div>

      <div>
        <H>Packing & handling</H>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <Field label="Packing service hours">{(id) => <NumberInput id={id} step={0.5} value={l.packingHours} suffix="hrs" onChange={(n) => set("packingHours", n)} />}</Field>
          <Field label="Packing rate">{(id) => <NumberInput id={id} prefix="$" suffix="/hr" value={l.packingRate} onChange={(n) => set("packingRate", n)} />}</Field>
          <Field label="Stairs fee" hint={stairFloors ? `${stairFloors} flight(s) of stairs` : undefined}>
            {(id) => <NumberInput id={id} prefix="$" value={l.stairFee} onChange={(n) => set("stairFee", n)} />}
          </Field>
          <Field label="Heavy / special items" hint={specials ? `${specials} special item(s)` : undefined}>
            {(id) => <NumberInput id={id} prefix="$" value={l.heavyItemFee} onChange={(n) => set("heavyItemFee", n)} />}
          </Field>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────── 5. Storage ───────────────────────────────

export function StorageStep({ data, change }: StepProps) {
  const s = data.storage;
  const set = <K extends keyof EstimateData["storage"]>(k: K, v: EstimateData["storage"][K]) => change("storage", { ...s, [k]: v });
  return (
    <div>
      <H sub="Short or long-term storage between pickup and delivery.">Storage</H>
      <label className="mb-4 flex w-fit items-center gap-3 rounded-[12px] border border-border bg-white px-4 py-3 text-sm font-semibold cursor-pointer">
        <input type="checkbox" className="accent-teal-500" checked={s.required} onChange={(e) => set("required", e.target.checked)} />
        Customer needs storage
      </label>
      {s.required ? (
        <>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            <Field label="Storage units / modules">{(id) => <NumberInput id={id} value={s.units} onChange={(n) => set("units", n)} />}</Field>
            <Field label="Duration">{(id) => <NumberInput id={id} value={s.weeks} suffix="weeks" onChange={(n) => set("weeks", n)} />}</Field>
            <Field label="Rate per unit">{(id) => <NumberInput id={id} prefix="$" suffix="/wk" value={s.weeklyRate} onChange={(n) => set("weeklyRate", n)} />}</Field>
            <Field label="Handling / in-out fee">{(id) => <NumberInput id={id} prefix="$" value={s.handlingFee} onChange={(n) => set("handlingFee", n)} />}</Field>
          </div>
          <div className="mt-4 text-sm text-ink-600">
            {s.units} unit × {s.weeks} weeks × {money(s.weeklyRate)} + {money(s.handlingFee)} handling ={" "}
            <span className="font-display text-lg font-bold text-ink-800">{money(storageTotal(s), true)}</span>
          </div>
        </>
      ) : (
        <div className="text-sm text-ink-400">No storage on this quote. Skip to the quotation.</div>
      )}
    </div>
  );
}

// ─────────────────────────────── 6. Quotation ───────────────────────────────

export function QuotationStep({ data, change }: StepProps) {
  const q = data.quotation;
  const l = data.labour;
  const setQ = <K extends keyof EstimateData["quotation"]>(k: K, v: EstimateData["quotation"][K]) => change("quotation", { ...q, [k]: v });
  const setL = <K extends keyof EstimateData["labour"]>(k: K, v: EstimateData["labour"][K]) => change("labour", { ...l, [k]: v });
  const t = computeQuote(data);

  return (
    <div className="flex flex-col gap-5">
      <div>
        <Segmented
          value={q.pricingType}
          onChange={(p) => {
            if (p === "fixed" && !q.fixedPrice) change("quotation", { ...q, pricingType: p, fixedPrice: Math.round(t.labourCost + t.movingFee) });
            else setQ("pricingType", p);
          }}
          items={[
            { id: "hourly", label: "Hourly rate" },
            { id: "fixed", label: "Fixed price" },
          ]}
        />
      </div>

      {q.pricingType === "hourly" ? (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
          <Field label="Hourly rate">{(id) => <NumberInput id={id} prefix="$" suffix="/hr" value={l.hourlyRate} onChange={(n) => setL("hourlyRate", n)} />}</Field>
          <Field label="Crew size">{(id) => <NumberInput id={id} min={1} value={l.crewSize} onChange={(n) => setL("crewSize", n)} />}</Field>
          <Field label="Trucks">{(id) => <NumberInput id={id} value={l.trucks} onChange={(n) => setL("trucks", n)} />}</Field>
          <Field label="Moving hours" hint="30-min increments">
            {(id) => <NumberInput id={id} step={0.5} value={l.estimatedHours} suffix="hrs" onChange={(n) => setL("estimatedHours", n)} />}
          </Field>
          <Field label="Minimum hours">{(id) => <NumberInput id={id} step={0.5} value={l.minimumHours} suffix="hrs" onChange={(n) => setL("minimumHours", n)} />}</Field>
          <Field label="Call-out (travel)" hint={`${money(l.travelHours * l.hourlyRate)} at hourly rate`}>
            {(id) => <NumberInput id={id} step={0.5} value={l.travelHours} suffix="hrs" onChange={(n) => setL("travelHours", n)} />}
          </Field>
          <Field label="Moving fee (flat)" hint="Optional extra flat fee">
            {(id) => <NumberInput id={id} prefix="$" value={q.movingFee} onChange={(n) => setQ("movingFee", n)} />}
          </Field>
          <Field label="Quote range ±" hint="Shown to the customer as a price range">
            {(id) => <NumberInput id={id} step={0.5} value={q.hoursSpread} suffix="hrs" onChange={(n) => setQ("hoursSpread", n)} />}
          </Field>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <Field label="Fixed moving price" hint="Covers labour, trucks and travel for the listed inventory">
            {(id) => <NumberInput id={id} prefix="$" value={q.fixedPrice} onChange={(n) => setQ("fixedPrice", n)} />}
          </Field>
          <Field label="Crew size">{(id) => <NumberInput id={id} min={1} value={l.crewSize} onChange={(n) => setL("crewSize", n)} />}</Field>
          <Field label="Trucks">{(id) => <NumberInput id={id} value={l.trucks} onChange={(n) => setL("trucks", n)} />}</Field>
          <Field label="Planned hours (internal)">{(id) => <NumberInput id={id} step={0.25} value={l.estimatedHours} suffix="hrs" onChange={(n) => setL("estimatedHours", n)} />}</Field>
        </div>
      )}

      <div>
        <H sub="Surcharges and add-ons.">Additional fees</H>
        <LinesEditor lines={q.extraFees} onChange={(v) => setQ("extraFees", v)} presets={FEE_PRESETS} addLabel="Custom fee" />
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
        <Field label="Fuel levy">{(id) => <NumberInput id={id} prefix="$" value={q.fuelLevy} onChange={(n) => setQ("fuelLevy", n)} />}</Field>
        <Field label="Discount">
          {(id) => (
            <div className="flex gap-1">
              <NumberInput id={id} value={q.discount} onChange={(n) => setQ("discount", n)} className="flex-1" />
              <SelectInput value={q.discountType} onChange={(e) => setQ("discountType", e.target.value as "amount" | "percent")} className="w-20 shrink-0" aria-label="Discount type" fieldClassName="!px-3 !pr-8">
                <option value="amount">$</option>
                <option value="percent">%</option>
              </SelectInput>
            </div>
          )}
        </Field>
        <Field label="Deposit">{(id) => <NumberInput id={id} value={q.depositPercent} suffix="%" onChange={(n) => setQ("depositPercent", n)} />}</Field>
        <Field label="Valid for">{(id) => <NumberInput id={id} value={q.validDays} suffix="days" onChange={(n) => setQ("validDays", n)} />}</Field>
        <label className="flex items-end gap-2 pb-2 text-sm font-semibold">
          <input type="checkbox" className="accent-teal-500" checked={q.includeGst} onChange={(e) => setQ("includeGst", e.target.checked)} /> Add GST (10%)
        </label>
      </div>

      <Field label="Terms shown on the quote">{(id) => <TextArea id={id} rows={4} value={q.terms} onChange={(e) => setQ("terms", e.target.value)} />}</Field>
    </div>
  );
}
