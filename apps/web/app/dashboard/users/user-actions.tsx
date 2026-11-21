"use client";

import { useState, useTransition } from "react";
import { setSuspendedAction, setRoleAction } from "./actions";

const ROLES = ["VIEWER", "EDITOR", "REVIEWER", "PUBLISHER", "ADMIN"];

export default function UserActions({ id, suspended, role }: { id: string; suspended: boolean; role: string }) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function toggle() {
    setError(null);
    startTransition(async () => {
      const result = await setSuspendedAction(id, !suspended);
      if (result.error) setError(result.error);
    });
  }

  function changeRole(newRole: string) {
    setError(null);
    startTransition(async () => {
      const result = await setRoleAction(id, newRole);
      if (result.error) setError(result.error);
    });
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <select
        value={role}
        onChange={(e) => changeRole(e.target.value)}
        disabled={pending}
        style={{ padding: 4, borderRadius: 6, border: "1px solid var(--border)", background: "var(--surface)", color: "var(--text)" }}
      >
        {ROLES.map((r) => (
          <option key={r} value={r}>{r}</option>
        ))}
      </select>
      <button className="btn btn-ghost" type="button" onClick={toggle} disabled={pending}>
        {suspended ? "Restore" : "Suspend"}
      </button>
      {error && (
        <span role="alert" style={{ color: "#f87171", fontSize: "0.78rem" }}>
          {error}
        </span>
      )}
    </div>
  );
}
