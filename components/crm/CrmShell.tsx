"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Component, ReactNode, useCallback, useEffect, useMemo, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { ConvexClientProvider } from "@/app/ConvexClientProvider";
import { api } from "@/convex/_generated/api";
import { SessionContext, setStoredToken, useStoredToken, type Me } from "./session";
import type { Role } from "@/lib/crm/constants";

const NAV: { href: string; label: string; icon: string; roles?: Role[] }[] = [
  { href: "/crm", label: "Overview", icon: "◧" },
  { href: "/crm/sales", label: "Sales", icon: "☎" },
  { href: "/crm/operations", label: "Operations", icon: "⛟" },
  { href: "/crm/actions", label: "Actions · Quotes", icon: "✎" },
  { href: "/crm/team", label: "Team", icon: "⚇", roles: ["admin"] },
];

/** Clears a stale session if any CRM query throws UNAUTHENTICATED. */
class AuthBoundary extends Component<{ children: ReactNode }, { error: Error | null }> {
  state = { error: null as Error | null };
  static getDerivedStateFromError(error: Error) {
    return { error };
  }
  componentDidCatch(error: Error) {
    if (String(error.message).includes("UNAUTHENTICATED")) setStoredToken(null);
  }
  render() {
    if (this.state.error) {
      const auth = String(this.state.error.message).includes("UNAUTHENTICATED");
      return (
        <div className="m-6 rounded-md border border-danger-border bg-danger-bg p-6 text-sm text-ink-800">
          <div className="font-display font-semibold mb-1">{auth ? "Your session has ended." : "Something went wrong."}</div>
          <p className="m-0 mb-3 text-ink-600">{auth ? "Please sign in again." : this.state.error.message.split("\n")[0]}</p>
          <button
            type="button"
            className="rounded-sm bg-clay-500 px-4 py-2 font-display text-sm font-semibold text-white hover:bg-clay-600 cursor-pointer"
            onClick={() => (auth ? (window.location.href = "/crm/login") : window.location.reload())}
          >
            {auth ? "Sign in" : "Reload"}
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

function Gate({ children }: { children: ReactNode }) {
  const token = useStoredToken();
  const pathname = usePathname();
  const router = useRouter();
  const isLogin = pathname === "/crm/login";
  const me = useQuery(api.crm.auth.me, token ? { token } : "skip");
  const logoutMutation = useMutation(api.crm.auth.logout);

  const signedOut = token === null || me === null;
  useEffect(() => {
    if (signedOut && !isLogin) {
      if (me === null) setStoredToken(null);
      router.replace("/crm/login");
    }
    if (me && isLogin) router.replace("/crm");
  }, [signedOut, isLogin, me, router]);

  const logout = useCallback(() => {
    if (token) void logoutMutation({ token });
    setStoredToken(null);
    router.replace("/crm/login");
  }, [token, logoutMutation, router]);

  const session = useMemo(() => (token && me ? { token, me: me as Me, logout } : null), [token, me, logout]);

  if (isLogin) return <>{children}</>;
  if (!session) return <div className="grid min-h-screen place-items-center text-sm text-ink-400">Loading CRM…</div>;
  return (
    <SessionContext.Provider value={session}>
      <Frame me={session.me} logout={logout}>
        <AuthBoundary>{children}</AuthBoundary>
      </Frame>
    </SessionContext.Provider>
  );
}

function Frame({ me, logout, children }: { me: Me; logout: () => void; children: ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const items = NAV.filter((n) => !n.roles || n.roles.includes(me.role));
  const active = (href: string) => (href === "/crm" ? pathname === "/crm" : pathname.startsWith(href));

  const nav = (
    <nav className="flex flex-col gap-1">
      {items.map((n) => (
        <Link
          key={n.href}
          href={n.href}
          onClick={() => setOpen(false)}
          className={`flex items-center gap-3 rounded-sm border-l-[3px] px-3 py-2.5 font-display text-sm font-semibold no-underline transition-colors ${
            active(n.href) ? "border-teal-200 bg-white/10 text-white" : "border-transparent text-white/65 hover:bg-white/5 hover:text-white"
          }`}
        >
          <span className="w-5 text-center text-base" aria-hidden>
            {n.icon}
          </span>
          {n.label}
        </Link>
      ))}
    </nav>
  );

  const user = (
    <div className="border-t border-white/10 pt-4">
      <div className="text-sm font-semibold text-white truncate">{me.name}</div>
      <div className="text-xs text-white/50 capitalize mb-3">{me.role}</div>
      <button type="button" onClick={logout} className="text-xs font-semibold text-white/70 hover:text-white cursor-pointer">
        Sign out →
      </button>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-gray-50 text-ink-800">
      <aside className="hidden lg:flex w-60 shrink-0 flex-col justify-between bg-ink-900 p-4 sticky top-0 h-screen">
        <div>
          <Link href="/crm" className="flex items-center gap-3 px-2 pb-7 pt-2 no-underline">
            <Image src="/Logo.png" alt="Movera" width={40} height={40} className="h-10 w-10 rounded-sm bg-white p-1" priority />
            <div>
              <div className="font-display text-[13px] font-semibold tracking-[3px] text-white">MOVERA</div>
              <div className="text-[11px] text-white/50">Operations CRM</div>
            </div>
          </Link>
          {nav}
        </div>
        {user}
      </aside>

      {/* Mobile top bar */}
      <div className="lg:hidden fixed inset-x-0 top-0 z-30 flex items-center justify-between bg-ink-900 px-4 py-3">
        <Link href="/crm" className="flex items-center gap-2.5 no-underline">
          <Image src="/Logo.png" alt="Movera" width={32} height={32} className="h-8 w-8 rounded-sm bg-white p-0.5" />
          <span className="font-display text-[13px] font-semibold tracking-[3px] text-white">MOVERA CRM</span>
        </Link>
        <button type="button" onClick={() => setOpen((o) => !o)} className="text-white text-xl cursor-pointer" aria-label="Menu">
          ☰
        </button>
      </div>
      {open && (
        <div className="lg:hidden fixed inset-0 z-40 bg-ink-900 p-4 pt-16 flex flex-col justify-between">
          <button type="button" onClick={() => setOpen(false)} className="absolute right-4 top-3 text-white text-2xl cursor-pointer" aria-label="Close menu">
            ×
          </button>
          {nav}
          {user}
        </div>
      )}

      <main className="flex-1 min-w-0 px-4 pb-10 pt-16 lg:px-8 lg:pt-6">{children}</main>
    </div>
  );
}

export function CrmShell({ children }: { children: ReactNode }) {
  return (
    <ConvexClientProvider>
      <Gate>{children}</Gate>
    </ConvexClientProvider>
  );
}

export function PageHeader({ title, sub, actions }: { title: string; sub?: ReactNode; actions?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 className="m-0 font-display text-[28px] font-bold leading-tight text-ink-800">{title}</h1>
        <div className="mt-1.5 h-1 w-14 rounded-pill bg-teal-500" />
        {sub && <p className="m-0 mt-2 text-sm text-ink-600">{sub}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}
