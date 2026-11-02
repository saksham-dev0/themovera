import { useSyncExternalStore } from "react";

/** Melbourne-local YYYY-MM-DD, `offsetDays` days from now. */
export function melbourneDate(offsetDays = 0) {
  const now = new Date();
  const melbourneNow = new Date(
    now.toLocaleString("en-US", { timeZone: "Australia/Melbourne" }),
  );
  melbourneNow.setDate(melbourneNow.getDate() + offsetDays);
  const y = melbourneNow.getFullYear();
  const m = String(melbourneNow.getMonth() + 1).padStart(2, "0");
  const d = String(melbourneNow.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

const noopSubscribe = () => () => {};

/**
 * Today's Melbourne date (YYYY-MM-DD), read in the browser. Returns "" during
 * server rendering / static prerendering: a date computed there would be frozen
 * at build time and block every day after the build. Use as a date input's
 * `min` so customers can pick today or any future date, never a past one.
 */
export function useMelbourneToday() {
  return useSyncExternalStore(noopSubscribe, () => melbourneDate(0), () => "");
}
