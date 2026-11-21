"use client";

import { createContext, useCallback, useContext, useSyncExternalStore } from "react";
import type { Id } from "@/convex/_generated/dataModel";
import type { Role } from "@/lib/crm/constants";

const KEY = "movera_crm_token";
const listeners = new Set<() => void>();

function read(): string | null {
  try {
    return window.localStorage.getItem(KEY);
  } catch {
    return null;
  }
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  window.addEventListener("storage", cb);
  return () => {
    listeners.delete(cb);
    window.removeEventListener("storage", cb);
  };
}

export function setStoredToken(token: string | null) {
  try {
    if (token) window.localStorage.setItem(KEY, token);
    else window.localStorage.removeItem(KEY);
  } catch {
    // Private mode etc. — session just won't survive a reload.
  }
  listeners.forEach((l) => l());
}

/**
 * The CRM session token. `undefined` while rendering on the server / before
 * hydration, `null` when signed out.
 */
export function useStoredToken(): string | null | undefined {
  return useSyncExternalStore(subscribe, read, () => undefined);
}

export type Me = { _id: Id<"staff">; name: string; email: string; role: Role; active: boolean };

type Session = { token: string; me: Me; logout: () => void };

export const SessionContext = createContext<Session | null>(null);

/** Signed-in session; only usable inside the CRM shell. */
export function useSession(): Session {
  const s = useContext(SessionContext);
  if (!s) throw new Error("useSession used outside the CRM shell");
  return s;
}

export function useCan() {
  const { me } = useSession();
  return useCallback(
    (...roles: Role[]) => me.role === "admin" || roles.includes(me.role),
    [me.role],
  );
}
