"use client";

import { useState, useTransition } from "react";
import { setSuspendedAction } from "./actions";

export default function UserActions({ id, suspended }: { id: string; suspended: boolean }) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function toggle() {
    setError(null);
    startTransition(async () => {
      const result = await setSuspendedAction(id, !suspended);
      if (result.error) setError(result.error);
    });
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
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
