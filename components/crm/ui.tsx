"use client";

import {
  ButtonHTMLAttributes,
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
  useEffect,
  useId,
  useState,
} from "react";

/** Compact controls for the CRM (denser than the marketing-site inputs). */

type BtnVariant = "primary" | "secondary" | "ghost" | "danger" | "outline";
/** Design system: clay = primary action, teal = secondary/navigation, outline = teal 2px. */
const btnVariants: Record<BtnVariant, string> = {
  primary: "bg-clay-500 text-white hover:bg-clay-600 border-clay-500 hover:border-clay-600",
  secondary: "bg-teal-500 text-white hover:bg-teal-600 border-teal-500 hover:border-teal-600",
  outline: "bg-white text-teal-500 border-teal-500 hover:bg-teal-50",
  ghost: "bg-transparent text-teal-500 border-transparent hover:bg-teal-50",
  danger: "bg-white text-danger border-danger-border hover:bg-danger-bg",
};

export function Btn({
  variant = "primary",
  size = "md",
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: BtnVariant; size?: "sm" | "md" }) {
  return (
    <button
      type="button"
      className={`inline-flex items-center justify-center gap-1.5 rounded-sm border-[1.5px] font-display font-semibold leading-none transition-colors cursor-pointer disabled:opacity-45 disabled:cursor-not-allowed whitespace-nowrap ${
        size === "sm" ? "h-8 text-xs px-3" : "h-10 text-sm px-4"
      } ${btnVariants[variant]} ${className}`}
      {...props}
    />
  );
}

/** Pill field on gray-100 with a 4px teal focus ring (design system "text field"). */
const field =
  "w-full min-w-0 h-10 rounded-pill border-[1.5px] border-border bg-gray-100 px-4 font-sans text-sm text-ink-800 outline-none transition-shadow placeholder:text-ink-400 focus:border-teal-500 focus:bg-white focus:shadow-[0_0_0_4px_rgba(44,95,138,0.15)] disabled:opacity-60";

export function TextInput({ className = "", ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={`${field} ${className}`} {...props} />;
}

export function TextArea({ className = "", ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={`${field} h-auto rounded-md py-2.5 resize-y ${className}`} {...props} />;
}

/**
 * Native select with the browser arrow removed and our own chevron pinned to
 * the right edge, vertically centred — so every dropdown lines up.
 */
export function SelectInput({
  className = "",
  fieldClassName = "",
  size = "md",
  ...props
}: Omit<SelectHTMLAttributes<HTMLSelectElement>, "size"> & { fieldClassName?: string; size?: "sm" | "md" }) {
  const sm = size === "sm";
  return (
    <div className={`relative min-w-0 ${/(^|\s)!?w-/.test(className) ? "" : "w-full"} ${className}`}>
      <select
        className={`${field} appearance-none cursor-pointer truncate ${sm ? "!h-8 !pl-3 !pr-8 !text-xs font-semibold" : "pr-10"} ${fieldClassName}`}
        {...props}
      />
      <Chevron className={`pointer-events-none absolute top-1/2 -translate-y-1/2 text-current opacity-60 ${sm ? "right-3" : "right-4"}`} />
    </div>
  );
}

export function Chevron({ className = "", dir = "down" }: { className?: string; dir?: "down" | "left" | "right" }) {
  const rot = dir === "left" ? "rotate-90" : dir === "right" ? "-rotate-90" : "";
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden className={`${rot} ${className}`}>
      <path d="M2.5 4.5 6 8l3.5-3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** Underline tabs (design system "tabs · underline style"). */
export function Tabs<T extends string>({
  value,
  onChange,
  items,
}: {
  value: T;
  onChange: (v: T) => void;
  items: { id: T; label: ReactNode; badge?: number }[];
}) {
  return (
    <div className="flex gap-6 overflow-x-auto border-b-[1.5px] border-border mb-5" role="tablist">
      {items.map((t) => {
        const on = t.id === value;
        return (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={on}
            onClick={() => onChange(t.id)}
            className={`flex shrink-0 items-center gap-2 bg-transparent px-0.5 pt-2 pb-3 font-display text-sm font-semibold cursor-pointer transition-colors ${
              on ? "text-teal-500 shadow-[inset_0_-3px_0_var(--color-teal-500)]" : "text-ink-600 hover:text-ink-800"
            }`}
          >
            {t.label}
            {t.badge ? (
              <span className={`rounded-pill px-1.5 py-0.5 text-[10px] leading-none ${on ? "bg-teal-500 text-white" : "bg-gray-100 text-ink-600"}`}>
                {t.badge}
              </span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}

/** Pill segmented toggle (design system "segmented toggle"). */
export function Segmented<T extends string>({
  value,
  onChange,
  items,
}: {
  value: T;
  onChange: (v: T) => void;
  items: { id: T; label: ReactNode }[];
}) {
  return (
    <div className="inline-flex rounded-pill bg-teal-50 p-1">
      {items.map((t) => {
        const on = t.id === value;
        return (
          <button
            key={t.id}
            type="button"
            onClick={() => onChange(t.id)}
            className={`rounded-pill px-4 py-1.5 font-display text-xs font-semibold cursor-pointer transition-colors ${
              on ? "bg-white text-teal-500 shadow-[0_2px_8px_rgba(24,44,38,0.12)]" : "bg-transparent text-ink-600 hover:text-ink-800"
            }`}
          >
            {t.label}
          </button>
        );
      })}
    </div>
  );
}

/**
 * Number input that lets you clear and retype without snapping to 0, and
 * only reports finite numbers.
 */
export function NumberInput({
  value,
  onChange,
  step = 1,
  min = 0,
  max,
  prefix,
  suffix,
  className = "",
  ...rest
}: {
  value: number;
  onChange: (n: number) => void;
  step?: number;
  min?: number;
  max?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
} & Omit<InputHTMLAttributes<HTMLInputElement>, "value" | "onChange" | "min" | "max" | "step" | "prefix">) {
  const [draft, setDraft] = useState(String(value));
  const [prev, setPrev] = useState(value);
  // Follow outside changes (e.g. "Apply recommendation") without clobbering typing.
  if (value !== prev) {
    setPrev(value);
    if (Number(draft) !== value) setDraft(String(value));
  }
  return (
    <div className={`flex h-10 items-stretch rounded-pill border-[1.5px] border-border bg-gray-100 transition-shadow focus-within:border-teal-500 focus-within:bg-white focus-within:shadow-[0_0_0_4px_rgba(44,95,138,0.15)] ${className}`}>
      {prefix && <span className="grid place-items-center pl-4 text-sm text-ink-400">{prefix}</span>}
      <input
        type="number"
        inputMode="decimal"
        step={step}
        min={min}
        max={max}
        value={draft}
        onChange={(e) => {
          setDraft(e.target.value);
          const n = Number(e.target.value);
          if (e.target.value !== "" && Number.isFinite(n)) onChange(n);
        }}
        onBlur={() => {
          if (draft === "" || !Number.isFinite(Number(draft))) setDraft(String(value));
        }}
        className="w-full min-w-0 bg-transparent px-3 first:pl-4 text-sm text-ink-800 outline-none tabular-nums"
        {...rest}
      />
      {suffix && <span className="grid place-items-center pr-4 text-xs text-ink-400 whitespace-nowrap">{suffix}</span>}
    </div>
  );
}

export function Field({
  label,
  hint,
  children,
  className = "",
}: {
  label: string;
  hint?: ReactNode;
  children: (id: string) => ReactNode;
  className?: string;
}) {
  const id = useId();
  return (
    <div className={`flex flex-col gap-1.5 min-w-0 ${className}`}>
      <label htmlFor={id} className="font-display text-xs font-semibold text-ink-800">
        {label}
      </label>
      {children(id)}
      {hint && <div className="pl-1 text-[11px] text-ink-400">{hint}</div>}
    </div>
  );
}

export function Chip({ className = "", children }: { className?: string; children: ReactNode }) {
  return (
    <span className={`inline-flex items-center gap-1 rounded-sm border px-2 py-0.5 font-display text-[11px] font-semibold whitespace-nowrap ${className}`}>
      {children}
    </span>
  );
}

export function Panel({
  title,
  actions,
  children,
  className = "",
  pad = true,
}: {
  title?: ReactNode;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
  pad?: boolean;
}) {
  return (
    <section className={`rounded-[12px] border border-border bg-white min-w-0 ${className}`}>
      {(title || actions) && (
        <header className="flex flex-wrap items-center justify-between gap-2 border-b border-border px-5 py-3.5">
          <h2 className="m-0 font-display text-[15px] font-semibold text-ink-800">{title}</h2>
          {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
        </header>
      )}
      <div className={pad ? "p-5" : ""}>{children}</div>
    </section>
  );
}

export function Stat({
  label,
  value,
  sub,
  tone = "default",
}: {
  label: string;
  value: ReactNode;
  sub?: ReactNode;
  tone?: "default" | "warn" | "good";
}) {
  const toneCls = tone === "warn" ? "text-danger" : tone === "good" ? "text-teal-500" : "text-ink-800";
  return (
    <div className="rounded-[12px] border border-border bg-white p-5 min-w-0 transition-shadow hover:shadow-raised">
      <div className="font-display text-[11px] font-semibold uppercase tracking-[1.5px] text-ink-400">{label}</div>
      <div className={`mt-1 font-display text-2xl font-bold tabular-nums ${toneCls}`}>{value}</div>
      {sub && <div className="mt-0.5 text-xs text-ink-400">{sub}</div>}
    </div>
  );
}

export function Modal({
  open,
  onClose,
  title,
  children,
  footer,
  wide = false,
}: {
  open: boolean;
  onClose: () => void;
  title: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  wide?: boolean;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-ink-800/40 p-4 sm:p-10" onMouseDown={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        className={`w-full ${wide ? "max-w-3xl" : "max-w-lg"} overflow-hidden rounded-md bg-white shadow-floating`}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-3 px-6 pt-5 pb-1">
          <h3 className="m-0 font-display text-lg font-bold text-ink-800">{title}</h3>
          <CloseBtn onClick={onClose} />
        </div>
        <div className="px-6 py-4">{children}</div>
        {footer && <div className="flex flex-wrap justify-end gap-2 border-t border-border bg-gray-50 px-6 py-4">{footer}</div>}
      </div>
    </div>
  );
}

export function CloseBtn({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Close"
      className="grid h-9 w-9 shrink-0 place-items-center rounded-pill bg-gray-50 text-[15px] text-ink-600 hover:bg-gray-100 cursor-pointer"
    >
      ✕
    </button>
  );
}

export function Drawer({ open, onClose, children }: { open: boolean; onClose: () => void; children: ReactNode }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-40 flex justify-end bg-ink-900/30" onMouseDown={onClose}>
      <aside
        className="h-full w-full max-w-2xl overflow-y-auto bg-gray-50 shadow-floating"
        onMouseDown={(e) => e.stopPropagation()}
      >
        {children}
      </aside>
    </div>
  );
}

export function Empty({ children }: { children: ReactNode }) {
  return <div className="rounded-[12px] border-[1.5px] border-dashed border-border bg-white px-4 py-10 text-center text-sm text-ink-400">{children}</div>;
}

export function Loading() {
  return <div className="py-16 text-center text-sm text-ink-400">Loading…</div>;
}

/** Shows Convex errors in plain words. */
export function errorText(e: unknown) {
  const data = (e as { data?: unknown })?.data;
  if (typeof data === "string") return data;
  return e instanceof Error ? e.message.replace(/^\[.*?\]\s*/, "").split("\n")[0] : "Something went wrong.";
}
