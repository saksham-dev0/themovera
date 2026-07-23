import { HTMLAttributes, ReactNode } from "react";

export function Card({
  className = "",
  children,
  ...props
}: HTMLAttributes<HTMLDivElement> & { children: ReactNode }) {
  return (
    <div
      className={`bg-white border border-border rounded-[12px] p-[26px] transition-shadow hover:shadow-raised ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function IconTile({ tone = "teal", children }: { tone?: "teal" | "clay"; children: ReactNode }) {
  const tones = {
    teal: "bg-teal-100 text-teal-500",
    clay: "bg-clay-100 text-clay-500",
  };
  return (
    <div
      className={`w-11 h-11 rounded-sm grid place-items-center font-display font-bold text-lg ${tones[tone]}`}
    >
      {children}
    </div>
  );
}
