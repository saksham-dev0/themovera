import { ReactNode } from "react";

export function Tooltip({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="inline-block relative pt-11">
      <div className="absolute top-0 left-0 bg-ink-800 text-white text-[13px] px-3.5 py-2 rounded-sm whitespace-nowrap">
        {label}
      </div>
      <div className="absolute top-[33px] left-6 w-2.5 h-2.5 bg-ink-800 rotate-45" />
      {children}
    </div>
  );
}
