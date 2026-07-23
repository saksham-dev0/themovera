export function StepBadge({ children }: { children: number | string }) {
  return (
    <div className="w-11 h-11 bg-clay-500 rounded-sm grid place-items-center font-display font-bold text-[17px] text-white shadow-[0_4px_10px_rgba(224,112,60,0.35)]">
      {children}
    </div>
  );
}

export function Rating({ score, count }: { score: number; count: number }) {
  return (
    <div className="flex items-center gap-2.5">
      <div className="text-gold-400 text-[22px] tracking-[2px]">★★★★★</div>
      <div className="font-display font-semibold text-[15px] text-ink-800">
        {score} stars, from {count.toLocaleString()}+ reviews
      </div>
    </div>
  );
}

export function RoadDivider() {
  return (
    <div className="h-[22px] rounded-pill bg-teal-200 relative overflow-hidden">
      <div className="absolute top-1/2 left-0 right-0 h-0 border-t-4 border-dashed border-white -translate-y-1/2" />
    </div>
  );
}
