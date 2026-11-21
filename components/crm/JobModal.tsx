"use client";

import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Doc, Id } from "@/convex/_generated/dataModel";
import type { FunctionReturnType } from "convex/server";
import { useCan, useSession } from "./session";
import { Btn, Field, Modal, NumberInput, SelectInput, TextArea, TextInput, errorText } from "./ui";
import { JOB_STATUSES, RESOURCE_KINDS, TIME_SLOTS, slotMeta, type JobStatus, type TimeSlot } from "@/lib/crm/constants";
import { shortDate, smsHref } from "@/lib/crm/format";
import { TRUCKS } from "@/convex/crm/quoteMath";

export type JobDraft = {
  jobId?: Id<"jobs">;
  leadId: Id<"quoteRequests">;
  /** Only for new jobs: lets the form warn that scheduling books the lead. */
  leadStatus?: string;
  estimateId?: Id<"estimates">;
  customerName: string;
  customerPhone: string;
  date: string;
  timeSlot: TimeSlot;
  startTime: string;
  status: JobStatus;
  assigneeIds: Id<"resources">[];
  crewSize: number;
  trucks: number;
  truckSize: string;
  estimatedHours: number;
  pickupAddress: string;
  dropoffAddress: string;
  opsNotes: string;
};

export function draftFromJob(j: Doc<"jobs">): JobDraft {
  return {
    jobId: j._id,
    leadId: j.leadId,
    estimateId: j.estimateId,
    customerName: j.customerName,
    customerPhone: j.customerPhone,
    date: j.date,
    timeSlot: j.timeSlot,
    startTime: j.startTime ?? "",
    status: j.status,
    assigneeIds: j.assigneeIds,
    crewSize: j.crewSize,
    trucks: j.trucks,
    truckSize: j.truckSize ?? "",
    estimatedHours: j.estimatedHours,
    pickupAddress: j.pickupAddress,
    dropoffAddress: j.dropoffAddress,
    opsNotes: j.opsNotes ?? "",
  };
}

export type SchedulingRow = FunctionReturnType<typeof api.crm.operations.assignableLeads>[number];

function guessSlot(pref: string | null): TimeSlot {
  if (!pref) return "morning";
  if (pref.startsWith("Early")) return "early";
  if (pref.startsWith("Midday")) return "midday";
  if (pref.startsWith("Afternoon")) return "afternoon";
  if (pref.startsWith("Evening")) return "evening";
  return "morning";
}

/** A new-job draft for a lead, with optional preset date / assignees. */
export function draftFromLead(r: SchedulingRow, preset: { date?: string; assigneeIds?: Id<"resources">[] } = {}): JobDraft {
  return {
    leadId: r.leadId,
    leadStatus: r.status,
    estimateId: r.estimateId ?? undefined,
    customerName: r.name,
    customerPhone: r.phone,
    date: preset.date ?? (/^\d{4}-\d{2}-\d{2}$/.test(r.moveDate) ? r.moveDate : ""),
    timeSlot: r.timeSlot ?? guessSlot(r.preferredTime),
    startTime: "",
    status: preset.assigneeIds?.length ? "assigned" : "unassigned",
    assigneeIds: preset.assigneeIds ?? [],
    crewSize: r.crewSize,
    trucks: r.trucks,
    truckSize: r.truckSize,
    estimatedHours: r.estimatedHours,
    pickupAddress: r.movingFrom,
    dropoffAddress: r.movingTo,
    opsNotes: "",
  };
}

function jobSheet(d: JobDraft, names: string[]) {
  const slot = slotMeta(d.timeSlot);
  return [
    `MOVERA JOB — ${shortDate(d.date)}`,
    `Arrival: ${slot.label} ${slot.window}${d.startTime ? ` (start ${d.startTime})` : ""}`,
    `Customer: ${d.customerName} ${d.customerPhone}`,
    `Pickup: ${d.pickupAddress}`,
    `Drop-off: ${d.dropoffAddress}`,
    `Crew: ${d.crewSize} · Trucks: ${d.trucks}${d.truckSize ? ` × ${d.truckSize}` : ""} · Est. ${d.estimatedHours} hrs`,
    names.length ? `Assigned: ${names.join(", ")}` : "",
    d.opsNotes ? `Notes: ${d.opsNotes}` : "",
  ]
    .filter(Boolean)
    .join("\n");
}

export function JobModal({ draft, onClose }: { draft: JobDraft | null; onClose: () => void }) {
  return draft ? <JobForm key={draft.jobId ?? draft.leadId} initial={draft} onClose={onClose} /> : null;
}

function JobForm({ initial, onClose }: { initial: JobDraft; onClose: () => void }) {
  const { token } = useSession();
  const can = useCan();
  const editable = can("operations");
  const [d, setD] = useState<JobDraft>(initial);
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState(false);
  const resources = useQuery(api.crm.operations.listResources, { token });
  const conflicts = useQuery(
    api.crm.operations.checkConflicts,
    d.date ? { token, date: d.date, timeSlot: d.timeSlot, assigneeIds: d.assigneeIds, jobId: d.jobId } : "skip",
  );
  const createJob = useMutation(api.crm.operations.createJob);
  const updateJob = useMutation(api.crm.operations.updateJob);

  const set = <K extends keyof JobDraft>(k: K, v: JobDraft[K]) => {
    setCopied(false);
    setD((prev) => ({ ...prev, [k]: v }));
  };
  const toggle = (id: Id<"resources">) =>
    set("assigneeIds", d.assigneeIds.includes(id) ? d.assigneeIds.filter((x) => x !== id) : [...d.assigneeIds, id]);

  const assigned = (resources ?? []).filter((r) => d.assigneeIds.includes(r._id));

  async function save() {
    setBusy(true);
    setErr(null);
    const fields = {
      date: d.date,
      timeSlot: d.timeSlot,
      startTime: d.startTime || undefined,
      status: d.status,
      assigneeIds: d.assigneeIds,
      crewSize: d.crewSize,
      trucks: d.trucks,
      truckSize: d.truckSize || undefined,
      estimatedHours: d.estimatedHours,
      pickupAddress: d.pickupAddress,
      dropoffAddress: d.dropoffAddress,
      opsNotes: d.opsNotes || undefined,
    };
    try {
      if (d.jobId) await updateJob({ token, jobId: d.jobId, ...fields });
      else await createJob({ token, leadId: d.leadId, estimateId: d.estimateId, ...fields });
      onClose();
    } catch (e) {
      setErr(errorText(e));
    } finally {
      setBusy(false);
    }
  }

  const sheet = jobSheet(d, assigned.map((r) => r.name));

  return (
    <Modal
      open
      wide
      onClose={onClose}
      title={`${d.jobId ? "Job" : "Schedule job"} · ${d.customerName}`}
      footer={
        <>
          <Btn
            variant="outline"
            onClick={async () => {
              await navigator.clipboard.writeText(sheet);
              setCopied(true);
            }}
          >
            {copied ? "Copied ✓" : "Copy job sheet"}
          </Btn>
          <span className="flex-1" />
          <Btn variant="ghost" onClick={onClose}>
            Close
          </Btn>
          {editable && (
            <Btn onClick={save} disabled={busy || !d.date}>
              {busy ? "Saving…" : d.jobId ? "Save job" : "Schedule job"}
            </Btn>
          )}
        </>
      }
    >
      <fieldset disabled={!editable} className="m-0 grid min-w-0 grid-cols-1 gap-4 border-0 p-0 md:grid-cols-2">
        <div className="flex flex-col gap-3">
          <div className="grid grid-cols-2 gap-3">
            <Field label="Job date">{(id) => <TextInput id={id} type="date" value={d.date} onChange={(e) => set("date", e.target.value)} />}</Field>
            <Field label="Start time (optional)">
              {(id) => <TextInput id={id} type="time" value={d.startTime} onChange={(e) => set("startTime", e.target.value)} />}
            </Field>
          </div>
          <div>
            <div className="mb-1.5 font-display text-xs font-semibold text-ink-800">Arrival window</div>
            <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-3">
              {TIME_SLOTS.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => set("timeSlot", s.id)}
                  className={`rounded-sm border-[1.5px] px-2.5 py-2 text-left cursor-pointer transition-all ${s.card} ${
                    d.timeSlot === s.id ? "ring-2 ring-teal-500 ring-offset-2" : "opacity-75 hover:opacity-100"
                  }`}
                >
                  <div className={`flex items-center gap-1.5 text-xs font-bold ${s.text}`}>
                    <span className={`h-2 w-2 rounded-pill ${s.dot}`} />
                    {s.label}
                  </div>
                  <div className="text-[11px] text-ink-600">{s.window}</div>
                </button>
              ))}
            </div>
          </div>
          <Field label="Status">
            {(id) => (
              <SelectInput id={id} value={d.status} onChange={(e) => set("status", e.target.value as JobStatus)}>
                {JOB_STATUSES.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.label}
                  </option>
                ))}
              </SelectInput>
            )}
          </Field>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Field label="Crew">{(id) => <NumberInput id={id} value={d.crewSize} min={1} onChange={(n) => set("crewSize", n)} />}</Field>
            <Field label="Trucks">{(id) => <NumberInput id={id} value={d.trucks} onChange={(n) => set("trucks", n)} />}</Field>
            <Field label="Truck size">
              {(id) => (
                <SelectInput id={id} value={d.truckSize} onChange={(e) => set("truckSize", e.target.value)}>
                  <option value="">—</option>
                  {TRUCKS.map((t) => (
                    <option key={t.size}>{t.size}</option>
                  ))}
                </SelectInput>
              )}
            </Field>
            <Field label="Est. hours">{(id) => <NumberInput id={id} value={d.estimatedHours} step={0.25} onChange={(n) => set("estimatedHours", n)} />}</Field>
          </div>
          <Field label="Pickup">{(id) => <TextInput id={id} value={d.pickupAddress} onChange={(e) => set("pickupAddress", e.target.value)} />}</Field>
          <Field label="Drop-off">{(id) => <TextInput id={id} value={d.dropoffAddress} onChange={(e) => set("dropoffAddress", e.target.value)} />}</Field>
          <Field label="Notes for the crew">
            {(id) => <TextArea id={id} rows={3} value={d.opsNotes} onChange={(e) => set("opsNotes", e.target.value)} placeholder="Access codes, parking, fragile items, piano…" />}
          </Field>
        </div>

        <div className="flex min-w-0 flex-col gap-2">
          <div className="font-display text-xs font-semibold text-ink-800">Assign trucker / sub-contractor / crew</div>
          {resources === undefined ? (
            <div className="text-sm text-ink-400">Loading…</div>
          ) : resources.length === 0 ? (
            <div className="rounded-sm border border-dashed border-border p-4 text-sm text-ink-400">
              No crew yet — add truckers and sub-contractors in the “Crew & sub-contractors” tab.
            </div>
          ) : (
            <div className="flex max-h-[360px] flex-col gap-1 overflow-y-auto">
              {RESOURCE_KINDS.map((k) => {
                const group = resources.filter((r) => r.kind === k.id);
                if (!group.length) return null;
                return (
                  <div key={k.id} className="mb-2">
                    <div className="mb-1.5 font-display text-[11px] font-semibold uppercase tracking-[1.5px] text-ink-400">
                      {k.icon} {k.label}s
                    </div>
                    {group.map((r) => (
                      <label
                        key={r._id}
                        className={`mb-1 flex items-center gap-2.5 rounded-sm border-[1.5px] px-3 py-2 text-sm cursor-pointer ${
                          d.assigneeIds.includes(r._id) ? "border-teal-500 bg-teal-50" : "border-border bg-white hover:bg-gray-50"
                        }`}
                      >
                        <input type="checkbox" className="accent-teal-500" checked={d.assigneeIds.includes(r._id)} onChange={() => toggle(r._id)} />
                        <span className="min-w-0 flex-1">
                          <span className="font-semibold text-ink-800">{r.name}</span>
                          <span className="block truncate text-xs text-ink-400">
                            {[r.truckSize && `${r.truckSize} truck`, r.crewSize && `${r.crewSize} crew`, r.phone].filter(Boolean).join(" · ")}
                          </span>
                        </span>
                      </label>
                    ))}
                  </div>
                );
              })}
            </div>
          )}
          {conflicts && conflicts.length > 0 && (
            <div className="rounded-sm border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-900">
              <div className="font-semibold">Double-booking warning ({slotMeta(d.timeSlot).label})</div>
              {conflicts.map((c) => (
                <div key={c}>• {c}</div>
              ))}
            </div>
          )}
          {assigned.length > 0 && (
            <div className="mt-1 flex flex-wrap gap-1.5">
              {assigned.map((r) => (
                <a key={r._id} href={smsHref(r.phone, sheet)} className="rounded-pill border border-border bg-white px-2.5 py-1 text-xs font-semibold text-ink-800 no-underline hover:bg-gray-50">
                  💬 Text {r.name.split(" ")[0]}
                </a>
              ))}
            </div>
          )}
          <pre className="mt-2 whitespace-pre-wrap rounded-sm bg-gray-50 p-3 font-sans text-xs text-ink-600">{sheet}</pre>
        </div>
      </fieldset>
      {!d.jobId && d.leadStatus && d.leadStatus !== "booked" && (
        <div className="mt-4 rounded-[10px] border border-info-border bg-info-bg px-4 py-2.5 text-xs text-ink-800">
          Scheduling this job marks the lead <strong>Closed – Booked</strong> in Sales.
        </div>
      )}
      {err && <div className="mt-3 rounded-sm bg-danger-bg px-3 py-2 text-sm text-danger">{err}</div>}
    </Modal>
  );
}
