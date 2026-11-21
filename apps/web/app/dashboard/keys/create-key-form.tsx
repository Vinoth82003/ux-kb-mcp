"use client";

import { useState } from "react";
import { useActionState } from "react";
import { createKeyAction, type CreateKeyState } from "./actions";

const initial: CreateKeyState = { key: null, name: null, error: null };

export default function CreateKeyForm({
  maxRateLimit,
  defaultRateLimit,
  isAdmin,
  mfaEnabled,
}: {
  maxRateLimit: number;
  defaultRateLimit: number;
  isAdmin: boolean;
  mfaEnabled: boolean;
}) {
  const [state, action, pending] = useActionState(createKeyAction, initial);
  const [copied, setCopied] = useState(false);

  async function copyKey() {
    if (!state.key) return;
    try {
      await navigator.clipboard.writeText(state.key);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  }

  return (
    <section className="adm-card" aria-labelledby="create-key-title">
      <h2 id="create-key-title" className="adm-section-title">
        Create a key
      </h2>
      <form action={action}>
        <div className="adm-toolbar" style={{ marginBottom: 0 }}>
          <label className="adm-field" style={{ flex: "1 1 220px" }}>
            <span className="adm-label">Name</span>
            <input
              className="adm-input"
              name="name"
              required
              maxLength={64}
              placeholder="claude-code-laptop"
              autoComplete="off"
            />
          </label>
          <label className="adm-field">
            <span className="adm-label">Rate limit / min</span>
            <input
              className="adm-input"
              name="rateLimit"
              type="number"
              min={10}
              max={maxRateLimit}
              defaultValue={defaultRateLimit}
              style={{ width: 120 }}
            />
          </label>
          <label className="adm-field">
            <span className="adm-label">Expires</span>
            <select className="adm-select" name="expiry" defaultValue="90">
              <option value="30">30 days</option>
              <option value="90">90 days</option>
              <option value="365">1 year</option>
              {isAdmin && <option value="never">Never</option>}
            </select>
          </label>
          {mfaEnabled && (
            <label className="adm-field">
              <span className="adm-label">Authenticator code</span>
              <input
                className="adm-input"
                name="mfaCode"
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={7}
                placeholder="123456"
                style={{ width: 130 }}
              />
            </label>
          )}
          <button className="btn btn-primary" type="submit" disabled={pending}>
            {pending ? "Creating…" : "Create key"}
          </button>
        </div>
        <p className="adm-help" style={{ marginTop: 8 }}>
          Limits follow your role: up to {maxRateLimit} calls/min per key. Keys are
          shown once and stored only as a hash.
        </p>
      </form>

      {state.error && (
        <p role="alert" className="adm-alert adm-alert-error" style={{ marginTop: 12 }}>
          {state.error}
        </p>
      )}

      {state.key && (
        <div className="adm-card" style={{ marginTop: 16 }}>
          <p className="adm-help">
            Key for <strong>{state.name}</strong> created. Copy it now — it is stored
            only as a hash and will not be shown again.
          </p>
          <code className="adm-code" style={{ display: "block", marginTop: 10, wordBreak: "break-all" }}>
            {state.key}
          </code>
          <button className="btn btn-ghost" type="button" onClick={copyKey} style={{ marginTop: 10 }}>
            {copied ? "Copied" : "Copy key"}
          </button>
        </div>
      )}
    </section>
  );
}
