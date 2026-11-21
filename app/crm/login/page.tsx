"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
import { setStoredToken } from "@/components/crm/session";
import { Btn, Field, TextInput, errorText } from "@/components/crm/ui";

export default function CrmLogin() {
  const login = useAction(api.crm.authNode.login);
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    setBusy(true);
    setError(null);
    try {
      const { token } = await login({ email: String(f.get("email")), password: String(f.get("password")) });
      setStoredToken(token);
      router.replace("/crm");
    } catch (err) {
      setError(errorText(err));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="grid min-h-screen place-items-center bg-ink-900 px-4">
      <form onSubmit={submit} className="w-full max-w-sm rounded-md bg-white p-8 shadow-floating">
        <div className="mb-6 flex items-center gap-3">
          <Image src="/Logo.png" alt="Movera" width={48} height={48} className="h-12 w-12" priority />
          <div>
            <div className="font-display text-[13px] font-semibold tracking-[3px] text-ink-800">MOVERA</div>
            <div className="text-xs text-ink-400">Staff sign-in · Operations CRM</div>
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <Field label="Email">{(id) => <TextInput id={id} name="email" type="email" autoComplete="username" required />}</Field>
          <Field label="Password">
            {(id) => <TextInput id={id} name="password" type="password" autoComplete="current-password" required />}
          </Field>
          {error && <div className="rounded-sm border border-danger-border bg-danger-bg px-3 py-2 text-sm text-danger">{error}</div>}
          <Btn type="submit" disabled={busy} className="w-full !h-12 !text-[15px]">
            {busy ? "Signing in…" : "Sign in"}
          </Btn>
        </div>
      </form>
    </div>
  );
}
