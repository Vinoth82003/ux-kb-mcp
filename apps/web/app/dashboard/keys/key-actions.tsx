"use client";

import { useState, useTransition } from "react";
import { revokeKeyAction, rotateKeyAction } from "./actions";

export default function KeyActions({
  id,
  name,
  mfaEnabled,
}: {
  id: string;
  name: string;
  mfaEnabled: boolean;
}) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [rotated, setRotated] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [code, setCode] = useState("");
  const [confirming, setConfirming] = useState<"revoke" | "rotate" | null>(null);

  function executeRevoke() {
    setError(null);
    setConfirming(null);
    startTransition(async () => {
      const result = await revokeKeyAction(id, code.trim());
      if (result.error) setError(result.error);
      else setCode("");
    });
  }

  function executeRotate() {
    setError(null);
    setConfirming(null);
    startTransition(async () => {
      const result = await rotateKeyAction(id, code.trim());
      if (result.error) setError(result.error);
      else if (result.key) {
        setRotated(result.key);
        setCode("");
      }
    });
  }

  async function copy() {
    if (!rotated) return;
    try {
      await navigator.clipboard.writeText(rotated);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="adm-stack" style={{ gap: 6, minWidth: 190 }}>
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

      {confirming === "revoke" && (
        <div className="adm-confirm-banner" role="alert" style={{ background: "var(--error-bg)", border: "1px solid var(--error)", padding: 8, borderRadius: "var(--radius-sm)" }}>
          <p style={{ margin: "0 0 6px", fontSize: "0.8rem", color: "var(--text-primary)" }}>
            Revoke “{name}”? Clients stop working immediately.
          </p>
          <div className="adm-inline" style={{ gap: 6 }}>
            <button className="btn btn-danger" type="button" onClick={executeRevoke} disabled={pending} style={{ padding: "4px 8px", fontSize: "0.75rem" }}>
              {pending ? "Revoking…" : "Yes, revoke"}
            </button>
            <button className="btn btn-ghost" type="button" onClick={() => setConfirming(null)} disabled={pending} style={{ padding: "4px 8px", fontSize: "0.75rem" }}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {confirming === "rotate" && (
        <div className="adm-confirm-banner" role="alert" style={{ background: "var(--warning-bg)", border: "1px solid var(--warning)", padding: 8, borderRadius: "var(--radius-sm)" }}>
          <p style={{ margin: "0 0 6px", fontSize: "0.8rem", color: "var(--text-primary)" }}>
            Rotate “{name}”? Issues new key and revokes old.
          </p>
          <div className="adm-inline" style={{ gap: 6 }}>
            <button className="btn btn-primary" type="button" onClick={executeRotate} disabled={pending} style={{ padding: "4px 8px", fontSize: "0.75rem" }}>
              {pending ? "Rotating…" : "Yes, rotate"}
            </button>
            <button className="btn btn-ghost" type="button" onClick={() => setConfirming(null)} disabled={pending} style={{ padding: "4px 8px", fontSize: "0.75rem" }}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {!confirming && (
        <div className="adm-inline">
          <button className="btn btn-ghost" type="button" onClick={() => setConfirming("rotate")} disabled={pending}>
            Rotate
          </button>
          <button className="btn btn-danger" type="button" onClick={() => setConfirming("revoke")} disabled={pending}>
            Revoke
          </button>
        </div>
      )}

      {error && (
        <span role="alert" className="adm-small" style={{ color: "var(--error)" }}>
          {error}
        </span>
      )}

      {rotated && (
        <div className="adm-card" style={{ padding: 10, marginTop: 4 }}>
          <p className="adm-help" style={{ marginBottom: 6 }}>
            New key for {name} (shown once):
          </p>
          <code className="adm-code" style={{ display: "block", wordBreak: "break-all" }}>
            {rotated}
          </code>
          <button className="btn btn-ghost" type="button" onClick={copy} style={{ marginTop: 8 }}>
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
      )}
    </div>
  );
}
