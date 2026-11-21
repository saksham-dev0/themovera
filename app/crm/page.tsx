"use client";

import Link from "next/link";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { PageHeader } from "@/components/crm/CrmShell";
import { useSession } from "@/components/crm/session";
import { Chip, Loading, Panel, Stat } from "@/components/crm/ui";
import { LEAD_STATUSES, jobStatusMeta, leadStatusMeta, slotMeta } from "@/lib/crm/constants";
import { addDays, money, timeAgo } from "@/lib/crm/format";
import { useClock } from "@/lib/crm/useClock";

export default function Overview() {
  const { token, me } = useSession();
  const { now, today } = useClock();
  const data = useQuery(api.crm.dashboard.overview, { token, today, weekEnd: addDays(today, 6), now });

  if (!data) return <Loading />;
  const pipelineTotal = Object.values(data.statusCounts).reduce((a, b) => a + b, 0) || 1;
  const sources = Object.entries(data.sourceCounts).sort((a, b) => b[1] - a[1]);
  const maxSource = Math.max(1, ...sources.map(([, n]) => n));

  return (
    <>
      <PageHeader title={`G'day, ${me.name.split(" ")[0]}`} sub="Here's what needs attention today." />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 xl:grid-cols-6">
        <Stat label="New leads today" value={data.newToday} sub={`${data.new7} this week`} />
        <Stat label="Not contacted" value={data.uncontacted} tone={data.uncontacted ? "warn" : "default"} sub="status still New" />
        <Stat label="Overdue follow-ups" value={data.overdueFollowUps} tone={data.overdueFollowUps ? "warn" : "default"} />
        <Stat
          label="Win rate (30d)"
          value={data.conversionRate === null ? "—" : `${data.conversionRate}%`}
          sub={`${data.booked30} booked · ${money(data.bookedValue30)}`}
          tone="good"
        />
        <Stat label="Open quotes" value={data.openQuotes} sub={money(data.openQuotesValue)} />
        <Stat
          label="Avg first response"
          value={data.avgResponseMins === null ? "—" : data.avgResponseMins < 120 ? `${data.avgResponseMins}m` : `${Math.round(data.avgResponseMins / 60)}h`}
          sub="lead → first contact"
        />
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-3">
        <Panel
          title="Sales pipeline"
          actions={<Link href="/crm/sales" className="text-xs font-semibold text-teal-500">Open sales →</Link>}
          className="xl:col-span-2"
        >
          <div className="flex h-3 overflow-hidden rounded-pill bg-gray-100">
            {LEAD_STATUSES.map((s) => {
              const n = data.statusCounts[s.id] ?? 0;
              return n ? <div key={s.id} className={s.dot} style={{ width: `${(n / pipelineTotal) * 100}%` }} title={`${s.label}: ${n}`} /> : null;
            })}
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-7">
            {LEAD_STATUSES.map((s) => (
              <Link key={s.id} href={`/crm/sales?status=${s.id}`} className="rounded-sm border border-border p-2.5 no-underline hover:bg-gray-50">
                <div className="flex items-center gap-1.5 text-[11px] font-semibold text-ink-600">
                  <span className={`h-2 w-2 rounded-pill ${s.dot}`} />
                  {s.label}
                </div>
                <div className="mt-1 font-display text-xl font-bold text-ink-800 tabular-nums">{data.statusCounts[s.id] ?? 0}</div>
              </Link>
            ))}
          </div>

          <h3 className="mb-2 mt-6 text-xs font-semibold uppercase tracking-wide text-ink-400">Lead sources · last 30 days</h3>
          {sources.length === 0 ? (
            <div className="text-sm text-ink-400">No leads in the last 30 days.</div>
          ) : (
            <div className="flex flex-col gap-1.5">
              {sources.map(([src, n]) => (
                <div key={src} className="flex items-center gap-3 text-sm">
                  <div className="w-28 shrink-0 truncate capitalize text-ink-600">{src.replace(/-/g, " ")}</div>
                  <div className="h-2 flex-1 rounded-pill bg-gray-100">
                    <div className="h-2 rounded-pill bg-teal-500" style={{ width: `${(n / maxSource) * 100}%` }} />
                  </div>
                  <div className="w-8 text-right tabular-nums text-ink-800">{n}</div>
                </div>
              ))}
            </div>
          )}
        </Panel>

        <Panel
          title={`Today's jobs · ${data.jobsToday}`}
          actions={<Link href="/crm/operations" className="text-xs font-semibold text-teal-500">Schedule →</Link>}
        >
          <div className="mb-3 flex gap-4 text-xs text-ink-400">
            <span>{data.jobsWeek} jobs next 7 days</span>
            {data.unassignedJobs > 0 && <span className="font-semibold text-danger">{data.unassignedJobs} unassigned</span>}
          </div>
          {data.todayJobs.length === 0 ? (
            <div className="text-sm text-ink-400">No jobs today.</div>
          ) : (
            <div className="flex flex-col gap-2">
              {data.todayJobs.map((j) => {
                const slot = slotMeta(j.timeSlot);
                const st = jobStatusMeta(j.status);
                return (
                  <div key={j._id} className={`rounded-sm border-l-4 border ${slot.card} px-3 py-2`}>
                    <div className="flex items-center justify-between gap-2">
                      <div className={`text-sm font-semibold ${slot.text}`}>{j.customerName}</div>
                      <Chip className={st.chip}>{st.label}</Chip>
                    </div>
                    <div className="text-xs text-ink-600">
                      {slot.label} ({slot.window}) · {j.assignees} assigned
                    </div>
                    <div className="truncate text-xs text-ink-400">{j.pickupAddress}</div>
                  </div>
                );
              })}
            </div>
          )}
        </Panel>
      </div>

      <Panel title="Latest leads" className="mt-5" pad={false}>
        <ul className="m-0 list-none divide-y divide-border p-0">
          {data.recentLeads.map((l) => {
            const s = leadStatusMeta(l.status);
            return (
              <li key={l._id}>
                <Link href={`/crm/sales?lead=${l._id}`} className="flex items-center justify-between gap-3 px-4 py-3 no-underline hover:bg-gray-50">
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-ink-800">{l.name}</div>
                    <div className="truncate text-xs text-ink-400">{l.movingFrom}</div>
                  </div>
                  <div className="flex shrink-0 items-center gap-3">
                    <Chip className={s.chip}>{s.label}</Chip>
                    <span className="w-16 text-right text-xs text-ink-400">{timeAgo(l._creationTime, now)}</span>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </Panel>
    </>
  );
}
