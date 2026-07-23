import { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "outline" | "ghost" | "dark-outline" | "dark-sage";

const base =
  "inline-flex items-center justify-center gap-2 font-display font-semibold cursor-pointer transition-colors disabled:cursor-default";

const variants: Record<Variant, string> = {
  primary: "text-white bg-clay-500 hover:bg-clay-600 rounded-sm text-[15px] px-[26px] py-[14px] disabled:bg-clay-100/80 disabled:text-white/70",
  secondary: "text-white bg-teal-500 hover:bg-teal-600 rounded-sm text-[15px] px-[26px] py-[14px]",
  outline: "text-teal-500 bg-white border-2 border-teal-500 hover:bg-teal-50 rounded-sm text-[15px] px-6 py-3",
  ghost: "text-teal-500 hover:text-teal-600 bg-transparent px-2 py-3 text-[15px]",
  "dark-outline": "text-white bg-transparent border-2 border-sage-500 hover:bg-sage-500/15 rounded-md text-[13px] tracking-wide px-[22px] py-3",
  "dark-sage": "text-ink-900 bg-sage-500 hover:bg-[#92c56e] rounded-pill text-sm px-6 py-3",
};

export function Button({
  variant = "primary",
  className = "",
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; children: ReactNode }) {
  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}
