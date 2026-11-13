"use client";

import { useActionState } from "react";
import { createKeyAction, type CreateKeyState } from "./actions";

const initial: CreateKeyState = { key: null, name: null, error: null };

export default function CreateKeyForm() {
  const [state, action, pending] = useActionState(createKeyAction, initial);
  return (
    <div>
      <form action={action} style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "end" }}>
        <label>
          <span style={{ display: "block", fontSize: "0.8rem", color: "var(--muted)" }}>Name</span>
          <input name="name" required style={{ padding: 8, borderRadius: 8, border: "1px solid var(--border)", background: "var(--surface)", color: "var(--text)" }} />
        </label>
        <label>
          <span style={{ display: "block", fontSize: "0.8rem", color: "var(--muted)" }}>Rate limit / min</span>
          <input name="rateLimit" type="number" defaultValue={120} style={{ padding: 8, borderRadius: 8, border: "1px solid var(--border)", background: "var(--surface)", color: "var(--text)", width: 100 }} />
        </label>
        <button className="btn btn-primary" type="submit" disabled={pending}>
          {pending ? "Creating..." : "Create key"}
        </button>
      </form>
      {state.error && <p style={{ color: "#f87171", marginTop: 8 }}>{state.error}</p>}
      {state.key && (
        <div style={{ marginTop: 12, padding: 12, background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8 }}>
          <p style={{ margin: 0, fontSize: "0.85rem", color: "var(--muted)" }}>
            Key created for <strong>{state.name}</strong>. Copy it now — it will not be shown again.
          </p>
          <code style={{ display: "block", marginTop: 8, wordBreak: "break-all" }}>{state.key}</code>
        </div>
      )}
    </div>
  );
}
