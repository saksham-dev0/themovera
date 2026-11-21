"use client";

import { computeQuote, type EstimateData } from "@/convex/crm/quoteMath";
import { slotMeta } from "@/lib/crm/constants";
import { money, shortDate } from "@/lib/crm/format";

/** The customer-facing quotation document (also what gets printed / PDF'd). */
export function QuotePreview({ data, number, createdAt }: { data: EstimateData; number: number; createdAt: number }) {
  const t = computeQuote(data);
  const m = data.moveInfo;
  const l = data.labour;
  const q = data.quotation;
  const slot = slotMeta(m.timeSlot);
  const validUntil = new Date(createdAt + q.validDays * 86_400_000).toLocaleDateString("en-AU", { day: "numeric", month: "long", year: "numeric" });

  const rows: [string, string, number][] = [];
  if (q.pricingType === "hourly") {
    rows.push([
      `Labour — ${l.crewSize} removalists + ${l.trucks} × ${l.truckSize} truck`,
      `${t.billableHours} hrs × ${money(l.hourlyRate, true)}${l.travelHours ? ` (incl. ${l.travelHours} h travel)` : ""}`,
      t.labourCost,
    ]);
    if (t.movingFee) rows.push(["Call-out / travel fee", "", t.movingFee]);
  } else {
    rows.push([`Fixed price move — ${l.crewSize} removalists + ${l.trucks} × ${l.truckSize} truck`, "", t.labourCost]);
  }
  if (t.packingCost) rows.push(["Packing service", `${l.packingHours} hrs × ${money(l.packingRate, true)}`, t.packingCost]);
  if (l.stairFee) rows.push(["Stairs handling", "", l.stairFee]);
  if (l.heavyItemFee) rows.push(["Heavy / special item handling", "", l.heavyItemFee]);
  for (const mat of data.materials) rows.push([mat.name || "Material", `${mat.qty} × ${money(mat.unitPrice, true)}`, mat.qty * mat.unitPrice]);
  if (t.storageTotal) rows.push(["Storage", `${data.storage.units} unit × ${data.storage.weeks} wks × ${money(data.storage.weeklyRate)}${data.storage.handlingFee ? " + handling" : ""}`, t.storageTotal]);
  for (const f of q.extraFees) rows.push([f.name || "Fee", f.qty !== 1 ? `${f.qty} × ${money(f.unitPrice, true)}` : "", f.qty * f.unitPrice]);
  if (t.fuelLevy) rows.push(["Fuel levy", "", t.fuelLevy]);

  return (
    <div id="quote-print" className="rounded-[12px] border border-border bg-white p-6 text-sm text-ink-800 sm:p-8">
      <div className="flex flex-wrap items-start justify-between gap-4 border-b-2 border-ink-900 pb-4">
        <div>
          <div className="font-display text-2xl font-bold tracking-[3px] text-ink-800">MOVERA</div>
          <div className="text-xs text-ink-400">Melbourne Removalists · 03 7074 1820 · themovera.com.au</div>
        </div>
        <div className="text-right">
          <div className="font-display text-lg font-bold text-ink-800">Quotation Q-{number}</div>
          <div className="text-xs text-ink-400">Valid until {validUntil}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 py-4 sm:grid-cols-3">
        <div>
          <div className="text-[11px] font-bold uppercase tracking-wide text-ink-400">Prepared for</div>
          <div className="font-semibold">{m.customerName}</div>
          <div className="text-xs">{m.phone}</div>
          <div className="text-xs">{m.email}</div>
        </div>
        <div>
          <div className="text-[11px] font-bold uppercase tracking-wide text-ink-400">Move</div>
          <div className="font-semibold">
            {shortDate(m.moveDate)} · {m.moveType}
          </div>
          <div className="text-xs">
            Arrival: {slot.label} ({slot.window})
          </div>
          {t.volume > 0 && (
            <div className="text-xs">
              {t.itemCount} items · approx. {t.volume} m³
            </div>
          )}
        </div>
        <div>
          <div className="text-[11px] font-bold uppercase tracking-wide text-ink-400">Route</div>
          <div className="text-xs">
            <b>From:</b> {m.pickup.address || "—"} {m.pickup.access !== "Ground" && `(${m.pickup.access}${m.pickup.floor ? `, level ${m.pickup.floor}` : ""})`}
          </div>
          <div className="text-xs">
            <b>To:</b> {m.dropoff.address || "—"} {m.dropoff.access !== "Ground" && `(${m.dropoff.access}${m.dropoff.floor ? `, level ${m.dropoff.floor}` : ""})`}
          </div>
          {m.extraStops > 0 && <div className="text-xs">+ {m.extraStops} extra stop(s)</div>}
        </div>
      </div>

      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-border text-left text-[11px] uppercase tracking-wide text-ink-400">
            <th className="py-2">Description</th>
            <th className="py-2">Detail</th>
            <th className="py-2 text-right">Amount</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(([a, b, c], i) => (
            <tr key={i} className="border-b border-border/60">
              <td className="py-2 pr-2">{a}</td>
              <td className="py-2 pr-2 text-xs text-ink-600">{b}</td>
              <td className="py-2 text-right tabular-nums">{money(c, true)}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan={2} className="pt-3 text-right">Subtotal</td>
            <td className="pt-3 text-right tabular-nums">{money(t.subtotal, true)}</td>
          </tr>
          {t.discount > 0 && (
            <tr>
              <td colSpan={2} className="text-right text-teal-500">
                Discount{q.discountType === "percent" ? ` (${q.discount}%)` : ""}
              </td>
              <td className="text-right tabular-nums text-teal-500">−{money(t.discount, true)}</td>
            </tr>
          )}
          {t.gst > 0 && (
            <tr>
              <td colSpan={2} className="text-right">GST (10%)</td>
              <td className="text-right tabular-nums">{money(t.gst, true)}</td>
            </tr>
          )}
          <tr>
            <td colSpan={2} className="pt-2 text-right font-display text-base font-bold text-ink-800">
              {t.low !== t.high ? "Estimated total" : "Total"} {q.includeGst ? "(inc. GST)" : ""}
            </td>
            <td className="pt-2 text-right font-display text-lg font-bold text-teal-500 tabular-nums whitespace-nowrap">
              {money(t.total, true)}
            </td>
          </tr>
          {t.low !== t.high && (
            <tr>
              <td colSpan={3} className="pt-1 text-right text-xs text-ink-600">
                Likely range {money(t.low)} – {money(t.high)} depending on final hours (±{q.hoursSpread} h)
              </td>
            </tr>
          )}
          {t.deposit > 0 && (
            <tr>
              <td colSpan={2} className="pt-1 text-right text-xs text-ink-600">Deposit to secure your date ({q.depositPercent}%)</td>
              <td className="pt-1 text-right text-xs tabular-nums">{money(t.deposit, true)}</td>
            </tr>
          )}
        </tfoot>
      </table>

      <div className="mt-6 rounded-sm bg-gray-50 p-3 text-[11px] leading-relaxed text-ink-600">{q.terms}</div>
    </div>
  );
}
