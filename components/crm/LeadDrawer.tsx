"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { useCan, useSession } from "./session";
import { JobModal, draftFromJob, draftFromLead, type JobDraft } from "./JobModal";
import { Btn, Chip, CloseBtn, Drawer, Field, Loading, Modal, NumberInput, SelectInput, TextArea, TextInput, errorText } from "./ui";
import {
  LEAD_STATUSES,
  LOST_REASONS,
  estimateStatusMeta,
  jobStatusMeta,
  leadStatusMeta,
  slotMeta,
  type LeadStatus,
} from "@/lib/crm/constants";
import { dateTime, mapsHref, money, shortDate, smsHref, telHref } from "@/lib/crm/format";

type ActivityKind = "note" | "call" | "email" | "sms";

const ACTIVITY_ICON: Record<string, string> = {
  note: "✎",
  call: "☎",
  email: "✉",
  sms: "💬",
  status: "⇄",
  system: "•",
};

function templates(first: string, staff: string) {
  return [
    {
      label: "Missed call",
      body: `Hi ${first}, it's ${staff} from Movera. I tried calling about your moving quote — when's a good time to chat? Or reply here with your inventory and I'll send a price.`,
    },
    {
      label: "Quote follow-up",
      body: `Hi ${first}, ${staff} from Movera here. Just checking you received your moving quote — happy to answer any questions or lock in your date.`,
    },
    {
      label: "Date filling up",
      body: `Hi ${first}, quick heads up from Movera — your move date is filling up. Reply YES and I'll secure a crew for you.`,
    },
  ];
}

export function LeadDrawer({ leadId, onClose }: { leadId: Id<"quoteRequests"> | null; onClose: () => void }) {
  return (
    <Drawer open={leadId !== null} onClose={onClose}>
      {leadId && <LeadDetail key={leadId} leadId={leadId} onClose={onClose} />}
    </Drawer>
  );
}

function LeadDetail({ leadId, onClose }: { leadId: Id<"quoteRequests">; onClose: () => void }) {
  const { token, me } = useSession();
  const can = useCan();
  const router = useRouter();
  const lead = useQuery(api.crm.leads.get, { token, leadId });
  const staff = useQuery(api.crm.auth.listStaff, { token });
  const updateStatus = useMutation(api.crm.leads.updateStatus);
  const update = useMutation(api.crm.leads.update);
  const addActivity = useMutation(api.crm.leads.addActivity);
  const createEstimate = useMutation(api.crm.estimates.create);
  const scheduling = useQuery(api.crm.operations.schedulingForLead, { token, leadId });
  const resources = useQuery(api.crm.operations.listResources, { token, includeInactive: true });
  const [jobDraft, setJobDraft] = useState<JobDraft | null>(null);

  const [lostOpen, setLostOpen] = useState(false);
  const [lostReason, setLostReason] = useState(LOST_REASONS[0]);
  const [kind, setKind] = useState<ActivityKind>("note");
  const [body, setBody] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [form, setForm] = useState<null | {
    name: string;
    phone: string;
    email: string;
    moveDate: string;
    movingFrom: string;
    movingTo: string;
  }>(null);

  if (lead === undefined) return <Loading />;
  if (lead === null) return <div className="p-6 text-sm">Lead not found.</div>;

  const canSell = can("sales");
  const first = lead.name.split(" ")[0] || "there";
  const status = leadStatusMeta(lead.status);
  const followOverdue = lead.nextFollowUp && lead.nextFollowUp < new Date().toISOString().slice(0, 10);

  async function run(fn: () => Promise<unknown>) {
    setErr(null);
    try {
      await fn();
    } catch (e) {
      setErr(errorText(e));
    }
  }

  function changeStatus(s: LeadStatus) {
    if (s === "lost") return setLostOpen(true);
    void run(() => updateStatus({ token, leadId, status: s }));
  }

  return (
    <div className="flex min-h-full flex-col">
      {/* Header */}
      <div className="sticky top-0 z-10 border-b border-border bg-white px-5 py-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="text-xs text-ink-400">
              {lead.reference ? `#${lead.reference} · ` : ""}
              {lead.source} · created {dateTime(lead._creationTime)}
            </div>
            <h2 className="m-0 mt-0.5 truncate font-display text-xl font-bold text-ink-800">{lead.name}</h2>
          </div>
          <CloseBtn onClick={onClose} />
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <SelectInput
            value={lead.status}
            disabled={!canSell}
            onChange={(e) => changeStatus(e.target.value as LeadStatus)}
            size="sm"
            className="w-44"
            fieldClassName={status.chip}
            aria-label="Lead status"
          >
            {LEAD_STATUSES.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label}
              </option>
            ))}
          </SelectInput>
          <a href={telHref(lead.phone)} className="inline-flex h-8 items-center rounded-sm border-[1.5px] border-teal-500 bg-white px-3 font-display text-xs font-semibold text-teal-500 no-underline hover:bg-teal-50">
            ☎ Call
          </a>
          <a href={smsHref(lead.phone)} className="inline-flex h-8 items-center rounded-sm border-[1.5px] border-teal-500 bg-white px-3 font-display text-xs font-semibold text-teal-500 no-underline hover:bg-teal-50">
            💬 SMS
          </a>
          {lead.email && (
            <a href={`mailto:${lead.email}`} className="inline-flex h-8 items-center rounded-sm border-[1.5px] border-teal-500 bg-white px-3 font-display text-xs font-semibold text-teal-500 no-underline hover:bg-teal-50">
              ✉ Email
            </a>
          )}
          {canSell && (
            <Btn
              size="sm"
              onClick={() =>
                run(async () => {
                  const id = await createEstimate({ token, leadId });
                  router.push(`/crm/actions/${id}`);
                })
              }
            >
              + Create quotation
            </Btn>
          )}
        </div>
        {lead.status === "lost" && lead.lostReason && (
          <div className="mt-2 text-xs text-rose-700">Lost reason: {lead.lostReason}</div>
        )}
        {err && <div className="mt-2 rounded-sm bg-danger-bg px-3 py-2 text-xs text-danger">{err}</div>}
      </div>

      <div className="flex flex-col gap-4 p-5">
        {/* Pipeline fields */}
        <div className="grid grid-cols-1 gap-3 rounded-[12px] border border-border bg-white p-4 sm:grid-cols-3">
          <Field label="Owner">
            {(id) => (
              <SelectInput
                id={id}
                disabled={!canSell}
                value={lead.ownerId ?? ""}
                onChange={(e) =>
                  run(() => update({ token, leadId, patch: { ownerId: (e.target.value || null) as Id<"staff"> | null } }))
                }
              >
                <option value="">Unassigned</option>
                {staff?.filter((s) => s.active).map((s) => (
                  <option key={s._id} value={s._id}>
                    {s.name}
                    {s._id === me._id ? " (me)" : ""}
                  </option>
                ))}
              </SelectInput>
            )}
          </Field>
          <Field label="Est. value">
            {(id) => (
              <NumberInput
                id={id}
                prefix="$"
                disabled={!canSell}
                value={lead.estimatedValue ?? 0}
                onChange={(n) => run(() => update({ token, leadId, patch: { estimatedValue: n } }))}
              />
            )}
          </Field>
          <Field label="Next follow-up" hint={followOverdue ? <span className="font-semibold text-danger">Overdue</span> : undefined}>
            {(id) => (
              <TextInput
                id={id}
                type="date"
                disabled={!canSell}
                value={lead.nextFollowUp ?? ""}
                onChange={(e) => run(() => update({ token, leadId, patch: { nextFollowUp: e.target.value || null } }))}
              />
            )}
          </Field>
        </div>

        {/* Move details */}
        <section className="rounded-[12px] border border-border bg-white p-4">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="m-0 font-display text-sm font-semibold text-ink-800">Move details</h3>
            {canSell &&
              (form ? (
                <div className="flex gap-2">
                  <Btn size="sm" variant="ghost" onClick={() => setForm(null)}>
                    Cancel
                  </Btn>
                  <Btn
                    size="sm"
                    onClick={() =>
                      run(async () => {
                        await update({ token, leadId, patch: form });
                        setForm(null);
                      })
                    }
                  >
                    Save
                  </Btn>
                </div>
              ) : (
                <Btn
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    setForm({
                      name: lead.name,
                      phone: lead.phone,
                      email: lead.email,
                      moveDate: lead.moveDate,
                      movingFrom: lead.movingFrom,
                      movingTo: lead.movingTo,
                    })
                  }
                >
                  Edit
                </Btn>
              ))}
          </div>
          {form ? (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {(
                [
                  ["name", "Name", "text"],
                  ["phone", "Phone", "tel"],
                  ["email", "Email", "email"],
                  ["moveDate", "Move date", "date"],
                  ["movingFrom", "Moving from", "text"],
                  ["movingTo", "Moving to", "text"],
                ] as const
              ).map(([k, label, type]) => (
                <Field key={k} label={label}>
                  {(id) => (
                    <TextInput id={id} type={type} value={form[k]} onChange={(e) => setForm({ ...form, [k]: e.target.value })} />
                  )}
                </Field>
              ))}
            </div>
          ) : (
            <dl className="m-0 grid grid-cols-1 gap-x-6 gap-y-2.5 text-sm sm:grid-cols-2">
              <Info label="Phone" value={<a href={telHref(lead.phone)} className="text-teal-500">{lead.phone}</a>} />
              <Info label="Email" value={lead.email || "—"} />
              <Info label="Move date" value={shortDate(lead.moveDate)} />
              <Info label="Size" value={lead.bedrooms ?? "—"} />
              <Info
                label="From"
                value={
                  <a href={mapsHref(lead.movingFrom)} target="_blank" rel="noreferrer" className="text-teal-500">
                    {lead.movingFrom}
                  </a>
                }
              />
              <Info
                label="To"
                value={
                  lead.movingTo ? (
                    <a href={mapsHref(lead.movingTo)} target="_blank" rel="noreferrer" className="text-teal-500">
                      {lead.movingTo}
                    </a>
                  ) : (
                    "—"
                  )
                }
              />
              {lead.stepTwo && (
                <>
                  <Info label="Property" value={lead.stepTwo.propertyType} />
                  <Info label="Preferred time" value={lead.stepTwo.preferredTime} />
                  <Info label="Pickup access" value={lead.stepTwo.pickupAccess} />
                  <Info label="Drop-off access" value={lead.stepTwo.dropoffAccess} />
                  <Info label="Packing help" value={lead.stepTwo.packingHelp} />
                  <Info label="Special items" value={lead.stepTwo.specialItems || "—"} />
                  {lead.stepTwo.notes && <Info label="Customer notes" value={lead.stepTwo.notes} wide />}
                </>
              )}
            </dl>
          )}
        </section>

        {/* Crew assignment */}
        <section className="rounded-[12px] border border-border bg-white p-4">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <h3 className="m-0 font-display text-sm font-semibold text-ink-800">Crew &amp; sub-contractors</h3>
            {scheduling && can("operations") && (
              <Btn size="sm" variant="secondary" onClick={() => setJobDraft(draftFromLead(scheduling))}>
                + Assign trucker / sub-contractor
              </Btn>
            )}
          </div>
          {lead.jobs.length === 0 ? (
            <p className="m-0 text-sm text-ink-400">
              {lead.status === "lost" ? "Lost leads can't be scheduled." : "No one assigned yet. Assigning crew schedules the job and books the lead."}
            </p>
          ) : (
            <div className="flex flex-col gap-2">
              {lead.jobs.map((j) => {
                const sl = slotMeta(j.timeSlot);
                const st = jobStatusMeta(j.status);
                const who = j.assigneeIds.map((id) => resources?.find((r) => r._id === id)?.name ?? "…");
                return (
                  <button
                    key={j._id}
                    type="button"
                    onClick={() => setJobDraft(draftFromJob(j))}
                    className={`flex w-full items-center gap-3 rounded-sm border-[1.5px] px-3 py-2.5 text-left text-sm cursor-pointer hover:shadow-raised ${sl.card}`}
                  >
                    <span className={`h-2.5 w-2.5 shrink-0 rounded-pill ${sl.dot}`} />
                    <span className="min-w-0 flex-1">
                      <span className={`block font-semibold ${sl.text}`}>
                        {shortDate(j.date)} · {sl.label} {sl.window}
                      </span>
                      <span className={`block truncate text-xs ${who.length ? "text-ink-800" : "font-semibold text-danger"}`}>
                        {who.length ? who.join(", ") : "Unassigned — click to assign"}
                      </span>
                    </span>
                    <Chip className={st.chip}>{st.label}</Chip>
                  </button>
                );
              })}
            </div>
          )}
        </section>

        {/* Quotations */}
        {lead.estimates.length > 0 && (
          <section className="rounded-[12px] border border-border bg-white p-4">
            <h3 className="m-0 mb-3 font-display text-sm font-semibold text-ink-800">Quotations</h3>
            <div className="flex flex-col gap-2">
              {lead.estimates.map((e) => {
                const s = estimateStatusMeta(e.status);
                return (
                  <Link key={e._id} href={`/crm/actions/${e._id}`} className="flex items-center justify-between rounded-sm border-[1.5px] border-border px-3 py-2 text-sm no-underline hover:bg-gray-50">
                    <span className="font-semibold text-ink-800">Quotation Q-{e.number}</span>
                    <Chip className={s.chip}>{s.label}</Chip>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {/* Activity */}
        <section className="rounded-[12px] border border-border bg-white p-4">
          <h3 className="m-0 mb-3 font-display text-sm font-semibold text-ink-800">Activity</h3>
          <div className="mb-2 flex flex-wrap gap-1">
            {(["note", "call", "sms", "email"] as ActivityKind[]).map((k) => (
              <button
                key={k}
                type="button"
                onClick={() => setKind(k)}
                className={`rounded-pill border px-3 py-1 text-xs font-semibold capitalize cursor-pointer ${
                  kind === k ? "border-teal-500 bg-teal-50 text-teal-600" : "border-border bg-white text-ink-600"
                }`}
              >
                {ACTIVITY_ICON[k]} {k === "sms" ? "SMS" : k}
              </button>
            ))}
          </div>
          <TextArea
            rows={3}
            placeholder={kind === "call" ? "Call outcome — e.g. spoke to customer, wants quote by Friday" : "Write a note…"}
            value={body}
            onChange={(e) => setBody(e.target.value)}
          />
          <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap gap-1">
              {(kind === "sms" || kind === "email") &&
                templates(first, me.name.split(" ")[0]).map((t) => (
                  <button
                    key={t.label}
                    type="button"
                    onClick={() => setBody(t.body)}
                    className="rounded-pill bg-gray-100 px-2.5 py-1 text-[11px] font-semibold text-ink-600 hover:bg-gray-50 cursor-pointer"
                  >
                    {t.label}
                  </button>
                ))}
            </div>
            <div className="flex gap-2">
              {kind === "sms" && body && (
                <a href={smsHref(lead.phone, body)} className="rounded-sm border border-border px-3 py-1.5 text-xs font-semibold text-ink-800 no-underline">
                  Open in SMS app
                </a>
              )}
              {kind === "email" && body && lead.email && (
                <a
                  href={`mailto:${lead.email}?subject=${encodeURIComponent("Your Movera move")}&body=${encodeURIComponent(body)}`}
                  className="rounded-sm border border-border px-3 py-1.5 text-xs font-semibold text-ink-800 no-underline"
                >
                  Open in mail
                </a>
              )}
              <Btn
                size="sm"
                disabled={!body.trim()}
                onClick={() =>
                  run(async () => {
                    await addActivity({ token, leadId, kind, body });
                    setBody("");
                  })
                }
              >
                Log {kind === "sms" ? "SMS" : kind}
              </Btn>
            </div>
          </div>

          <ol className="m-0 mt-5 list-none border-l-2 border-border p-0 pl-4">
            {lead.activities.map((a) => (
              <li key={a._id} className="relative mb-4 last:mb-0">
                <span className="absolute -left-[25px] top-0 grid h-4 w-4 place-items-center rounded-pill bg-white text-[10px] text-ink-600 ring-2 ring-border">
                  {ACTIVITY_ICON[a.kind]}
                </span>
                <div className="text-[11px] text-ink-400">
                  {a.staffName} · {dateTime(a._creationTime)}
                </div>
                <div className={`whitespace-pre-wrap text-sm ${a.kind === "status" || a.kind === "system" ? "text-ink-600" : "text-ink-800"}`}>
                  {a.body}
                </div>
              </li>
            ))}
            <li className="relative">
              <span className="absolute -left-[25px] top-0 grid h-4 w-4 place-items-center rounded-pill bg-white text-[10px] ring-2 ring-border">★</span>
              <div className="text-[11px] text-ink-400">{dateTime(lead._creationTime)}</div>
              <div className="text-sm text-ink-600">Lead received from {lead.source}{lead.estimatedValue ? ` · ${money(lead.estimatedValue)}` : ""}</div>
            </li>
          </ol>
        </section>
      </div>

      <Modal
        open={lostOpen}
        onClose={() => setLostOpen(false)}
        title="Mark as Closed – Lost"
        footer={
          <>
            <Btn variant="ghost" onClick={() => setLostOpen(false)}>
              Cancel
            </Btn>
            <Btn
              variant="danger"
              onClick={() =>
                run(async () => {
                  await updateStatus({ token, leadId, status: "lost", lostReason });
                  setLostOpen(false);
                })
              }
            >
              Mark lost
            </Btn>
          </>
        }
      >
        <Field label="Why was it lost?" hint="Tracked so you can see where deals slip.">
          {(id) => (
            <SelectInput id={id} value={lostReason} onChange={(e) => setLostReason(e.target.value)}>
              {LOST_REASONS.map((r) => (
                <option key={r}>{r}</option>
              ))}
            </SelectInput>
          )}
        </Field>
      </Modal>
      <JobModal draft={jobDraft} onClose={() => setJobDraft(null)} />
    </div>
  );
}

function Info({ label, value, wide = false }: { label: string; value: React.ReactNode; wide?: boolean }) {
  return (
    <div className={wide ? "sm:col-span-2" : ""}>
      <dt className="text-[11px] font-semibold uppercase tracking-wide text-ink-400">{label}</dt>
      <dd className="m-0 whitespace-pre-wrap text-ink-800">{value}</dd>
    </div>
  );
}
