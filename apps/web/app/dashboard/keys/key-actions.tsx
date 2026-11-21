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

  function revoke() {
    const confirmed = window.confirm(
      `Revoke “${name}”?\n\nAny client using this key stops working immediately. This cannot be undone; issue a new key to restore access.`,
    );
    if (!confirmed) return;
    setError(null);
    startTransition(async () => {
      const result = await revokeKeyAction(id, code.trim());
      if (result.error) setError(result.error);
      else setCode("");
    });
  }

  function rotate() {
    const confirmed = window.confirm(
      `Rotate “${name}”?\n\nA new key is issued and this one is revoked in the same step. Update your MCP client with the new key immediately.`,
    );
    if (!confirmed) return;
    setError(null);
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

      <div className="adm-inline">
        <button className="btn btn-ghost" type="button" onClick={rotate} disabled={pending}>
          Rotate
        </button>
        <button className="btn btn-danger" type="button" onClick={revoke} disabled={pending}>
          Revoke
        </button>
      </div>

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
