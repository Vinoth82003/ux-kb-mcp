"use client";

import { useState, useTransition } from "react";

const ACTIONS = {
  stage: {
    label: "Stage",
    confirm:
      "Stage the current content tree?\n\nThis does not change what clients receive. It prepares a candidate release.",
  },
  promote: {
    label: "Promote",
    confirm:
      "Promote the staged release?\n\nEvery MCP client will start receiving this version on their next request. Check the diff first.",
  },
  rollback: {
    label: "Roll back",
    confirm:
      "Roll back to the previous release?\n\nClients will immediately receive the prior document set. This is audited and cannot be undone from the panel.",
  },
} as const;

type ActionName = keyof typeof ACTIONS;

export default function ReleaseActions({
  enabled,
  mfaEnabled,
}: {
  enabled: boolean;
  mfaEnabled: boolean;
}) {
  const [pending, startTransition] = useTransition();
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  function run(action: ActionName) {
    if (!window.confirm(ACTIONS[action].confirm)) return;
    setError(null);
    setNotice(null);
    startTransition(async () => {
      try {
        const response = await fetch(`/api/releases/${action}`, {
          method: "POST",
          headers: {
            "content-type": "application/json",
            ...(code.trim() ? { "x-mfa-code": code.trim() } : {}),
          },
        });
        const data = await response.json().catch(() => ({}));
        if (!response.ok) {
          setError(data?.error ?? `${ACTIONS[action].label} failed.`);
          return;
        }
        setCode("");
        setNotice(`${ACTIONS[action].label} request accepted.`);
      } catch (caught) {
        setError(caught instanceof Error ? caught.message : String(caught));
      }
    });
  }

  return (
    <div className="adm-stack" style={{ gap: 10, marginTop: 16 }}>
      {!enabled && (
        <p className="adm-alert adm-alert-warning" style={{ margin: 0 }}>
          Release management is disabled on this deployment. Deploy the content tree
          and update the version marker instead.
        </p>
      )}

      {mfaEnabled && (
        <label className="adm-field" style={{ maxWidth: 220 }}>
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

      <div className="adm-actions">
        {(Object.keys(ACTIONS) as ActionName[]).map((action) => (
          <button
            key={action}
            className={action === "promote" ? "btn btn-primary" : action === "rollback" ? "btn btn-danger" : "btn btn-ghost"}
            type="button"
            onClick={() => run(action)}
            disabled={pending}
          >
            {ACTIONS[action].label}
          </button>
        ))}
      </div>

      {error && <p role="alert" className="adm-alert adm-alert-error">{error}</p>}
      {notice && <p role="status" className="adm-alert adm-alert-success">{notice}</p>}
    </div>
  );
}
