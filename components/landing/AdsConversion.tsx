"use client";

import { useEffect } from "react";

type Gtag = (...args: unknown[]) => void;

/**
 * Fires the Google Ads "thank you page" conversion once on mount.
 *
 * `gtag` is defined by an afterInteractive script in the root layout, which can
 * run after this effect on a fresh page load — so wait for it to exist rather
 * than queueing the event ahead of the Ads `config` call.
 */
export function AdsConversion() {
  useEffect(() => {
    let attempts = 0;
    let fired = false;
    const fire = () => {
      const gtag = (window as unknown as { gtag?: Gtag }).gtag;
      if (fired || !gtag) return false;
      fired = true;
      gtag("event", "conversion", {
        send_to: "AW-18470170169/JjK4CPmO2IMdELncoedE",
        value: 1.0,
        currency: "AUD",
      });
      return true;
    };
    if (fire()) return;
    const timer = window.setInterval(() => {
      if (fire() || ++attempts >= 50) window.clearInterval(timer);
    }, 200);
    return () => window.clearInterval(timer);
  }, []);

  return null;
}
