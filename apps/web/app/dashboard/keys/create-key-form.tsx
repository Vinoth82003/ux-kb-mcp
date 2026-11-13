"use client";

import { useState } from "react";
import { useActionState } from "react";
import { createKeyAction, type CreateKeyState } from "./actions";

const initial: CreateKeyState = { key: null, name: null, error: null };

const fieldStyle: React.CSSProperties = {
  padding: 8,
  borderRadius: 8,
  border: "1px solid var(--border)",
  background: "var(--surface)",
  color: "var(--text)",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: "0.8rem",
  color: "var(--muted)",
  marginBottom: 4,
};

export default function CreateKeyForm({
  maxRateLimit,
  defaultRateLimit,
  isAdmin,
}: {
  maxRateLimit: number;
  defaultRateLimit: number;
  isAdmin: boolean;
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
    <div>
      <form
        action={action}
        style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "flex-end" }}
      >
        <label>
          <span style={labelStyle}>Name</span>
          <input
            name="name"
            required
            maxLength={64}
            placeholder="claude-code-laptop"
            style={{ ...fieldStyle, minWidth: 220 }}
          />
        </label>
        <label>
          <span style={labelStyle}>Rate limit / min</span>
          <input
            name="rateLimit"
            type="number"
            min={10}
            max={maxRateLimit}
            defaultValue={defaultRateLimit}
            style={{ ...fieldStyle, width: 110 }}
          />
        </label>
        <label>
          <span style={labelStyle}>Expires</span>
          <select name="expiry" defaultValue="90" style={fieldStyle}>
            <option value="30">30 days</option>
            <option value="90">90 days</option>
            <option value="365">1 year</option>
            {isAdmin && <option value="never">Never</option>}
          </select>
        </label>
        <button className="btn btn-primary" type="submit" disabled={pending}>
          {pending ? "Creating..." : "Create key"}
        </button>
      </form>

      {state.error && (
        <p role="alert" style={{ color: "#f87171", marginTop: 12 }}>
          {state.error}
        </p>
      )}

      {state.key && (
        <div
          style={{
            marginTop: 16,
            padding: 14,
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: 10,
          }}
        >
          <p style={{ margin: 0, fontSize: "0.85rem", color: "var(--muted)" }}>
            Key for <strong>{state.name}</strong> created. Copy it now — it is
            stored only as a hash and will not be shown again.
          </p>
          <code
            style={{
              display: "block",
              marginTop: 10,
              wordBreak: "break-all",
              padding: "8px 10px",
              background: "rgba(255,255,255,0.04)",
              borderRadius: 8,
            }}
          >
            {state.key}
          </code>
          <button className="btn btn-ghost" type="button" onClick={copyKey} style={{ marginTop: 10 }}>
            {copied ? "Copied" : "Copy key"}
          </button>
        </div>
      )}
    </div>
  );
}
