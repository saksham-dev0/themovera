"use client";

import { useState } from "react";
import { useAction, useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { PageHeader } from "@/components/crm/CrmShell";
import { useSession } from "@/components/crm/session";
import { Btn, Chip, Field, Loading, Modal, SelectInput, TextInput, errorText } from "@/components/crm/ui";
import type { Role } from "@/lib/crm/constants";

const ROLES: { id: Role; label: string; desc: string }[] = [
  { id: "admin", label: "Admin", desc: "Everything, including staff accounts" },
  { id: "sales", label: "Sales", desc: "Leads, statuses, quotations" },
  { id: "operations", label: "Operations", desc: "Scheduling, crew, sub-contractors" },
];

export default function TeamPage() {
  const { token, me } = useSession();
  const staff = useQuery(api.crm.auth.listStaff, { token });
  const updateStaff = useMutation(api.crm.auth.updateStaff);
  const createStaff = useAction(api.crm.authNode.createStaff);
  const resetPassword = useAction(api.crm.authNode.resetPassword);
  const [adding, setAdding] = useState(false);
  const [resetFor, setResetFor] = useState<{ id: Id<"staff">; name: string } | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  if (me.role !== "admin") return <div className="p-6 text-sm">Only admins can manage staff.</div>;
  if (!staff) return <Loading />;

  async function run(fn: () => Promise<unknown>, ok?: string) {
    setErr(null);
    setNotice(null);
    try {
      await fn();
      if (ok) setNotice(ok);
      return true;
    } catch (e) {
      setErr(errorText(e));
      return false;
    }
  }

  return (
    <>
      <PageHeader
        title="Team"
        sub="Staff who can sign in to the CRM. Everyone sees all leads; roles control who can change what."
        actions={<Btn onClick={() => setAdding(true)}>+ Add staff</Btn>}
      />
      {err && <div className="mb-3 rounded-sm bg-danger-bg px-3 py-2 text-sm text-danger">{err}</div>}
      {notice && <div className="mb-3 rounded-sm bg-success-bg px-3 py-2 text-sm text-ink-800">{notice}</div>}

      <div className="overflow-x-auto rounded-[12px] border border-border bg-white">
        <table className="w-full min-w-[640px] border-collapse text-sm">
          <thead className="bg-gray-50 text-left text-[11px] uppercase tracking-wide text-ink-400">
            <tr>
              {["Name", "Email", "Role", "Status", ""].map((h) => (
                <th key={h} className="px-3 py-2.5 font-semibold">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {staff.map((s) => (
              <tr key={s._id} className="border-t border-border">
                <td className="px-3 py-2.5 font-semibold text-ink-800">
                  {s.name} {s._id === me._id && <span className="text-xs font-normal text-ink-400">(you)</span>}
                </td>
                <td className="px-3 py-2.5">{s.email}</td>
                <td className="px-3 py-2.5">
                  <SelectInput
                    value={s.role}
                    disabled={s._id === me._id}
                    onChange={(e) => run(() => updateStaff({ token, staffId: s._id, role: e.target.value as Role, active: s.active }))}
                    className="!w-auto !py-1"
                    aria-label="Role"
                  >
                    {ROLES.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.label}
                      </option>
                    ))}
                  </SelectInput>
                </td>
                <td className="px-3 py-2.5">
                  <Chip className={s.active ? "border-success-border bg-success-bg text-ink-800" : "border-border bg-gray-100 text-ink-400"}>
                    {s.active ? "Active" : "Disabled"}
                  </Chip>
                </td>
                <td className="px-3 py-2.5 text-right">
                  {s._id !== me._id && (
                    <div className="flex justify-end gap-2">
                      <Btn size="sm" variant="outline" onClick={() => setResetFor({ id: s._id, name: s.name })}>
                        Reset password
                      </Btn>
                      <Btn
                        size="sm"
                        variant={s.active ? "danger" : "outline"}
                        onClick={() => run(() => updateStaff({ token, staffId: s._id, role: s.role, active: !s.active }))}
                      >
                        {s.active ? "Disable" : "Enable"}
                      </Btn>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 grid gap-2 sm:grid-cols-3">
        {ROLES.map((r) => (
          <div key={r.id} className="rounded-sm border border-border bg-white p-3 text-xs">
            <div className="font-semibold text-ink-800">{r.label}</div>
            <div className="text-ink-400">{r.desc}</div>
          </div>
        ))}
      </div>

      <Modal open={adding} onClose={() => setAdding(false)} title="Add staff member">
        <form
          className="flex flex-col gap-3"
          onSubmit={async (e) => {
            e.preventDefault();
            const f = new FormData(e.currentTarget);
            const ok = await run(
              () =>
                createStaff({
                  token,
                  name: String(f.get("name")),
                  email: String(f.get("email")),
                  role: String(f.get("role")) as Role,
                  password: String(f.get("password")),
                }),
              "Staff member added — share their password with them securely.",
            );
            if (ok) setAdding(false);
          }}
        >
          <Field label="Name">{(id) => <TextInput id={id} name="name" required />}</Field>
          <Field label="Email (used to sign in)">{(id) => <TextInput id={id} name="email" type="email" required />}</Field>
          <Field label="Role">
            {(id) => (
              <SelectInput id={id} name="role" defaultValue="sales">
                {ROLES.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.label} — {r.desc}
                  </option>
                ))}
              </SelectInput>
            )}
          </Field>
          <Field label="Temporary password" hint="At least 10 characters.">
            {(id) => <TextInput id={id} name="password" type="text" minLength={10} required autoComplete="new-password" />}
          </Field>
          {err && <div className="rounded-sm bg-danger-bg px-3 py-2 text-sm text-danger">{err}</div>}
          <div className="flex justify-end gap-2">
            <Btn variant="ghost" onClick={() => setAdding(false)}>
              Cancel
            </Btn>
            <Btn type="submit">Add</Btn>
          </div>
        </form>
      </Modal>

      <Modal open={resetFor !== null} onClose={() => setResetFor(null)} title={`Reset password · ${resetFor?.name ?? ""}`}>
        <form
          className="flex flex-col gap-3"
          onSubmit={async (e) => {
            e.preventDefault();
            if (!resetFor) return;
            const f = new FormData(e.currentTarget);
            const ok = await run(
              () => resetPassword({ token, staffId: resetFor.id, password: String(f.get("password")) }),
              `Password reset for ${resetFor.name}. They've been signed out everywhere.`,
            );
            if (ok) setResetFor(null);
          }}
        >
          <Field label="New password" hint="At least 10 characters.">
            {(id) => <TextInput id={id} name="password" type="text" minLength={10} required autoComplete="new-password" />}
          </Field>
          {err && <div className="rounded-sm bg-danger-bg px-3 py-2 text-sm text-danger">{err}</div>}
          <div className="flex justify-end gap-2">
            <Btn variant="ghost" onClick={() => setResetFor(null)}>
              Cancel
            </Btn>
            <Btn type="submit">Reset</Btn>
          </div>
        </form>
      </Modal>
    </>
  );
}
