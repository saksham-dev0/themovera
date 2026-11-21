"use client";

import { Suspense, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { FunctionReturnType } from "convex/server";
import type { Id } from "@/convex/_generated/dataModel";
import { PageHeader } from "@/components/crm/CrmShell";
import { LeadDrawer } from "@/components/crm/LeadDrawer";
import { useCan, useSession } from "@/components/crm/session";
import { Btn, Chip, Empty, Field, Loading, Modal, Segmented, SelectInput, TextInput, errorText } from "@/components/crm/ui";
import { LEAD_SOURCES, LEAD_STATUSES, leadStatusMeta, type LeadStatus } from "@/lib/crm/constants";
import { money, shortDate, telHref, timeAgo } from "@/lib/crm/format";
import { useClock } from "@/lib/crm/useClock";

export default function SalesPage() {
  return (
    <Suspense fallback={<Loading />}>
      <Sales />
    </Suspense>
  );
}

type Row = FunctionReturnType<typeof api.crm.leads.list>[number];

function Sales() {
  const { token, me } = useSession();
  const can = useCan();
  const { now, today } = useClock();
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const leads = useQuery(api.crm.leads.list, { token });
  const staff = useQuery(api.crm.auth.listStaff, { token });
  const updateStatus = useMutation(api.crm.leads.updateStatus);

  const [view, setView] = useState<"board" | "table">("board");
  const [search, setSearch] = useState("");
  const [owner, setOwner] = useState<"all" | "mine" | "none">("all");
  const [source, setSource] = useState("all");
  const [quick, setQuick] = useState<"all" | "overdue" | "today" | "uncontacted">("all");
  const [newOpen, setNewOpen] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [dragging, setDragging] = useState<Id<"quoteRequests"> | null>(null);

  const statusFilter = (params.get("status") as LeadStatus | null) ?? null;
  const openLead = params.get("lead") as Id<"quoteRequests"> | null;

  function setParam(key: string, value: string | null) {
    const p = new URLSearchParams(params.toString());
    if (value) p.set(key, value);
    else p.delete(key);
    router.replace(`${pathname}${p.size ? `?${p}` : ""}`, { scroll: false });
  }

  const ownerName = useMemo(() => new Map((staff ?? []).map((s) => [s._id, s.name])), [staff]);
  const sources = useMemo(() => [...new Set([...(leads ?? []).map((l) => l.source), ...LEAD_SOURCES])], [leads]);

  const unstaged = useMemo(() => {
    if (!leads) return [];
    const q = search.trim().toLowerCase();
    return leads.filter((l) => {
      if (owner === "mine" && l.ownerId !== me._id) return false;
      if (owner === "none" && l.ownerId) return false;
      if (source !== "all" && l.source !== source) return false;
      const open = l.status !== "booked" && l.status !== "lost";
      if (quick === "overdue" && !(open && l.nextFollowUp && l.nextFollowUp < today)) return false;
      if (quick === "today" && !(open && l.nextFollowUp === today)) return false;
      if (quick === "uncontacted" && l.status !== "new") return false;
      if (q) {
        const hay = `${l.name} ${l.phone} ${l.email} ${l.movingFrom} ${l.movingTo} ${l.reference ?? ""}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [leads, search, owner, source, quick, me._id, today]);
  const filtered = useMemo(
    () => (statusFilter ? unstaged.filter((l) => l.status === statusFilter) : unstaged),
    [unstaged, statusFilter],
  );

  if (!leads) return <Loading />;

  const overdueCount = leads.filter((l) => l.status !== "booked" && l.status !== "lost" && l.nextFollowUp && l.nextFollowUp < today).length;

  async function move(leadId: Id<"quoteRequests">, status: LeadStatus) {
    if (status === "lost") {
      setParam("lead", leadId); // drawer asks for the lost reason
      return;
    }
    setErr(null);
    try {
      await updateStatus({ token, leadId, status });
    } catch (e) {
      setErr(errorText(e));
    }
  }

  // Stage totals ignore the stage filter itself, so the strip always shows the whole pipeline.
  const pipeline = { all: { count: 0, value: 0 } } as Record<LeadStatus | "all", { count: number; value: number }>;
  for (const s of LEAD_STATUSES) pipeline[s.id] = { count: 0, value: 0 };
  for (const l of unstaged) {
    pipeline[l.status].count++;
    pipeline[l.status].value += l.estimatedValue ?? 0;
    pipeline.all.count++;
    pipeline.all.value += l.estimatedValue ?? 0;
  }
  const groups = LEAD_STATUSES.map((stage) => ({ stage, items: filtered.filter((l) => l.status === stage.id) })).filter(
    (g) => g.items.length > 0,
  );

  return (
    <>
      <PageHeader
        title="Sales"
        sub={`${leads.length} leads · every website and landing-page enquiry lands here`}
        actions={
          can("sales") && (
            <Btn variant="secondary" onClick={() => setNewOpen(true)}>
              + New lead
            </Btn>
          )
        }
      />

      {/* Pipeline strip: stage totals, click to focus, drop a card here to move it. Wraps — never scrolls sideways. */}
      <div className="mb-4 grid grid-cols-2 gap-2 sm:grid-cols-4 xl:grid-cols-8">
        <StageTile
          label="All stages"
          dot="bg-teal-500"
          count={pipeline.all.count}
          value={pipeline.all.value}
          active={!statusFilter}
          onClick={() => setParam("status", null)}
        />
        {LEAD_STATUSES.map((s) => (
          <StageTile
            key={s.id}
            label={s.label}
            dot={s.dot}
            count={pipeline[s.id].count}
            value={pipeline[s.id].value}
            active={statusFilter === s.id}
            dropping={dragging !== null}
            onClick={() => setParam("status", statusFilter === s.id ? null : s.id)}
            onDrop={() => {
              if (dragging) void move(dragging, s.id);
              setDragging(null);
            }}
          />
        ))}
      </div>

      {/* Filters */}
      <div className="mb-5 flex flex-wrap items-center gap-2">
        <TextInput
          placeholder="Search name, phone, suburb, #ref…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="!w-full sm:!w-72"
        />
        <SelectInput value={owner} onChange={(e) => setOwner(e.target.value as typeof owner)} className="w-full sm:w-44" aria-label="Owner">
          <option value="all">All owners</option>
          <option value="mine">My leads</option>
          <option value="none">Unassigned</option>
        </SelectInput>
        <SelectInput value={source} onChange={(e) => setSource(e.target.value)} className="w-full sm:w-44" aria-label="Source">
          <option value="all">All sources</option>
          {sources.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </SelectInput>
        <div className="flex flex-wrap gap-1.5">
          <FilterChip active={quick === "uncontacted"} onClick={() => setQuick(quick === "uncontacted" ? "all" : "uncontacted")}>
            Not contacted
          </FilterChip>
          <FilterChip active={quick === "today"} onClick={() => setQuick(quick === "today" ? "all" : "today")}>
            Follow up today
          </FilterChip>
          <FilterChip active={quick === "overdue"} onClick={() => setQuick(quick === "overdue" ? "all" : "overdue")}>
            Overdue {overdueCount > 0 && <span className="rounded-pill bg-danger px-1.5 text-[10px] text-white">{overdueCount}</span>}
          </FilterChip>
        </div>
        <div className="ml-auto">
          <Segmented
            value={view}
            onChange={setView}
            items={[
              { id: "board", label: "Cards" },
              { id: "table", label: "Table" },
            ]}
          />
        </div>
      </div>

      {err && <div className="mb-3 rounded-sm bg-danger-bg px-3 py-2 text-sm text-danger">{err}</div>}

      {filtered.length === 0 ? (
        <Empty>No leads match these filters.</Empty>
      ) : view === "board" ? (
        <div className="flex flex-col gap-7">
          {groups.map(({ stage, items }) => {
            const value = items.reduce((s, l) => s + (l.estimatedValue ?? 0), 0);
            return (
              <section key={stage.id}>
                <header className="mb-3 flex items-center gap-2.5">
                  <span className={`h-2.5 w-2.5 rounded-pill ${stage.dot}`} />
                  <h2 className="m-0 font-display text-[15px] font-semibold text-ink-800">{stage.label}</h2>
                  <span className="rounded-pill bg-gray-100 px-2 py-0.5 font-display text-[11px] font-semibold text-ink-600">{items.length}</span>
                  {value > 0 && <span className="text-xs text-ink-400">{money(value)} pipeline</span>}
                  <div className="ml-2 h-px flex-1 bg-border" />
                </header>
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                  {items.map((l) => (
                    <LeadCard
                      key={l._id}
                      lead={l}
                      today={today}
                      now={now}
                      ownerName={l.ownerId ? ownerName.get(l.ownerId) : undefined}
                      onOpen={() => setParam("lead", l._id)}
                      onDragStart={() => setDragging(l._id)}
                      onDragEnd={() => setDragging(null)}
                      onMove={(st) => move(l._id, st)}
                      editable={can("sales")}
                    />
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      ) : (
        <div className="overflow-x-auto rounded-[12px] border border-border bg-white">
          <table className="w-full min-w-[960px] border-collapse text-sm">
            <thead className="bg-gray-50 text-left font-display text-[11px] uppercase tracking-[1px] text-ink-400">
              <tr>
                {["Ref", "Customer", "Move date", "Route", "Source", "Stage", "Owner", "Follow-up", "Value", "Received"].map((h) => (
                  <th key={h} className="px-3 py-2.5 font-semibold">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((l) => (
                <tr key={l._id} className="border-t border-border hover:bg-gray-50 cursor-pointer" onClick={() => setParam("lead", l._id)}>
                  <td className="px-3 py-2.5 text-ink-400">{l.reference ? `#${l.reference}` : "—"}</td>
                  <td className="px-3 py-2.5">
                    <div className="font-semibold text-ink-800">{l.name}</div>
                    <a href={telHref(l.phone)} onClick={(e) => e.stopPropagation()} className="text-xs text-teal-500">
                      {l.phone}
                    </a>
                  </td>
                  <td className="px-3 py-2.5 whitespace-nowrap">{shortDate(l.moveDate)}</td>
                  <td className="max-w-[260px] px-3 py-2.5">
                    <div className="truncate">{l.movingFrom}</div>
                    <div className="truncate text-xs text-ink-400">→ {l.movingTo || "—"}</div>
                  </td>
                  <td className="px-3 py-2.5 text-xs">{l.source}</td>
                  <td className="px-3 py-2.5" onClick={(e) => e.stopPropagation()}>
                    <SelectInput
                      value={l.status}
                      disabled={!can("sales")}
                      onChange={(e) => move(l._id, e.target.value as LeadStatus)}
                      size="sm"
                      className="w-36"
                      fieldClassName={leadStatusMeta(l.status).chip}
                      aria-label="Stage"
                    >
                      {LEAD_STATUSES.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.label}
                        </option>
                      ))}
                    </SelectInput>
                  </td>
                  <td className="px-3 py-2.5 text-xs">{l.ownerId ? ownerName.get(l.ownerId) : <span className="text-ink-400">—</span>}</td>
                  <td className="px-3 py-2.5 text-xs whitespace-nowrap">
                    <FollowUp date={l.nextFollowUp} today={today} open={l.status !== "booked" && l.status !== "lost"} />
                  </td>
                  <td className="px-3 py-2.5 tabular-nums">{l.estimatedValue ? money(l.estimatedValue) : "—"}</td>
                  <td className="px-3 py-2.5 text-xs text-ink-400 whitespace-nowrap">{timeAgo(l._creationTime, now)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <LeadDrawer leadId={openLead} onClose={() => setParam("lead", null)} />
      <NewLeadModal open={newOpen} onClose={() => setNewOpen(false)} onCreated={(id) => setParam("lead", id)} />
    </>
  );
}

function FilterChip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex h-8 items-center gap-1.5 rounded-pill border-[1.5px] px-3.5 font-display text-xs font-semibold cursor-pointer transition-colors ${
        active ? "border-teal-500 bg-teal-500 text-white" : "border-border bg-white text-ink-600 hover:border-teal-200 hover:text-teal-500"
      }`}
    >
      {children}
    </button>
  );
}

function StageTile({
  label,
  dot,
  count,
  value,
  active,
  dropping = false,
  onClick,
  onDrop,
}: {
  label: string;
  dot: string;
  count: number;
  value: number;
  active: boolean;
  dropping?: boolean;
  onClick: () => void;
  onDrop?: () => void;
}) {
  const [over, setOver] = useState(false);
  return (
    <button
      type="button"
      onClick={onClick}
      onDragOver={
        onDrop
          ? (e) => {
              e.preventDefault();
              setOver(true);
            }
          : undefined
      }
      onDragLeave={() => setOver(false)}
      onDrop={
        onDrop
          ? (e) => {
              e.preventDefault();
              setOver(false);
              onDrop();
            }
          : undefined
      }
      className={`min-w-0 rounded-[12px] border-[1.5px] bg-white px-3.5 py-3 text-left transition-all cursor-pointer ${
        over
          ? "border-teal-500 bg-teal-50 shadow-raised"
          : active
            ? "border-teal-500 shadow-[inset_0_-3px_0_var(--color-teal-500)]"
            : dropping && onDrop
              ? "border-dashed border-teal-200"
              : "border-border hover:shadow-raised"
      }`}
    >
      <div className="flex items-center gap-1.5">
        <span className={`h-2 w-2 shrink-0 rounded-pill ${dot}`} />
        <span className="truncate font-display text-xs font-semibold text-ink-600">{label}</span>
      </div>
      <div className="mt-1 flex items-baseline justify-between gap-1">
        <span className="font-display text-xl font-bold tabular-nums text-ink-800">{count}</span>
        {value > 0 && <span className="truncate text-[11px] text-ink-400">{money(value)}</span>}
      </div>
    </button>
  );
}

function FollowUp({ date, today, open }: { date: string | null; today: string; open: boolean }) {
  if (!date) return <span className="text-ink-400">—</span>;
  if (open && date < today) return <span className="font-semibold text-danger">⚠ {shortDate(date)}</span>;
  if (open && date === today) return <span className="font-semibold text-amber-700">Today</span>;
  return <span>{shortDate(date)}</span>;
}

function LeadCard({
  lead,
  today,
  now,
  ownerName,
  onOpen,
  onDragStart,
  onDragEnd,
  onMove,
  editable,
}: {
  lead: Row;
  today: string;
  now: number;
  ownerName?: string;
  onOpen: () => void;
  onDragStart: () => void;
  onDragEnd: () => void;
  onMove: (s: LeadStatus) => void;
  editable: boolean;
}) {
  const open = lead.status !== "booked" && lead.status !== "lost";
  // Speed-to-lead: a New lead older than 15 minutes is flagged.
  const stale = lead.status === "new" && now - lead._creationTime > 15 * 60_000;
  const meta = leadStatusMeta(lead.status);
  return (
    <article
      draggable={editable}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onClick={onOpen}
      className="group flex min-w-0 flex-col rounded-[12px] border border-border bg-white p-4 transition-shadow hover:shadow-raised cursor-pointer"
    >
      <div className="flex items-start gap-3">
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-sm bg-teal-100 font-display text-sm font-bold text-teal-500">
          {initials(lead.name)}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="truncate font-display text-[15px] font-semibold text-ink-800">{lead.name}</span>
            {lead.reference && <span className="shrink-0 text-[11px] text-ink-400">#{lead.reference}</span>}
          </div>
          <a href={telHref(lead.phone)} onClick={(e) => e.stopPropagation()} className="text-xs font-semibold text-teal-500 no-underline hover:underline">
            {lead.phone}
          </a>
        </div>
        <span className="shrink-0 text-[11px] text-ink-400">{timeAgo(lead._creationTime, now)}</span>
      </div>

      <div className="mt-3 rounded-sm bg-gray-50 px-3 py-2 text-xs">
        <div className="truncate text-ink-800">
          <span className="text-ink-400">From </span>
          {lead.movingFrom || "—"}
        </div>
        <div className="truncate text-ink-800">
          <span className="text-ink-400">To </span>
          {lead.movingTo || "—"}
        </div>
      </div>

      <div className="mt-3 mb-3 flex flex-wrap items-center gap-1.5">
        <Chip className="border-border bg-white text-ink-600">{shortDate(lead.moveDate)}</Chip>
        {lead.bedrooms && <Chip className="border-border bg-white text-ink-600">{lead.bedrooms}</Chip>}
        {lead.estimatedValue ? <Chip className="border-success-border bg-success-bg text-ink-800">{money(lead.estimatedValue)}</Chip> : null}
        {open && lead.nextFollowUp && lead.nextFollowUp < today && <Chip className="border-danger-border bg-danger-bg text-danger">Follow-up overdue</Chip>}
        {open && lead.nextFollowUp === today && <Chip className="border-amber-200 bg-amber-50 text-amber-800">Follow up today</Chip>}
        {stale && <Chip className="border-danger-border bg-danger-bg text-danger">Waiting {timeAgo(lead._creationTime, now)}</Chip>}
      </div>

      <div className="mt-auto flex items-center justify-between gap-2 border-t border-border pt-3">
        <div className="min-w-0 truncate text-[11px] text-ink-400">
          {ownerName ?? "Unassigned"} · {lead.source}
        </div>
        <div onClick={(e) => e.stopPropagation()}>
          <SelectInput
            size="sm"
            className="w-36"
            fieldClassName={meta.chip}
            value={lead.status}
            disabled={!editable}
            onChange={(e) => onMove(e.target.value as LeadStatus)}
            aria-label="Stage"
          >
            {LEAD_STATUSES.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label}
              </option>
            ))}
          </SelectInput>
        </div>
      </div>
    </article>
  );
}

function initials(name: string) {
  return (
    name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((w) => w[0]!.toUpperCase())
      .join("") || "?"
  );
}

function NewLeadModal({
  open,
  onClose,
  onCreated,
}: {
  open: boolean;
  onClose: () => void;
  onCreated: (id: Id<"quoteRequests">) => void;
}) {
  const { token } = useSession();
  const create = useMutation(api.crm.leads.create);
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const get = (k: string) => String(f.get(k) ?? "");
    setBusy(true);
    setErr(null);
    try {
      const id = await create({
        token,
        name: get("name"),
        phone: get("phone"),
        email: get("email"),
        moveDate: get("moveDate"),
        movingFrom: get("movingFrom"),
        movingTo: get("movingTo"),
        source: get("source"),
      });
      onClose();
      onCreated(id);
    } catch (e2) {
      setErr(errorText(e2));
    } finally {
      setBusy(false);
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="New lead">
      <form onSubmit={submit} className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Field label="Customer name *">{(id) => <TextInput id={id} name="name" required />}</Field>
        <Field label="Phone *">{(id) => <TextInput id={id} name="phone" type="tel" required />}</Field>
        <Field label="Email">{(id) => <TextInput id={id} name="email" type="email" />}</Field>
        <Field label="Move date">{(id) => <TextInput id={id} name="moveDate" type="date" />}</Field>
        <Field label="Moving from" className="sm:col-span-2">{(id) => <TextInput id={id} name="movingFrom" placeholder="Suburb or address" />}</Field>
        <Field label="Moving to" className="sm:col-span-2">{(id) => <TextInput id={id} name="movingTo" placeholder="Suburb or address" />}</Field>
        <Field label="Source">
          {(id) => (
            <SelectInput id={id} name="source" defaultValue="phone">
              {LEAD_SOURCES.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </SelectInput>
          )}
        </Field>
        {err && <div className="sm:col-span-2 rounded-sm bg-danger-bg px-3 py-2 text-sm text-danger">{err}</div>}
        <div className="flex justify-end gap-2 sm:col-span-2">
          <Btn variant="ghost" onClick={onClose}>
            Cancel
          </Btn>
          <Btn type="submit" disabled={busy}>
            {busy ? "Saving…" : "Create lead"}
          </Btn>
        </div>
      </form>
    </Modal>
  );
}
