"use client";

import { useEffect, useState } from "react";
import { melbourneYmd } from "./format";

/**
 * A clock that ticks every `minutes`, so queries that take `now`/`today` as
 * arguments keep a stable subscription between ticks.
 */
export function useClock(minutes = 5) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), minutes * 60_000);
    return () => window.clearInterval(id);
  }, [minutes]);
  return { now, today: melbourneYmd(now) };
}
