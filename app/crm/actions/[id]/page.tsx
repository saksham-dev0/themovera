"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { useAction, useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { FunctionReturnType } from "convex/server";
import type { Doc, Id } from "@/convex/_generated/dataModel";
import { useCan, useSession } from "@/components/crm/session";
import { Btn, Chip, Loading, Modal, errorText } from "@/components/crm/ui";
import {
  InventoryStep,
  LabourStep,
  MaterialsStep,
  MoveInfoStep,
  QuotationStep,
  STEPS,
  StorageStep,
  type Section,
  type StepProps,
} from "@/components/crm/quote/steps";
import { QuotePreview } from "@/components/crm/quote/QuotePreview";
import { computeQuote, type EstimateData } from "@/convex/crm/quoteMath";
import { estimateStatusMeta } from "@/lib/crm/constants";
import { money } from "@/lib/crm/format";

const STEP_COMPONENTS: ((p: StepProps) => React.ReactNode)[] = [
  MoveInfoStep,
  InventoryStep,
  MaterialsStep,
  LabourStep,
  StorageStep,
  QuotationStep,
];

function pick(e: Doc<"estimates">): EstimateData {
  return {
    moveInfo: e.moveInfo,
    inventory: e.inventory,
    materials: e.materials,
    labour: e.labour,
    storage: e.storage,
    quotation: e.quotation,
  };
}

export default function QuoteBuilderPage() {
  const { id } = useParams<{ id: string }>();
  const { token } = useSession();
  const estimate = useQuery(api.crm.estimates.get, { token, estimateId: id as Id<"estimates"> });
  if (estimate === undefined) return <Loading />;
  if (estimate === null) return <div className="p-6 text-sm">Quotation not found.</div>;
  return <Builder key={estimate._id} estimate={estimate} />;
}

type Loaded = NonNullable<FunctionReturnType<typeof api.crm.estimates.get>>;

function Builder({ estimate }: { estimate: Loaded }) {
  const { token } = useSession();
  const can = useCan();
  const editable = can("sales");
  const save = useMutation(api.crm.estimates.save);
  const setStatus = useMutation(api.crm.estimates.setStatus);
  const emailQuote = useAction(api.crm.estimates.emailToCustomer);
  const removeQuote = useMutation(api.crm.estimates.remove);
  const duplicateQuote = useMutation(api.crm.estimates.duplicate);
  const router = useRouter();
  const [confirmDelete, setConfirmDelete] = useState(false);

  const [data, setData] = useState<EstimateData>(() => pick(estimate));
  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [err, setErr] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [preview, setPreview] = useState(false);
  const [busy, setBusy] = useState(false);
  const dirty = useRef(new Set<Section>());
  const timer = useRef<number | null>(null);
  const dataRef = useRef(data);

  const flush = useCallback(
    async (stepReached?: number) => {
      if (timer.current) window.clearTimeout(timer.current);
      timer.current = null;
      const sections = [...dirty.current];
      if (!sections.length && stepReached === undefined) return;
      dirty.current.clear();
      const payload: Partial<EstimateData> = {};
      for (const s of sections) (payload as Record<string, unknown>)[s] = dataRef.current[s];
      setSaving("saving");
      try {
        await save({ token, estimateId: estimate._id, step: stepReached, ...payload });
        setSaving("saved");
      } catch (e) {
        sections.forEach((s) => dirty.current.add(s));
        setSaving("error");
        setErr(errorText(e));
      }
    },
    [save, token, estimate._id],
  );

  const change = useCallback(
    <K extends Section>(section: K, value: EstimateData[K]) => {
      const next = { ...dataRef.current, [section]: value };
      dataRef.current = next;
      setData(next);
      dirty.current.add(section);
      setSaving("idle");
      if (timer.current) window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => void flush(), 900);
    },
    [flush],
  );

  // Save on tab close / navigation.
  useEffect(() => {
    const pending = dirty.current;
    const onLeave = (e: BeforeUnloadEvent) => {
      if (pending.size) {
        void flush();
        e.preventDefault();
      }
    };
    window.addEventListener("beforeunload", onLeave);
    return () => {
      window.removeEventListener("beforeunload", onLeave);
      if (pending.size) void flush();
    };
  }, [flush]);

  function go(next: number) {
    const target = Math.max(0, Math.min(STEPS.length - 1, next));
    void flush(Math.max(estimate.step, target));
    setStep(target);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function act(fn: () => Promise<unknown>, ok?: string) {
    setBusy(true);
    setErr(null);
    setNotice(null);
    try {
      await flush();
      await fn();
      if (ok) setNotice(ok);
    } catch (e) {
      setErr(errorText(e));
    } finally {
      setBusy(false);
    }
  }

  function print() {
    setPreview(true);
    window.setTimeout(() => {
      document.body.classList.add("printing-quote");
      window.print();
      document.body.classList.remove("printing-quote");
    }, 50);
  }

  const t = computeQuote(data);
  const status = estimateStatusMeta(estimate.status);
  const StepView = STEP_COMPONENTS[step];

  return (
    <>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <Link href="/crm/actions" className="text-xs font-semibold text-teal-500">
            ← All quotations
          </Link>
          <h1 className="m-0 mt-1 flex flex-wrap items-center gap-2 font-display text-2xl font-bold text-ink-800">
            Q-{estimate.number} · {data.moveInfo.customerName}
            <Chip className={status.chip}>{status.label}</Chip>
          </h1>
          {estimate.lead && (
            <Link href={`/crm/sales?lead=${estimate.lead._id}`} className="text-xs text-ink-400 hover:text-teal-500">
              Lead {estimate.lead.reference ? `#${estimate.lead.reference}` : ""} → open in Sales
            </Link>
          )}
        </div>
        <div className="text-xs text-ink-400">
          {saving === "saving" && "Saving…"}
          {saving === "saved" && "All changes saved ✓"}
          {saving === "error" && <span className="text-danger">Not saved — retrying on next change</span>}
        </div>
      </div>

      {/* Stepper */}
      <ol className="m-0 mb-5 grid list-none grid-cols-3 gap-1.5 p-0 sm:grid-cols-6">
        {STEPS.map((s, i) => {
          const done = i < step || i <= estimate.step;
          return (
            <li key={s.id}>
              <button
                type="button"
                onClick={() => go(i)}
                className={`flex w-full items-center gap-2.5 rounded-[12px] border-[1.5px] bg-white px-2.5 py-2 text-left font-display text-sm font-semibold transition-shadow cursor-pointer ${
                  i === step ? "border-teal-500 text-ink-800 shadow-raised" : done ? "border-border text-ink-800 hover:shadow-raised" : "border-border text-ink-400 hover:shadow-raised"
                }`}
              >
                <span
                  className={`grid h-7 w-7 shrink-0 place-items-center rounded-sm text-xs font-bold ${
                    i === step ? "bg-clay-500 text-white shadow-[0_4px_10px_rgba(138,106,52,0.35)]" : done ? "bg-teal-100 text-teal-500" : "bg-gray-100 text-ink-400"
                  }`}
                >
                  {done && i !== step ? "✓" : i + 1}
                </span>
                <span className="truncate">{s.label}</span>
              </button>
            </li>
          );
        })}
      </ol>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_300px]">
        <div className="min-w-0 rounded-[12px] border border-border bg-white p-5">
          <fieldset disabled={!editable} className="m-0 min-w-0 border-0 p-0">
            <StepView data={data} change={change} readOnly={!editable} />
          </fieldset>
          <div className="mt-6 flex justify-between border-t border-border pt-4">
            <Btn variant="outline" disabled={step === 0} onClick={() => go(step - 1)}>
              ← Back
            </Btn>
            {step < STEPS.length - 1 ? (
              <Btn onClick={() => go(step + 1)}>Next: {STEPS[step + 1].label} →</Btn>
            ) : (
              <Btn variant="secondary" onClick={() => setPreview(true)}>
                Preview quote
              </Btn>
            )}
          </div>
        </div>

        {/* Live totals */}
        <aside className="flex flex-col gap-3 xl:sticky xl:top-6 xl:self-start">
          <div className="rounded-[12px] bg-ink-900 p-5 text-white">
            <div className="font-display text-[11px] font-semibold uppercase tracking-[1.5px] text-white/50">Quote total</div>
            <div className="mt-1 font-display text-3xl font-bold tabular-nums">{money(t.total)}</div>
            {t.low !== t.high && (
              <div className="text-xs text-white/60">
                range {money(t.low)} – {money(t.high)}
              </div>
            )}
            <dl className="m-0 mt-4 flex flex-col gap-1.5 text-xs">
              <Row k="Inventory" v={`${t.itemCount} items · ${t.volume} m³`} />
              <Row k="Crew / trucks" v={`${data.labour.crewSize} × ${data.labour.trucks} ${data.labour.truckSize}`} />
              {data.quotation.pricingType === "hourly" ? (
                <Row k={`Labour ${t.billableHours} h × ${money(data.labour.hourlyRate)}`} v={money(t.labourCost)} />
              ) : (
                <Row k="Fixed price" v={money(t.labourCost)} />
              )}
              {t.movingFee > 0 && <Row k="Call-out fee" v={money(t.movingFee)} />}
              {t.packingCost > 0 && <Row k="Packing" v={money(t.packingCost)} />}
              {t.accessFees > 0 && <Row k="Stairs / heavy" v={money(t.accessFees)} />}
              {t.materialsTotal > 0 && <Row k="Materials" v={money(t.materialsTotal)} />}
              {t.storageTotal > 0 && <Row k="Storage" v={money(t.storageTotal)} />}
              {t.extraFeesTotal > 0 && <Row k="Extra fees" v={money(t.extraFeesTotal)} />}
              {t.fuelLevy > 0 && <Row k="Fuel levy" v={money(t.fuelLevy)} />}
              {t.discount > 0 && <Row k="Discount" v={`−${money(t.discount)}`} />}
              {t.gst > 0 && <Row k="GST" v={money(t.gst)} />}
              {t.deposit > 0 && <Row k={`Deposit ${data.quotation.depositPercent}%`} v={money(t.deposit)} />}
            </dl>
          </div>

          <div className="flex flex-col gap-2 rounded-[12px] border border-border bg-white p-4">
            <Btn variant="outline" onClick={() => setPreview(true)}>
              👁 Preview
            </Btn>
            <Btn variant="outline" onClick={print}>
              🖨 Print / save PDF
            </Btn>
            {editable && (
              <>
                <Btn
                  disabled={busy || !data.moveInfo.email}
                  onClick={() =>
                    act(async () => {
                      const r = await emailQuote({ token, estimateId: estimate._id });
                      if (!r.sent) throw new Error("Email service is not configured (RESEND_API_KEY).");
                      setNotice(`Quote emailed to ${r.to}`);
                    })
                  }
                  title={data.moveInfo.email ? undefined : "Add the customer's email in Move info"}
                >
                  ✉ Email quote to customer
                </Btn>
                <div className="grid grid-cols-2 gap-2">
                  <Btn
                    size="sm"
                    variant="outline"
                    disabled={busy}
                    onClick={() => act(() => setStatus({ token, estimateId: estimate._id, status: "sent" }), "Marked as sent")}
                  >
                    Mark sent
                  </Btn>
                  <Btn
                    size="sm"
                    variant="danger"
                    disabled={busy}
                    onClick={() => act(() => setStatus({ token, estimateId: estimate._id, status: "declined" }), "Marked declined")}
                  >
                    Declined
                  </Btn>
                </div>
                <Btn
                  variant="secondary"
                  disabled={busy || estimate.status === "accepted"}
                  onClick={() =>
                    act(
                      () => setStatus({ token, estimateId: estimate._id, status: "accepted" }),
                      "Accepted — lead is Closed – Booked and waiting in Operations › Ready to schedule.",
                    )
                  }
                >
                  ✓ Customer accepted → book job
                </Btn>
              </>
            )}
            {editable && (
              <div className="grid grid-cols-2 gap-2 border-t border-border pt-3">
                <Btn
                  size="sm"
                  variant="ghost"
                  disabled={busy}
                  onClick={() =>
                    act(async () => {
                      await flush();
                      const id = await duplicateQuote({ token, estimateId: estimate._id });
                      router.push(`/crm/actions/${id}`);
                    })
                  }
                >
                  Duplicate
                </Btn>
                <Btn
                  size="sm"
                  variant="danger"
                  disabled={busy || estimate.status === "accepted"}
                  title={estimate.status === "accepted" ? "Accepted quotes can't be deleted" : undefined}
                  onClick={() => setConfirmDelete(true)}
                >
                  Delete quote
                </Btn>
              </div>
            )}
            {notice && <div className="rounded-sm bg-success-bg px-3 py-2 text-xs text-ink-800">{notice}</div>}
            {err && <div className="rounded-sm bg-danger-bg px-3 py-2 text-xs text-danger">{err}</div>}
          </div>
        </aside>
      </div>

      <Modal
        open={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        title={`Delete Q-${estimate.number}?`}
        footer={
          <>
            <Btn variant="ghost" onClick={() => setConfirmDelete(false)}>
              Cancel
            </Btn>
            <Btn
              variant="danger"
              disabled={busy}
              onClick={() =>
                act(async () => {
                  // Drop pending autosaves so nothing writes to the deleted quote.
                  if (timer.current) window.clearTimeout(timer.current);
                  dirty.current.clear();
                  await removeQuote({ token, estimateId: estimate._id });
                  router.replace("/crm/actions");
                })
              }
            >
              Delete permanently
            </Btn>
          </>
        }
      >
        <p className="m-0 text-sm text-ink-600">
          This permanently removes this {estimate.status} quotation. The lead and its history stay. This can&apos;t be undone.
        </p>
      </Modal>

      <Modal open={preview} onClose={() => setPreview(false)} title="Customer quotation" wide footer={<Btn onClick={print}>🖨 Print / save PDF</Btn>}>
        <QuotePreview data={data} number={estimate.number} createdAt={estimate._creationTime} />
      </Modal>
    </>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between gap-2">
      <dt className="text-white/60">{k}</dt>
      <dd className="m-0 text-right tabular-nums">{v}</dd>
    </div>
  );
}
