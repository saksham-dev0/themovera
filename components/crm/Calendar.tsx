"use client";

import { useMemo, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Doc, Id } from "@/convex/_generated/dataModel";
import { useCan, useSession } from "./session";
import { draftFromJob, type JobDraft } from "./JobModal";
import { Chevron, Loading, Modal, Segmented, errorText } from "./ui";
import { TIME_SLOTS, slotMeta } from "@/lib/crm/constants";
import { addDays, weekStart } from "@/lib/crm/format";
import { useClock } from "@/lib/crm/useClock";

/**
 * Notion-style schedule: a clean month grid with event pills, and a week
 * view on an hourly time grid. Drag a job to another day to reschedule it;
 * hover a day and press + to assign a lead on that date.
 */

type Job = Doc<"jobs">;
type Names = Map<Id<"resources">, Doc<"resources">>;

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const DAY_START = 6; // 6 AM
const DAY_END = 20; // 8 PM
const HOUR_PX = 52;

const ymdParts = (ymd: string) => ymd.split("-").map(Number) as [number, number, number];
const monthKey = (ymd: string) => ymd.slice(0, 7);
const firstOfMonth = (ymd: string) => `${ymd.slice(0, 7)}-01`;
const dayNum = (ymd: string) => ymdParts(ymd)[2];

function addMonths(ymd: string, n: number) {
  const [y, m] = ymdParts(ymd);
  const d = new Date(Date.UTC(y, m - 1 + n, 1));
  return d.toISOString().slice(0, 10);
}

function monthLabel(ymd: string) {
  const [y, m] = ymdParts(ymd);
  return `${MONTHS[m - 1]} ${y}`;
}

function startHour(j: Job) {
  const t = j.startTime ?? slotMeta(j.timeSlot).start;
  const [h, min] = t.split(":").map(Number);
  return h + min / 60;
}

function fmtHour(h: number) {
  const hh = Math.floor(h);
  const mm = Math.round((h - hh) * 60);
  const suffix = hh >= 12 ? "pm" : "am";
  const h12 = hh % 12 === 0 ? 12 : hh % 12;
  return mm ? `${h12}:${String(mm).padStart(2, "0")}${suffix}` : `${h12}${suffix}`;
}

const byTime = (a: Job, b: Job) => startHour(a) - startHour(b);

function melbourneHour(ms: number) {
  const [h, m] = new Date(ms)
    .toLocaleTimeString("en-GB", { timeZone: "Australia/Melbourne", hour: "2-digit", minute: "2-digit", hour12: false })
    .split(":")
    .map(Number);
  return h + m / 60;
}

export function ScheduleCalendar({
  today,
  onOpen,
  onAdd,
}: {
  today: string;
  onOpen: (d: JobDraft) => void;
  onAdd: (date: string) => void;
}) {
  const { token } = useSession();
  const can = useCan();
  const [mode, setMode] = useState<"month" | "week">("month");
  const [cursor, setCursor] = useState(today);
  const [dayList, setDayList] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const updateJob = useMutation(api.crm.operations.updateJob);
  const resources = useQuery(api.crm.operations.listResources, { token, includeInactive: true });
  const names: Names = useMemo(() => new Map((resources ?? []).map((r) => [r._id, r])), [resources]);

  // Visible range.
  const { from, to, days } = useMemo(() => {
    if (mode === "week") {
      const s = weekStart(cursor);
      return { from: s, to: addDays(s, 6), days: Array.from({ length: 7 }, (_, i) => addDays(s, i)) };
    }
    const first = firstOfMonth(cursor);
    const gridStart = weekStart(first);
    const nextMonth = addMonths(first, 1);
    const out: string[] = [];
    for (let d = gridStart; d < nextMonth || out.length % 7 !== 0; d = addDays(d, 1)) out.push(d);
    return { from: out[0], to: out[out.length - 1], days: out };
  }, [mode, cursor]);

  const jobs = useQuery(api.crm.operations.listJobs, { token, from, to });
  const byDay = useMemo(() => {
    const m = new Map<string, Job[]>();
    for (const j of jobs ?? []) {
      const list = m.get(j.date) ?? [];
      list.push(j);
      m.set(j.date, list);
    }
    for (const list of m.values()) list.sort(byTime);
    return m;
  }, [jobs]);

  const editable = can("operations");

  async function moveJob(jobId: Id<"jobs">, date: string) {
    const job = jobs?.find((j) => j._id === jobId);
    if (!job || job.date === date) return;
    setErr(null);
    const d = draftFromJob(job);
    try {
      await updateJob({
        token,
        jobId,
        date,
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
      });
    } catch (e) {
      setErr(errorText(e));
    }
  }

  const step = (n: number) => setCursor(mode === "week" ? addDays(cursor, 7 * n) : addMonths(firstOfMonth(cursor), n));
  const live = (jobs ?? []).filter((j) => j.status !== "cancelled");
  const inView = mode === "month" ? live.filter((j) => monthKey(j.date) === monthKey(cursor)) : live;

  return (
    <div className="overflow-hidden rounded-[12px] border border-border bg-white">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3 px-4 py-3.5 sm:px-5">
        <h2 className="m-0 font-display text-xl font-bold text-ink-800">
          {mode === "month" ? monthLabel(cursor) : weekTitle(from, to)}
        </h2>
        {jobs && (
          <span className="text-xs text-ink-400">
            {inView.length} job{inView.length === 1 ? "" : "s"}
            {inView.some((j) => j.status === "unassigned") && (
              <span className="font-semibold text-danger"> · {inView.filter((j) => j.status === "unassigned").length} unassigned</span>
            )}
          </span>
        )}
        <div className="ml-auto flex items-center gap-2">
          <Segmented
            value={mode}
            onChange={setMode}
            items={[
              { id: "month", label: "Month" },
              { id: "week", label: "Week" },
            ]}
          />
          <button
            type="button"
            onClick={() => setCursor(today)}
            className="h-8 rounded-sm border-[1.5px] border-border bg-white px-3 font-display text-xs font-semibold text-ink-800 hover:bg-gray-50 cursor-pointer"
          >
            Today
          </button>
          <div className="flex">
            <IconBtn label="Previous" onClick={() => step(-1)}>
              <Chevron dir="left" />
            </IconBtn>
            <IconBtn label="Next" onClick={() => step(1)}>
              <Chevron dir="right" />
            </IconBtn>
          </div>
        </div>
      </div>
      {err && <div className="mx-5 mb-3 rounded-sm bg-danger-bg px-3 py-2 text-sm text-danger">{err}</div>}

      {!jobs ? (
        <Loading />
      ) : mode === "month" ? (
        <MonthGrid
          days={days}
          month={monthKey(cursor)}
          today={today}
          byDay={byDay}
          names={names}
          editable={editable}
          onOpen={(j) => onOpen(draftFromJob(j))}
          onAdd={onAdd}
          onMore={setDayList}
          onMove={moveJob}
        />
      ) : (
        <WeekGrid
          days={days}
          today={today}
          byDay={byDay}
          names={names}
          editable={editable}
          onOpen={(j) => onOpen(draftFromJob(j))}
          onAdd={onAdd}
          onMove={moveJob}
        />
      )}

      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 px-5 py-2.5 text-[11px] text-ink-400">
        {TIME_SLOTS.map((s) => (
          <span key={s.id} className="inline-flex items-center gap-1.5">
            <span className={`h-2 w-2 rounded-pill ${s.dot}`} />
            {s.label} {s.window}
          </span>
        ))}
        {editable && (
          <span className="ml-auto">
            Drag a job to another day to move it · {mode === "month" ? "hover a day and press +" : "double-click a day"} to assign a lead
          </span>
        )}
      </div>

      <Modal open={dayList !== null} onClose={() => setDayList(null)} title={dayList ? longDate(dayList) : ""}>
        <div className="flex flex-col gap-1.5">
          {(dayList ? (byDay.get(dayList) ?? []) : []).map((j) => (
            <EventPill
              key={j._id}
              job={j}
              names={names}
              detailed
              onOpen={() => {
                setDayList(null);
                onOpen(draftFromJob(j));
              }}
            />
          ))}
        </div>
      </Modal>
    </div>
  );
}

function weekTitle(from: string, to: string) {
  const [, fm, fd] = ymdParts(from);
  const [ty, tm, td] = ymdParts(to);
  return fm === tm ? `${MONTHS[fm - 1]} ${fd}–${td}, ${ty}` : `${MONTHS[fm - 1].slice(0, 3)} ${fd} – ${MONTHS[tm - 1].slice(0, 3)} ${td}, ${ty}`;
}

function longDate(ymd: string) {
  const [y, m, d] = ymdParts(ymd);
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString("en-AU", {
    weekday: "long",
    day: "numeric",
    month: "long",
    timeZone: "UTC",
  });
}

function IconBtn({ label, onClick, children }: { label: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="grid h-8 w-8 place-items-center rounded-sm text-ink-600 hover:bg-gray-100 cursor-pointer"
    >
      {children}
    </button>
  );
}

function DayNumber({ ymd, today, showMonth }: { ymd: string; today: string; showMonth?: boolean }) {
  const isToday = ymd === today;
  const [, m, d] = ymdParts(ymd);
  return (
    <span
      className={`inline-grid h-6 min-w-6 place-items-center rounded-pill px-1.5 text-xs tabular-nums ${
        isToday ? "bg-danger font-bold text-white" : "text-ink-600"
      }`}
    >
      {showMonth && !isToday ? `${MONTHS[m - 1].slice(0, 3)} ${d}` : d}
    </span>
  );
}

function EventPill({
  job,
  names,
  onOpen,
  detailed = false,
  draggable = false,
}: {
  job: Job;
  names: Names;
  onOpen: () => void;
  detailed?: boolean;
  draggable?: boolean;
}) {
  const slot = slotMeta(job.timeSlot);
  const who = job.assigneeIds.map((id) => names.get(id)?.name ?? "?");
  const cancelled = job.status === "cancelled";
  return (
    <button
      type="button"
      draggable={draggable}
      onDragStart={(e) => {
        e.dataTransfer.setData("text/job", job._id);
        e.dataTransfer.effectAllowed = "move";
      }}
      onClick={(e) => {
        e.stopPropagation();
        onOpen();
      }}
      title={`${job.customerName} · ${slot.label} ${slot.window}${who.length ? ` · ${who.join(", ")}` : " · Unassigned"}`}
      className={`group/ev flex w-full min-w-0 items-center gap-1.5 rounded-[6px] border border-border bg-white px-1.5 py-1 text-left shadow-[0_1px_2px_rgba(24,44,38,0.06)] transition-colors hover:bg-gray-50 cursor-pointer ${
        cancelled ? "opacity-50" : ""
      }`}
    >
      <span className={`h-full min-h-3.5 w-[3px] shrink-0 self-stretch rounded-pill ${slot.dot}`} />
      <span className="min-w-0 flex-1">
        <span className={`block truncate text-[11px] font-semibold leading-tight text-ink-800 ${cancelled ? "line-through" : ""}`}>
          {job.customerName}
        </span>
        {detailed ? (
          <span className="block truncate text-[11px] leading-tight text-ink-400">
            {job.startTime ? fmtHour(startHour(job)) : slot.window} · {job.pickupAddress}
          </span>
        ) : (
          <span className="hidden truncate text-[10px] leading-tight text-ink-400 sm:block">
            {job.startTime ? fmtHour(startHour(job)) : slot.window}
          </span>
        )}
        {detailed && (
          <span className={`block truncate text-[11px] leading-tight ${who.length ? "text-ink-600" : "font-semibold text-danger"}`}>
            {who.length ? who.join(", ") : "Unassigned"}
          </span>
        )}
      </span>
      {!detailed && job.assigneeIds.length === 0 && !cancelled && (
        <span className="h-1.5 w-1.5 shrink-0 rounded-pill bg-danger" title="Unassigned" />
      )}
    </button>
  );
}

// ─────────────────────────────── Month ───────────────────────────────

const MAX_PILLS = 3;

function MonthGrid({
  days,
  month,
  today,
  byDay,
  names,
  editable,
  onOpen,
  onAdd,
  onMore,
  onMove,
}: {
  days: string[];
  month: string;
  today: string;
  byDay: Map<string, Job[]>;
  names: Names;
  editable: boolean;
  onOpen: (j: Job) => void;
  onAdd: (date: string) => void;
  onMore: (date: string) => void;
  onMove: (jobId: Id<"jobs">, date: string) => void;
}) {
  const [over, setOver] = useState<string | null>(null);
  return (
    <div>
      <div className="grid grid-cols-7 border-y border-border">
        {WEEKDAYS.map((d, i) => (
          <div key={d} className={`px-2 py-1.5 text-[11px] font-semibold text-ink-400 ${i ? "border-l border-border" : ""}`}>
            {d}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7">
        {days.map((day, i) => {
          const list = byDay.get(day) ?? [];
          const outside = monthKey(day) !== month;
          const weekend = i % 7 >= 5;
          const shown = list.length > MAX_PILLS ? list.slice(0, MAX_PILLS - 1) : list;
          const hidden = list.length - shown.length;
          return (
            <div
              key={day}
              onDragOver={
                editable
                  ? (e) => {
                      e.preventDefault();
                      setOver(day);
                    }
                  : undefined
              }
              onDragLeave={() => setOver((o) => (o === day ? null : o))}
              onDrop={(e) => {
                e.preventDefault();
                setOver(null);
                const id = e.dataTransfer.getData("text/job");
                if (id) onMove(id as Id<"jobs">, day);
              }}
              className={`group relative flex min-h-[104px] min-w-0 flex-col gap-1 border-b border-border p-1 sm:min-h-[124px] sm:p-1.5 ${
                i % 7 ? "border-l" : ""
              } ${over === day ? "bg-teal-50" : weekend || outside ? "bg-gray-50" : "bg-white"}`}
            >
              <div className="flex items-center justify-between">
                {editable ? (
                  <button
                    type="button"
                    onClick={() => onAdd(day)}
                    aria-label={`Assign a lead on ${day}`}
                    className="grid h-6 w-6 place-items-center rounded-[6px] text-sm leading-none text-ink-400 opacity-0 hover:bg-gray-100 hover:text-ink-800 group-hover:opacity-100 focus:opacity-100 cursor-pointer"
                  >
                    +
                  </button>
                ) : (
                  <span />
                )}
                <span className={outside ? "opacity-50" : ""}>
                  <DayNumber ymd={day} today={today} showMonth={dayNum(day) === 1} />
                </span>
              </div>
              {shown.map((j) => (
                <EventPill key={j._id} job={j} names={names} draggable={editable} onOpen={() => onOpen(j)} />
              ))}
              {hidden > 0 && (
                <button
                  type="button"
                  onClick={() => onMore(day)}
                  className="rounded-[6px] px-1.5 py-0.5 text-left text-[11px] font-semibold text-ink-400 hover:bg-gray-100 hover:text-ink-800 cursor-pointer"
                >
                  {hidden} more
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─────────────────────────────── Week ───────────────────────────────

/** Side-by-side lanes for overlapping jobs within one day. */
function layout(list: Job[]) {
  const items = list
    .filter((j) => j.status !== "cancelled")
    .map((j) => {
      const s = Math.max(DAY_START, Math.min(DAY_END - 0.5, startHour(j)));
      return { job: j, start: s, end: Math.min(DAY_END, s + Math.max(0.75, j.estimatedHours || 1)), lane: 0, lanes: 1 };
    })
    .sort((a, b) => a.start - b.start);
  let cluster: typeof items = [];
  let clusterEnd = -1;
  const flush = () => {
    const n = Math.max(...cluster.map((c) => c.lane)) + 1;
    for (const c of cluster) c.lanes = n;
    cluster = [];
  };
  for (const it of items) {
    if (cluster.length && it.start >= clusterEnd) flush();
    const used = new Set(cluster.filter((c) => c.end > it.start).map((c) => c.lane));
    let lane = 0;
    while (used.has(lane)) lane++;
    it.lane = lane;
    cluster.push(it);
    clusterEnd = Math.max(clusterEnd, it.end);
  }
  if (cluster.length) flush();
  return items;
}

function WeekGrid({
  days,
  today,
  byDay,
  names,
  editable,
  onOpen,
  onAdd,
  onMove,
}: {
  days: string[];
  today: string;
  byDay: Map<string, Job[]>;
  names: Names;
  editable: boolean;
  onOpen: (j: Job) => void;
  onAdd: (date: string) => void;
  onMove: (jobId: Id<"jobs">, date: string) => void;
}) {
  const { now } = useClock(1);
  const nowH = melbourneHour(now);
  const hours = Array.from({ length: DAY_END - DAY_START }, (_, i) => DAY_START + i);
  const [over, setOver] = useState<string | null>(null);

  return (
    <div>
      {/* Day headers */}
      <div className="grid grid-cols-[44px_repeat(7,minmax(0,1fr))] border-y border-border sm:grid-cols-[56px_repeat(7,minmax(0,1fr))]">
        <div />
        {days.map((day, i) => (
          <div key={day} className={`group flex flex-col items-center gap-0.5 border-l border-border py-2 ${i >= 5 ? "bg-gray-50" : ""}`}>
            <span className="text-[11px] font-semibold text-ink-400">{WEEKDAYS[i]}</span>
            <DayNumber ymd={day} today={today} />
          </div>
        ))}
      </div>

      {/* Time grid */}
      <div className="relative grid grid-cols-[44px_repeat(7,minmax(0,1fr))] sm:grid-cols-[56px_repeat(7,minmax(0,1fr))]">
        <div className="relative" style={{ height: hours.length * HOUR_PX }}>
          {hours.map((h, i) => (
            <div key={h} className="absolute right-1.5 -translate-y-1/2 text-[10px] text-ink-400 sm:right-2" style={{ top: i * HOUR_PX }}>
              {i === 0 ? "" : fmtHour(h).toUpperCase()}
            </div>
          ))}
        </div>
        {days.map((day, di) => {
          const items = layout(byDay.get(day) ?? []);
          const isToday = day === today;
          return (
            <div
              key={day}
              className={`relative border-l border-border ${over === day ? "bg-teal-50" : di >= 5 ? "bg-gray-50" : ""}`}
              style={{ height: hours.length * HOUR_PX }}
              onDragOver={
                editable
                  ? (e) => {
                      e.preventDefault();
                      setOver(day);
                    }
                  : undefined
              }
              onDragLeave={() => setOver((o) => (o === day ? null : o))}
              onDrop={(e) => {
                e.preventDefault();
                setOver(null);
                const id = e.dataTransfer.getData("text/job");
                if (id) onMove(id as Id<"jobs">, day);
              }}
              onDoubleClick={editable ? () => onAdd(day) : undefined}
            >
              {hours.map((h, i) => (
                <div key={h} className="absolute inset-x-0 border-t border-border/70" style={{ top: i * HOUR_PX }} />
              ))}
              {items.map(({ job, start, end, lane, lanes }) => {
                const slot = slotMeta(job.timeSlot);
                const who = job.assigneeIds.map((id) => names.get(id)?.name ?? "?");
                const height = (end - start) * HOUR_PX - 2;
                return (
                  <button
                    key={job._id}
                    type="button"
                    draggable={editable}
                    onDragStart={(e) => {
                      e.dataTransfer.setData("text/job", job._id);
                      e.dataTransfer.effectAllowed = "move";
                    }}
                    onClick={() => onOpen(job)}
                    className={`absolute overflow-hidden rounded-[6px] border border-l-[3px] px-1.5 py-1 text-left shadow-[0_1px_2px_rgba(24,44,38,0.08)] hover:shadow-raised cursor-pointer ${slot.card}`}
                    style={{
                      top: (start - DAY_START) * HOUR_PX + 1,
                      height,
                      left: `calc(${(lane / lanes) * 100}% + 2px)`,
                      width: `calc(${100 / lanes}% - 4px)`,
                    }}
                    title={`${job.customerName} · ${fmtHour(start)}–${fmtHour(end)}`}
                  >
                    <span className={`block truncate text-[11px] font-bold leading-tight ${slot.text}`}>{job.customerName}</span>
                    <span className="block truncate text-[10px] leading-tight text-ink-600">
                      {fmtHour(start)}–{fmtHour(end)}
                    </span>
                    {height > 46 && (
                      <span className={`block truncate text-[10px] leading-tight ${who.length ? "text-ink-800" : "font-semibold text-danger"}`}>
                        {who.length ? who.join(", ") : "Unassigned"}
                      </span>
                    )}
                  </button>
                );
              })}
              {isToday && nowH >= DAY_START && nowH <= DAY_END && (
                <div className="pointer-events-none absolute inset-x-0 z-10" style={{ top: (nowH - DAY_START) * HOUR_PX }}>
                  <div className="absolute -left-1 -top-1 h-2 w-2 rounded-pill bg-danger" />
                  <div className="h-[2px] bg-danger" />
                </div>
              )}
            </div>
          );
        })}
      </div>

    </div>
  );
}
