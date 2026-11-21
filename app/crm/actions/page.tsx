"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { PageHeader } from "@/components/crm/CrmShell";
import { useCan, useSession } from "@/components/crm/session";
import { Btn, Chip, Empty, Loading, Modal, Tabs, TextInput, errorText } from "@/components/crm/ui";
import { ESTIMATE_STATUSES, estimateStatusMeta, leadStatusMeta, type EstimateStatus } from "@/lib/crm/constants";
import { money, shortDate, timeAgo } from "@/lib/crm/format";
import { STEPS } from "@/components/crm/quote/steps";

export default function ActionsPage() {
  const { token } = useSession();
  const can = useCan();
  const quotes = useQuery(api.crm.estimates.list, { token });
  const [filter, setFilter] = useState<EstimateStatus | "all">("all");
  const [pick, setPick] = useState(false);
  const [toDelete, setToDelete] = useState<{ id: Id<"estimates">; number: number; customer: string; status: EstimateStatus } | null>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const router = useRouter();
  const remove = useMutation(api.crm.estimates.remove);
  const duplicate = useMutation(api.crm.estimates.duplicate);

  const rows = useMemo(() => (quotes ?? []).filter((q) => filter === "all" || q.status === filter), [quotes, filter]);
  if (!quotes) return <Loading />;

  return (
    <>
      <PageHeader
        title="Actions · Quotations"
        sub="Build a quote step by step: move info → inventory → materials → labour → storage → quotation."
        actions={can("sales") && <Btn onClick={() => setPick(true)}>+ New quotation</Btn>}
      />

      <Tabs
        value={filter}
        onChange={setFilter}
        items={[{ id: "all" as const, label: "All" }, ...ESTIMATE_STATUSES].map((s) => ({
          id: s.id,
          label: s.label,
          badge: s.id === "all" ? quotes.length : quotes.filter((q) => q.status === s.id).length,
        }))}
      />
      {err && <div className="mb-3 rounded-sm bg-danger-bg px-3 py-2 text-sm text-danger">{err}</div>}

      {rows.length === 0 ? (
        <Empty>No quotations yet. Start one from a lead in Sales, or press “New quotation”.</Empty>
      ) : (
        <div className="overflow-x-auto rounded-[12px] border border-border bg-white">
          <table className="w-full min-w-[980px] border-collapse text-sm">
            <thead className="bg-gray-50 text-left font-display text-[11px] uppercase tracking-[1px] text-ink-400">
              <tr>
                {["Quote", "Customer", "Move date", "Route", "Progress", "Total", "Status", "Updated", ""].map((h) => (
                  <th key={h} className="px-3 py-2.5 font-semibold">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((q) => {
                const s = estimateStatusMeta(q.status);
                return (
                  <tr key={q._id} className="border-t border-border hover:bg-gray-50">
                    <td className="px-3 py-2.5">
                      <Link href={`/crm/actions/${q._id}`} className="font-semibold text-teal-500">
                        Q-{q.number}
                      </Link>
                    </td>
                    <td className="px-3 py-2.5 font-semibold text-ink-800">{q.customerName}</td>
                    <td className="px-3 py-2.5 whitespace-nowrap">{shortDate(q.moveDate)}</td>
                    <td className="max-w-[240px] px-3 py-2.5">
                      <div className="truncate">{q.from}</div>
                      <div className="truncate text-xs text-ink-400">→ {q.to || "—"}</div>
                    </td>
                    <td className="px-3 py-2.5">
                      <div className="flex gap-0.5">
                        {STEPS.map((st, i) => (
                          <span key={st.id} title={st.label} className={`h-1.5 w-5 rounded-pill ${i <= q.step ? "bg-teal-500" : "bg-gray-100"}`} />
                        ))}
                      </div>
                    </td>
                    <td className="px-3 py-2.5 tabular-nums font-semibold">
                      {q.low !== q.high ? `${money(q.low)}–${money(q.high)}` : money(q.total)}
                    </td>
                    <td className="px-3 py-2.5">
                      <Chip className={s.chip}>{s.label}</Chip>
                    </td>
                    <td className="px-3 py-2.5 text-xs text-ink-400">{q.sentAt ? `sent ${timeAgo(q.sentAt)}` : timeAgo(q._creationTime)}</td>
                    <td className="px-3 py-2.5">
                      <div className="flex justify-end gap-1.5">
                        <Link
                          href={`/crm/actions/${q._id}`}
                          className="inline-flex h-8 items-center rounded-sm border-[1.5px] border-teal-500 bg-white px-3 font-display text-xs font-semibold text-teal-500 no-underline hover:bg-teal-50"
                        >
                          {can("sales") ? "Edit" : "View"}
                        </Link>
                        {can("sales") && (
                          <>
                            <Btn
                              size="sm"
                              variant="ghost"
                              title="Copy into a new draft"
                              disabled={busy}
                              onClick={async () => {
                                setErr(null);
                                setBusy(true);
                                try {
                                  const id = await duplicate({ token, estimateId: q._id });
                                  router.push(`/crm/actions/${id}`);
                                } catch (e) {
                                  setErr(errorText(e));
                                } finally {
                                  setBusy(false);
                                }
                              }}
                            >
                              Duplicate
                            </Btn>
                            <Btn
                              size="sm"
                              variant="danger"
                              disabled={q.status === "accepted"}
                              title={q.status === "accepted" ? "Accepted quotes can't be deleted" : "Delete quotation"}
                              onClick={() => setToDelete({ id: q._id, number: q.number, customer: q.customerName, status: q.status })}
                            >
                              Delete
                            </Btn>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <PickLeadModal open={pick} onClose={() => setPick(false)} />
      <Modal
        open={toDelete !== null}
        onClose={() => setToDelete(null)}
        title={toDelete ? `Delete Q-${toDelete.number}?` : ""}
        footer={
          <>
            <Btn variant="ghost" onClick={() => setToDelete(null)}>
              Cancel
            </Btn>
            <Btn
              variant="danger"
              disabled={busy}
              onClick={async () => {
                if (!toDelete) return;
                setBusy(true);
                setErr(null);
                try {
                  await remove({ token, estimateId: toDelete.id });
                  setToDelete(null);
                } catch (e) {
                  setErr(errorText(e));
                  setToDelete(null);
                } finally {
                  setBusy(false);
                }
              }}
            >
              {busy ? "Deleting…" : "Delete permanently"}
            </Btn>
          </>
        }
      >
        {toDelete && (
          <p className="m-0 text-sm text-ink-600">
            This permanently removes the {toDelete.status} quotation for <strong className="text-ink-800">{toDelete.customer}</strong>. The lead and its
            activity history stay. This can&apos;t be undone.
          </p>
        )}
      </Modal>
    </>
  );
}

function PickLeadModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { token } = useSession();
  const router = useRouter();
  const leads = useQuery(api.crm.leads.list, open ? { token } : "skip");
  const create = useMutation(api.crm.estimates.create);
  const [q, setQ] = useState("");
  const [err, setErr] = useState<string | null>(null);

  const matches = (leads ?? [])
    .filter((l) => l.status !== "lost")
    .filter((l) => `${l.name} ${l.phone} ${l.movingFrom} ${l.reference ?? ""}`.toLowerCase().includes(q.toLowerCase()))
    .slice(0, 30);

  async function start(leadId: Id<"quoteRequests">) {
    setErr(null);
    try {
      const id = await create({ token, leadId });
      router.push(`/crm/actions/${id}`);
    } catch (e) {
      setErr(errorText(e));
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="Which lead is this quote for?">
      <TextInput autoFocus placeholder="Search leads…" value={q} onChange={(e) => setQ(e.target.value)} />
      {err && <div className="mt-2 rounded-sm bg-danger-bg px-3 py-2 text-sm text-danger">{err}</div>}
      <div className="mt-3 flex max-h-[50vh] flex-col divide-y divide-border overflow-y-auto">
        {!leads ? (
          <Loading />
        ) : (
          matches.map((l) => {
            const s = leadStatusMeta(l.status);
            return (
              <button key={l._id} type="button" onClick={() => start(l._id)} className="flex items-center justify-between gap-2 px-1 py-2.5 text-left hover:bg-gray-50 cursor-pointer">
                <span className="min-w-0">
                  <span className="block text-sm font-semibold text-ink-800">{l.name}</span>
                  <span className="block truncate text-xs text-ink-400">
                    {l.movingFrom} · {shortDate(l.moveDate)}
                  </span>
                </span>
                <Chip className={s.chip}>{s.label}</Chip>
              </button>
            );
          })
        )}
      </div>
    </Modal>
  );
}
