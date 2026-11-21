"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { useSession } from "./session";
import { draftFromLead, type JobDraft } from "./JobModal";
import { Chip, Loading, Modal, TextInput } from "./ui";
import { leadStatusMeta, type LeadStatus } from "@/lib/crm/constants";
import { shortDate } from "@/lib/crm/format";

/**
 * Pick any open lead (no live job yet) to assign crew to. Used from the crew
 * list ("Assign to a lead") and from a calendar day ("+").
 */
export function AssignLeadModal({
  open,
  onClose,
  onPick,
  title = "Assign to which lead?",
  preset,
}: {
  open: boolean;
  onClose: () => void;
  onPick: (draft: JobDraft) => void;
  title?: string;
  preset?: { date?: string; assigneeIds?: Id<"resources">[] };
}) {
  const { token } = useSession();
  const rows = useQuery(api.crm.operations.assignableLeads, open ? { token } : "skip");
  const [q, setQ] = useState("");

  const needle = q.trim().toLowerCase();
  const matches = (rows ?? [])
    .filter((r) => !needle || `${r.name} ${r.phone} ${r.movingFrom} ${r.movingTo} ${r.reference ?? ""}`.toLowerCase().includes(needle))
    // Booked first — they are the ones waiting on ops.
    .sort((a, b) => Number(b.status === "booked") - Number(a.status === "booked"))
    .slice(0, 40);

  return (
    <Modal open={open} onClose={onClose} title={title}>
      <TextInput autoFocus placeholder="Search name, phone, suburb, #ref…" value={q} onChange={(e) => setQ(e.target.value)} />
      <p className="m-0 mt-2 pl-1 text-xs text-ink-400">Open leads without a scheduled job. Booked leads are listed first.</p>
      <div className="mt-3 flex max-h-[55vh] flex-col gap-1.5 overflow-y-auto">
        {!rows ? (
          <Loading />
        ) : matches.length === 0 ? (
          <div className="py-8 text-center text-sm text-ink-400">No matching leads.</div>
        ) : (
          matches.map((r) => {
            const s = leadStatusMeta(r.status as LeadStatus);
            return (
              <button
                key={r.leadId}
                type="button"
                onClick={() => {
                  onPick(draftFromLead(r, preset));
                  setQ("");
                }}
                className="flex items-center justify-between gap-3 rounded-sm border-[1.5px] border-border bg-white px-3 py-2.5 text-left transition-colors hover:border-teal-500 hover:bg-teal-50 cursor-pointer"
              >
                <span className="min-w-0">
                  <span className="block font-display text-sm font-semibold text-ink-800">
                    {r.name} {r.reference && <span className="font-sans text-xs font-normal text-ink-400">#{r.reference}</span>}
                  </span>
                  <span className="block truncate text-xs text-ink-400">
                    {shortDate(r.moveDate)} · {r.movingFrom}
                    {r.movingTo && ` → ${r.movingTo}`}
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
