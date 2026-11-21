"use client";

import { useState, useTransition } from "react";
import { setSuspendedAction, setRoleAction } from "./actions";
import { ASSIGNABLE_ROLES, ROLE_LABELS } from "@/lib/policy";

export default function UserActions({
  id,
  login,
  suspended,
  role,
  mfaEnabled,
}: {
  id: string;
  login: string;
  suspended: boolean;
  role: string;
  mfaEnabled: boolean;
}) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [code, setCode] = useState("");

  function run(work: (code: string) => Promise<{ error?: string }>, success: string) {
    setError(null);
    setNotice(null);
    startTransition(async () => {
      const result = await work(code.trim());
      if (result.error) {
        setError(result.error);
        return;
      }
      setCode("");
      setNotice(success);
    });
  }

  function toggle() {
    const verb = suspended ? "Restore" : "Suspend";
    const consequence = suspended
      ? `Restore github:${login}? They will be able to sign in again.`
      : `Suspend github:${login}? They will be signed out of new sessions and every active API key they own will be revoked immediately.`;
    if (!window.confirm(`${verb} account\n\n${consequence}`)) return;
    run(
      (stepUp) => setSuspendedAction(id, !suspended, stepUp),
      suspended ? `Restored github:${login}.` : `Suspended github:${login} and revoked their keys.`,
    );
  }

  function changeRole(next: string) {
    if (next === role) return;
    const consequence =
      next === "ADMIN"
        ? `Give github:${login} full admin access: users, roles, API keys, releases, and audit export.`
        : `Reduce github:${login} to a member. They keep read/write draft access but lose admin controls.`;
    if (!window.confirm(`Change role to ${ROLE_LABELS[next] ?? next}?\n\n${consequence}`)) return;
    run(
      (stepUp) => setRoleAction(id, next, stepUp),
      `Role updated to ${ROLE_LABELS[next] ?? next}.`,
    );
  }

  return (
    <div className="adm-stack" style={{ gap: 6, minWidth: 190 }}>
      <label className="adm-field">
        <span className="adm-label">Role</span>
        <select
          className="adm-select"
          value={role}
          onChange={(event) => changeRole(event.target.value)}
          disabled={pending}
        >
          {ASSIGNABLE_ROLES.map((assignable) => (
            <option key={assignable} value={assignable}>
              {ROLE_LABELS[assignable] ?? assignable}
            </option>
          ))}
        </select>
      </label>

      {mfaEnabled && (
        <label className="adm-field">
          <span className="adm-label">Authenticator code</span>
          <input
            className="adm-input"
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={7}
            placeholder="123456"
            value={code}
            onChange={(event) => setCode(event.target.value.replace(/\D/g, ""))}
            disabled={pending}
          />
        </label>
      )}

      <button
        className={suspended ? "btn btn-ghost" : "btn btn-danger"}
        type="button"
        onClick={toggle}
        disabled={pending}
      >
        {suspended ? "Restore account" : "Suspend account"}
      </button>

      {error && (
        <span role="alert" className="adm-small" style={{ color: "var(--error)" }}>
          {error}
        </span>
      )}
      {notice && (
        <span role="status" className="adm-small" style={{ color: "var(--success)" }}>
          {notice}
        </span>
      )}
    </div>
  );
}
