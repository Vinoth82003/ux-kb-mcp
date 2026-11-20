"use client";

import { useState } from "react";

export default function ReleaseActions() {
  const [msg, setMsg] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function act(action: string) {
    setPending(true);
    setMsg(null);
    try {
      const res = await fetch(`/api/releases/${action}`, { method: "POST" });
      const data = await res.json();
      setMsg(res.ok ? `${action}: ok` : (data?.error ?? `${action}: failed`));
    } catch (e) {
      setMsg(e instanceof Error ? e.message : String(e));
    } finally {
      setPending(false);
    }
  }

  return (
    <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
      <button className="btn btn-ghost" disabled={pending} onClick={() => act("stage")}>Stage</button>
      <button className="btn btn-primary" disabled={pending} onClick={() => act("promote")}>Promote</button>
      <button className="btn btn-ghost" disabled={pending} onClick={() => { if (confirm("Roll back to previous version? This is audited.")) act("rollback"); }}>Rollback</button>
      {msg && <span style={{ alignSelf: "center", fontSize: "0.85rem", color: "var(--muted)" }}>{msg}</span>}
    </div>
  );
}
