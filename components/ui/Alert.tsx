import { ReactNode } from "react";

type Tone = "info" | "success" | "danger";

const tones: Record<Tone, { bg: string; border: string; iconBg: string; icon: string }> = {
  info: { bg: "bg-info-bg", border: "border-info-border", iconBg: "bg-teal-500", icon: "i" },
  success: { bg: "bg-success-bg", border: "border-success-border", iconBg: "bg-sage-500", icon: "✓" },
  danger: { bg: "bg-danger-bg", border: "border-danger-border", iconBg: "bg-danger", icon: "!" },
};

export function Alert({ tone, children }: { tone: Tone; children: ReactNode }) {
  const t = tones[tone];
  return (
    <div className={`flex items-center gap-3.5 ${t.bg} border ${t.border} rounded-[10px] px-[18px] py-3.5`}>
      <div className={`w-7 h-7 rounded-pill ${t.iconBg} text-white grid place-items-center text-sm shrink-0`}>
        {t.icon}
      </div>
      <div className="text-sm text-ink-800 flex-1">{children}</div>
    </div>
  );
}

export function Toast({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-center gap-3.5 bg-ink-800 rounded-pill px-5 py-3 shadow-floating max-w-[380px]">
      <div className="w-6 h-6 rounded-pill bg-sage-500 text-ink-900 grid place-items-center text-xs shrink-0">✓</div>
      <div className="text-sm text-white flex-1">{children}</div>
      <div className="text-[13px] text-ink-400 cursor-pointer">✕</div>
    </div>
  );
}
