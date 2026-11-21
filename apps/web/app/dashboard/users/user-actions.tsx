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
  const [confirming, setConfirming] = useState<"toggle" | { nextRole: string } | null>(null);

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

  function executeToggle() {
    setConfirming(null);
    run(
      (stepUp) => setSuspendedAction(id, !suspended, stepUp),
      suspended ? `Restored github:${login}.` : `Suspended github:${login} and revoked their keys.`,
    );
  }

  function executeChangeRole(next: string) {
    setConfirming(null);
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
          value={typeof confirming === "object" && confirming !== null && "nextRole" in confirming ? confirming.nextRole : role}
          onChange={(event) => {
            if (event.target.value !== role) {
              setConfirming({ nextRole: event.target.value });
            } else {
              setConfirming(null);
            }
          }}
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

      {confirming === "toggle" && (
        <div className="adm-confirm-banner" role="alert" style={{ background: suspended ? "var(--info-bg)" : "var(--error-bg)", border: `1px solid ${suspended ? "var(--info)" : "var(--error)"}`, padding: 8, borderRadius: "var(--radius-sm)" }}>
          <p style={{ margin: "0 0 6px", fontSize: "0.8rem", color: "var(--text-primary)" }}>
            {suspended ? `Restore github:${login}?` : `Suspend github:${login}? All keys revoked.`}
          </p>
          <div className="adm-inline" style={{ gap: 6 }}>
            <button className={suspended ? "btn btn-primary" : "btn btn-danger"} type="button" onClick={executeToggle} disabled={pending} style={{ padding: "4px 8px", fontSize: "0.75rem" }}>
              {pending ? "Working…" : suspended ? "Confirm restore" : "Confirm suspend"}
            </button>
            <button className="btn btn-ghost" type="button" onClick={() => setConfirming(null)} disabled={pending} style={{ padding: "4px 8px", fontSize: "0.75rem" }}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {typeof confirming === "object" && confirming !== null && "nextRole" in confirming && (
        <div className="adm-confirm-banner" role="alert" style={{ background: "var(--warning-bg)", border: "1px solid var(--warning)", padding: 8, borderRadius: "var(--radius-sm)" }}>
          <p style={{ margin: "0 0 6px", fontSize: "0.8rem", color: "var(--text-primary)" }}>
            Change github:{login} to {ROLE_LABELS[confirming.nextRole] ?? confirming.nextRole}?
          </p>
          <div className="adm-inline" style={{ gap: 6 }}>
            <button className="btn btn-primary" type="button" onClick={() => executeChangeRole(confirming.nextRole)} disabled={pending} style={{ padding: "4px 8px", fontSize: "0.75rem" }}>
              {pending ? "Updating…" : "Confirm change"}
            </button>
            <button className="btn btn-ghost" type="button" onClick={() => setConfirming(null)} disabled={pending} style={{ padding: "4px 8px", fontSize: "0.75rem" }}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {!confirming && (
        <button
          className={suspended ? "btn btn-ghost" : "btn btn-danger"}
          type="button"
          onClick={() => setConfirming("toggle")}
          disabled={pending}
        >
          {suspended ? "Restore account" : "Suspend account"}
        </button>
      )}

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
