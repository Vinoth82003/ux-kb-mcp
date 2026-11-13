"use client";

import { useState, useTransition } from "react";
import { revokeKeyAction, rotateKeyAction } from "./actions";

export default function KeyActions({ id }: { id: string }) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [rotated, setRotated] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  function revoke() {
    if (!window.confirm("Revoke this key? Any client using it stops working immediately.")) return;
    setError(null);
    startTransition(async () => {
      const result = await revokeKeyAction(id);
      if (result.error) setError(result.error);
    });
  }

  function rotate() {
    setError(null);
    startTransition(async () => {
      const result = await rotateKeyAction(id);
      if (result.error) setError(result.error);
      else if (result.key) setRotated(result.key);
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
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <button className="btn btn-ghost" type="button" onClick={rotate} disabled={pending}>
          Rotate
        </button>
        <button className="btn btn-ghost" type="button" onClick={revoke} disabled={pending}>
          Revoke
        </button>
      </div>
      {error && (
        <span role="alert" style={{ color: "#f87171", fontSize: "0.8rem" }}>
          {error}
        </span>
      )}
      {rotated && (
        <div
          style={{
            marginTop: 4,
            padding: 10,
            border: "1px solid var(--border)",
            borderRadius: 8,
            maxWidth: 420,
          }}
        >
          <p style={{ margin: 0, fontSize: "0.78rem", color: "var(--muted)" }}>
            New key (shown once):
          </p>
          <code style={{ display: "block", wordBreak: "break-all", marginTop: 6 }}>{rotated}</code>
          <button className="btn btn-ghost" type="button" onClick={copy} style={{ marginTop: 8 }}>
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
      )}
    </div>
  );
}
