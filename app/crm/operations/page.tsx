"use client";

import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { FunctionReturnType } from "convex/server";
import type { Doc, Id } from "@/convex/_generated/dataModel";
import { PageHeader } from "@/components/crm/CrmShell";
import { JobModal, draftFromJob, draftFromLead, type JobDraft } from "@/components/crm/JobModal";
import { AssignLeadModal } from "@/components/crm/AssignLeadModal";
import { ScheduleCalendar } from "@/components/crm/Calendar";
import { useCan, useSession } from "@/components/crm/session";
import { Btn, Chip, Empty, Field, Loading, Modal, NumberInput, SelectInput, Tabs, TextArea, TextInput, errorText } from "@/components/crm/ui";
import { RESOURCE_KINDS, TIME_SLOTS, jobStatusMeta, slotMeta, type ResourceKind } from "@/lib/crm/constants";
import { addDays, shortDate, telHref } from "@/lib/crm/format";
import { useClock } from "@/lib/crm/useClock";
import { TRUCKS } from "@/convex/crm/quoteMath";

type Tab = "ready" | "week" | "day" | "crew";

export default function OperationsPage() {
  return (
    <Suspense fallback={<Loading />}>
      <Operations />
    </Suspense>
  );
}

function Operations() {
  const { token } = useSession();
  const { today } = useClock(30);
  const params = useSearchParams();
  const ready = useQuery(api.crm.operations.readyToSchedule, { token });
  const [tab, setTab] = useState<Tab>(params.get("date") ? "day" : "ready");
  const [draft, setDraft] = useState<JobDraft | null>(null);
  const [assign, setAssign] = useState<{ date?: string; assigneeIds?: Id<"resources">[]; name?: string } | null>(null);

  const tabs: { id: Tab; label: string; badge?: number }[] = [
    { id: "ready", label: "Ready to schedule", badge: ready?.length },
    { id: "week", label: "Calendar" },
    { id: "day", label: "Dispatch board" },
    { id: "crew", label: "Crew & sub-contractors" },
  ];

  return (
    <>
      <PageHeader title="Operations" sub="Schedule booked jobs, assign truckers and sub-contractors, and run the day." />

      <Tabs value={tab} onChange={setTab} items={tabs} />

      {(tab === "ready" || tab === "day") && <SlotLegend />}

      {tab === "ready" && <ReadyList rows={ready} onSchedule={setDraft} />}
      {tab === "week" && <ScheduleCalendar today={today} onOpen={setDraft} onAdd={(date) => setAssign({ date })} />}
      {tab === "day" && <DayBoard initialDate={params.get("date") ?? today} onOpen={setDraft} />}
      {tab === "crew" && <CrewList today={today} onAssign={(r) => setAssign({ assigneeIds: [r._id], name: r.name })} />}

      <AssignLeadModal
        open={assign !== null}
        onClose={() => setAssign(null)}
        title={assign?.name ? `Assign ${assign.name} to a lead` : assign?.date ? `Assign a lead on ${shortDate(assign.date)}` : undefined}
        preset={assign ?? undefined}
        onPick={(d) => {
          setAssign(null);
          setDraft(d);
        }}
      />
      <JobModal draft={draft} onClose={() => setDraft(null)} />
    </>
  );
}

function SlotLegend() {
  return (
    <div className="mb-4 flex flex-wrap gap-2">
      {TIME_SLOTS.map((s) => (
        <span key={s.id} className={`inline-flex items-center gap-1.5 rounded-pill border px-2.5 py-1 text-[11px] font-semibold ${s.card} ${s.text}`}>
          <span className={`h-2 w-2 rounded-pill ${s.dot}`} />
          {s.label} · {s.window}
        </span>
      ))}
    </div>
  );
}

// ───────────────────────────── Ready to schedule ─────────────────────────────

type ReadyRow = FunctionReturnType<typeof api.crm.operations.readyToSchedule>[number];

function ReadyList({ rows, onSchedule }: { rows: ReadyRow[] | undefined; onSchedule: (d: JobDraft) => void }) {
  const can = useCan();
  if (!rows) return <Loading />;
  if (rows.length === 0) return <Empty>No booked leads waiting. Leads marked “Closed – Booked” in Sales appear here.</Empty>;
  return (
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
      {rows.map((r) => (
        <div key={r.leadId} className="rounded-[12px] border border-border bg-white p-4">
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="font-display font-semibold text-ink-800">{r.name}</div>
              <a href={telHref(r.phone)} className="text-xs text-teal-500">
                {r.phone}
              </a>
            </div>
            {r.reference && <span className="text-xs text-ink-400">#{r.reference}</span>}
          </div>
          <div className="mt-2 text-sm text-ink-600">
            <div className="truncate">{r.movingFrom}</div>
            <div className="truncate text-ink-400">→ {r.movingTo || "—"}</div>
          </div>
          <div className="mt-3 flex flex-wrap gap-1">
            <Chip className="border-border bg-gray-50 text-ink-600">📅 {shortDate(r.moveDate)}</Chip>
            {r.bedrooms && <Chip className="border-border bg-gray-50 text-ink-600">{r.bedrooms}</Chip>}
            <Chip className="border-border bg-gray-50 text-ink-600">
              {r.crewSize} crew · {r.trucks} truck · {r.estimatedHours}h
            </Chip>
            {r.preferredTime && <Chip className="border-border bg-gray-50 text-ink-600">Prefers {r.preferredTime.split(" (")[0]}</Chip>}
          </div>
          {can("operations") && (
            <Btn className="mt-4 w-full" onClick={() => onSchedule(draftFromLead(r))}>
              Schedule & assign →
            </Btn>
          )}
        </div>
      ))}
    </div>
  );
}

// ─────────────────────────────── Week board ───────────────────────────────

function useResourceNames(token: string) {
  const resources = useQuery(api.crm.operations.listResources, { token, includeInactive: true });
  return useMemo(() => new Map((resources ?? []).map((r) => [r._id, r])), [resources]);
}

function JobCard({ job, names, onOpen, compact = false }: { job: Doc<"jobs">; names: Map<Id<"resources">, Doc<"resources">>; onOpen: () => void; compact?: boolean }) {
  const slot = slotMeta(job.timeSlot);
  const st = jobStatusMeta(job.status);
  const who = job.assigneeIds.map((id) => names.get(id)?.name ?? "?");
  return (
    <button
      type="button"
      onClick={onOpen}
      className={`w-full rounded-sm border border-l-4 px-2.5 py-2 text-left cursor-pointer hover:shadow-raised ${slot.card} ${
        job.status === "cancelled" ? "opacity-50 line-through" : ""
      }`}
    >
      <div className={`flex items-center justify-between gap-1 text-[11px] font-bold ${slot.text}`}>
        <span>
          {job.startTime ?? slot.window}
        </span>
        {!compact && <span className="font-semibold">{job.estimatedHours}h</span>}
      </div>
      <div className="truncate text-sm font-semibold text-ink-800">{job.customerName}</div>
      {!compact && <div className="truncate text-[11px] text-ink-600">{job.pickupAddress}</div>}
      <div className="mt-1 flex flex-wrap items-center gap-1">
        {who.length ? (
          <span className="truncate text-[11px] text-ink-800">👷 {who.join(", ")}</span>
        ) : (
          <Chip className="border-danger-border bg-danger-bg text-danger">Unassigned</Chip>
        )}
        {job.status !== "unassigned" && job.status !== "assigned" && <Chip className={st.chip}>{st.label}</Chip>}
      </div>
    </button>
  );
}

// ───────────────────────────── Dispatch (day) board ─────────────────────────────

function DayBoard({ initialDate, onOpen }: { initialDate: string; onOpen: (d: JobDraft) => void }) {
  const { token } = useSession();
  const [date, setDate] = useState(initialDate);
  const jobs = useQuery(api.crm.operations.listJobs, { token, from: date, to: date });
  const resources = useQuery(api.crm.operations.listResources, { token });
  const names = useResourceNames(token);
  const setJobStatus = useMutation(api.crm.operations.setJobStatus);

  if (!jobs || !resources) return <Loading />;
  const live = jobs.filter((j) => j.status !== "cancelled");
  const unassigned = live.filter((j) => j.assigneeIds.length === 0);
  const busy = new Set(live.flatMap((j) => j.assigneeIds));

  return (
    <>
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <Btn variant="outline" size="sm" onClick={() => setDate(addDays(date, -1))}>
          ←
        </Btn>
        <TextInput type="date" value={date} onChange={(e) => e.target.value && setDate(e.target.value)} className="!w-auto" />
        <Btn variant="outline" size="sm" onClick={() => setDate(addDays(date, 1))}>
          →
        </Btn>
        <span className="ml-2 font-display text-sm font-semibold text-ink-800">{shortDate(date)}</span>
        <span className="ml-auto text-xs text-ink-400">
          {live.length} jobs · {resources.filter((r) => !busy.has(r._id)).length} crew free
        </span>
      </div>

      <div className="-mx-4 overflow-x-auto px-4 lg:-mx-8 lg:px-8">
        <table className="w-full min-w-[1000px] border-separate border-spacing-1 text-sm">
          <thead>
            <tr>
              <th className="w-48 text-left text-[11px] font-semibold uppercase tracking-wide text-ink-400">Crew / truck</th>
              {TIME_SLOTS.map((s) => (
                <th key={s.id} className={`rounded-sm border px-2 py-1.5 text-left text-[11px] font-bold ${s.card} ${s.text}`}>
                  {s.label} <span className="font-normal">{s.window}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {unassigned.length > 0 && (
              <tr>
                <td className="rounded-sm bg-danger-bg px-2 py-2 align-top text-xs font-bold text-danger">⚠ Unassigned ({unassigned.length})</td>
                {TIME_SLOTS.map((s) => (
                  <td key={s.id} className="align-top">
                    <div className="flex flex-col gap-1">
                      {unassigned.filter((j) => j.timeSlot === s.id).map((j) => (
                        <JobCard key={j._id} job={j} names={names} compact onOpen={() => onOpen(draftFromJob(j))} />
                      ))}
                    </div>
                  </td>
                ))}
              </tr>
            )}
            {resources.map((r) => {
              const mine = live.filter((j) => j.assigneeIds.includes(r._id));
              const kind = RESOURCE_KINDS.find((k) => k.id === r.kind);
              return (
                <tr key={r._id}>
                  <td className="rounded-sm bg-white px-2 py-2 align-top">
                    <div className="flex items-center gap-1.5 font-semibold text-ink-800">
                      <span className={`h-2 w-2 rounded-pill ${mine.length ? "bg-amber-500" : "bg-emerald-500"}`} title={mine.length ? "Booked" : "Free"} />
                      {kind?.icon} {r.name}
                    </div>
                    <div className="text-[11px] text-ink-400">{[r.truckSize, r.crewSize && `${r.crewSize} crew`].filter(Boolean).join(" · ") || kind?.label}</div>
                  </td>
                  {TIME_SLOTS.map((s) => (
                    <td key={s.id} className="rounded-sm bg-gray-100/60 align-top">
                      <div className="flex flex-col gap-1">
                        {mine.filter((j) => j.timeSlot === s.id).map((j) => (
                          <JobCard key={j._id} job={j} names={names} compact onOpen={() => onOpen(draftFromJob(j))} />
                        ))}
                      </div>
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {live.length > 0 && (
        <div className="mt-5 rounded-[12px] border border-border bg-white p-4">
          <h3 className="m-0 mb-3 font-display text-sm font-semibold">Run sheet · update status as the day goes</h3>
          <div className="flex flex-col divide-y divide-border">
            {live
              .sort((a, b) => TIME_SLOTS.findIndex((s) => s.id === a.timeSlot) - TIME_SLOTS.findIndex((s) => s.id === b.timeSlot))
              .map((j) => {
                const slot = slotMeta(j.timeSlot);
                return (
                  <div key={j._id} className="flex flex-wrap items-center gap-3 py-2">
                    <span className={`h-3 w-3 rounded-pill ${slot.dot}`} />
                    <span className="w-28 text-xs text-ink-600">{j.startTime ?? slot.window}</span>
                    <span className="min-w-40 flex-1 text-sm font-semibold text-ink-800">{j.customerName}</span>
                    <div className="flex gap-1">
                      {(["confirmed", "in_progress", "completed"] as const).map((s) => (
                        <Btn
                          key={s}
                          size="sm"
                          variant={j.status === s ? "primary" : "outline"}
                          onClick={() => void setJobStatus({ token, jobId: j._id, status: s })}
                        >
                          {jobStatusMeta(s).label}
                        </Btn>
                      ))}
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}
    </>
  );
}

// ─────────────────────────── Crew & sub-contractors ───────────────────────────

type ResourceForm = {
  resourceId?: Id<"resources">;
  name: string;
  kind: ResourceKind;
  phone: string;
  email: string;
  abn: string;
  truckSize: string;
  crewSize: number;
  hourlyCost: number;
  notes: string;
  active: boolean;
};

const blankResource: ResourceForm = {
  name: "",
  kind: "trucker",
  phone: "",
  email: "",
  abn: "",
  truckSize: "",
  crewSize: 2,
  hourlyCost: 0,
  notes: "",
  active: true,
};

function CrewList({ today, onAssign }: { today: string; onAssign: (r: Doc<"resources">) => void }) {
  const { token } = useSession();
  const can = useCan();
  const resources = useQuery(api.crm.operations.listResources, { token, includeInactive: true });
  const upcoming = useQuery(api.crm.operations.resourceJobs, { token, from: today });
  const [kind, setKind] = useState<ResourceKind | "all">("all");
  const save = useMutation(api.crm.operations.saveResource);
  const [form, setForm] = useState<ResourceForm | null>(null);
  const [err, setErr] = useState<string | null>(null);

  if (!resources) return <Loading />;

  async function submit() {
    if (!form) return;
    setErr(null);
    try {
      await save({
        token,
        resourceId: form.resourceId,
        name: form.name,
        kind: form.kind,
        phone: form.phone,
        email: form.email || undefined,
        abn: form.abn || undefined,
        truckSize: form.truckSize || undefined,
        crewSize: form.crewSize,
        hourlyCost: form.hourlyCost || undefined,
        notes: form.notes || undefined,
        active: form.active,
      });
      setForm(null);
    } catch (e) {
      setErr(errorText(e));
    }
  }

  return (
    <>
      <div className="mb-4 flex flex-wrap items-center gap-2">
        {[{ id: "all" as const, label: "All", icon: "" }, ...RESOURCE_KINDS].map((k) => (
          <button
            key={k.id}
            type="button"
            onClick={() => setKind(k.id)}
            className={`inline-flex h-8 items-center gap-1.5 rounded-pill border-[1.5px] px-3.5 font-display text-xs font-semibold cursor-pointer transition-colors ${
              kind === k.id ? "border-teal-500 bg-teal-500 text-white" : "border-border bg-white text-ink-600 hover:border-teal-200 hover:text-teal-500"
            }`}
          >
            {k.icon} {k.id === "all" ? "All" : `${k.label}s`}
            <span className="opacity-60">{k.id === "all" ? resources.length : resources.filter((r) => r.kind === k.id).length}</span>
          </button>
        ))}
        {can("operations") && (
          <Btn className="ml-auto" onClick={() => setForm({ ...blankResource })}>
            + Add trucker / sub-contractor
          </Btn>
        )}
      </div>
      {resources.length === 0 ? (
        <Empty>No crew yet. Add your truckers, sub-contractors and in-house crews so jobs can be assigned.</Empty>
      ) : (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
          {resources
            .filter((r) => kind === "all" || r.kind === kind)
            .map((r) => {
              const k = RESOURCE_KINDS.find((x) => x.id === r.kind);
              const mine = (upcoming ?? []).filter((j) => j.assigneeIds.includes(r._id)).sort((a, b) => a.date.localeCompare(b.date));
              const busyToday = mine.some((j) => j.date === today);
              return (
                <div key={r._id} className={`flex min-w-0 flex-col rounded-[12px] border border-border bg-white p-4 transition-shadow hover:shadow-raised ${r.active ? "" : "opacity-60"}`}>
                  <div className="flex items-start gap-3">
                    <div className="grid h-11 w-11 shrink-0 place-items-center rounded-sm bg-teal-100 text-lg">{k?.icon}</div>
                    <div className="min-w-0 flex-1">
                      <div className="truncate font-display text-[15px] font-semibold text-ink-800">{r.name}</div>
                      <div className="text-xs text-ink-400">
                        {k?.label}
                        {!r.active && " · inactive"}
                      </div>
                    </div>
                    <Chip className={busyToday ? "border-amber-200 bg-amber-50 text-amber-800" : "border-success-border bg-success-bg text-ink-800"}>
                      {busyToday ? "On a job today" : "Free today"}
                    </Chip>
                  </div>
                  <div className="mt-3 grid grid-cols-3 gap-2 rounded-sm bg-gray-50 px-3 py-2 text-xs">
                    <div>
                      <div className="text-ink-400">Truck</div>
                      <div className="font-semibold text-ink-800">{r.truckSize ?? "—"}</div>
                    </div>
                    <div>
                      <div className="text-ink-400">Crew</div>
                      <div className="font-semibold text-ink-800">{r.crewSize ?? "—"}</div>
                    </div>
                    <div>
                      <div className="text-ink-400">Cost/hr</div>
                      <div className="font-semibold text-ink-800">{r.hourlyCost ? `$${r.hourlyCost}` : "—"}</div>
                    </div>
                  </div>
                  <div className="mt-3 mb-4 text-xs">
                    <div className="mb-1 font-display font-semibold text-ink-800">Upcoming jobs ({mine.length})</div>
                    {mine.length === 0 ? (
                      <div className="text-ink-400">Nothing booked.</div>
                    ) : (
                      <div className="flex flex-col gap-1">
                        {mine.slice(0, 3).map((j) => (
                          <div key={j._id} className="flex items-center gap-2 truncate text-ink-600">
                            <span className={`h-2 w-2 shrink-0 rounded-pill ${slotMeta(j.timeSlot).dot}`} />
                            <span className="w-24 shrink-0">{shortDate(j.date)}</span>
                            <span className="truncate font-semibold text-ink-800">{j.customerName}</span>
                          </div>
                        ))}
                        {mine.length > 3 && <div className="text-ink-400">+{mine.length - 3} more</div>}
                      </div>
                    )}
                  </div>
                  <div className="mt-auto flex flex-wrap items-center gap-2 border-t border-border pt-3">
                    <a href={telHref(r.phone)} className="text-xs font-semibold text-teal-500 no-underline hover:underline">
                      {r.phone}
                    </a>
                    {can("operations") && (
                      <div className="ml-auto flex gap-1.5">
                        <Btn
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            setForm({
                              resourceId: r._id,
                              name: r.name,
                              kind: r.kind,
                              phone: r.phone,
                              email: r.email ?? "",
                              abn: r.abn ?? "",
                              truckSize: r.truckSize ?? "",
                              crewSize: r.crewSize ?? 2,
                              hourlyCost: r.hourlyCost ?? 0,
                              notes: r.notes ?? "",
                              active: r.active,
                            })
                          }
                        >
                          Edit
                        </Btn>
                        {r.active && (
                          <Btn size="sm" variant="secondary" onClick={() => onAssign(r)}>
                            Assign to lead
                          </Btn>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
        </div>
      )}

      <Modal
        open={form !== null}
        onClose={() => setForm(null)}
        title={form?.resourceId ? "Edit crew member" : "Add trucker / sub-contractor"}
        footer={
          <>
            <Btn variant="ghost" onClick={() => setForm(null)}>
              Cancel
            </Btn>
            <Btn onClick={submit}>Save</Btn>
          </>
        }
      >
        {form && (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Field label="Name / business">{(id) => <TextInput id={id} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />}</Field>
            <Field label="Type">
              {(id) => (
                <SelectInput id={id} value={form.kind} onChange={(e) => setForm({ ...form, kind: e.target.value as ResourceKind })}>
                  {RESOURCE_KINDS.map((k) => (
                    <option key={k.id} value={k.id}>
                      {k.label}
                    </option>
                  ))}
                </SelectInput>
              )}
            </Field>
            <Field label="Phone">{(id) => <TextInput id={id} type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />}</Field>
            <Field label="Email">{(id) => <TextInput id={id} type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />}</Field>
            <Field label="Truck size">
              {(id) => (
                <SelectInput id={id} value={form.truckSize} onChange={(e) => setForm({ ...form, truckSize: e.target.value })}>
                  <option value="">No truck</option>
                  {TRUCKS.map((t) => (
                    <option key={t.size}>{t.size}</option>
                  ))}
                </SelectInput>
              )}
            </Field>
            <Field label="Crew size">{(id) => <NumberInput id={id} value={form.crewSize} onChange={(n) => setForm({ ...form, crewSize: n })} />}</Field>
            <Field label="Cost to us per hour" hint="For margin tracking">
              {(id) => <NumberInput id={id} prefix="$" value={form.hourlyCost} onChange={(n) => setForm({ ...form, hourlyCost: n })} />}
            </Field>
            <Field label="ABN">{(id) => <TextInput id={id} value={form.abn} onChange={(e) => setForm({ ...form, abn: e.target.value })} />}</Field>
            <Field label="Notes" className="sm:col-span-2">
              {(id) => <TextArea id={id} rows={2} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Insurance expiry, availability, rating…" />}
            </Field>
            <label className="flex items-center gap-2 text-sm sm:col-span-2">
              <input type="checkbox" className="accent-teal-500" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} /> Active (can be assigned)
            </label>
            {err && <div className="rounded-sm bg-danger-bg px-3 py-2 text-sm text-danger sm:col-span-2">{err}</div>}
          </div>
        )}
      </Modal>
    </>
  );
}
