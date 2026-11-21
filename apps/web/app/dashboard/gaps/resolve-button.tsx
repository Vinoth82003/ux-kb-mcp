"use client";

import { useState, useTransition } from "react";
import { resolveGapAction } from "../actions";

export default function ResolveGapButton({ id, topic }: { id: string; topic: string }) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  function resolve() {
    const confirmed = window.confirm(
      `Mark “${topic}” as covered?\n\nIt leaves the open gaps inbox. This is audited and can be reversed only from the database.`,
    );
    if (!confirmed) return;
    setError(null);
    startTransition(async () => {
      const result = await resolveGapAction(id);
      if (result.error) setError(result.error);
      else setDone(true);
    });
  }

  if (done) return <span className="adm-badge adm-badge-success">covered</span>;

  return (
    <div className="adm-stack" style={{ gap: 4 }}>
      <button className="btn btn-ghost" type="button" onClick={resolve} disabled={pending}>
        {pending ? "Saving…" : "Mark covered"}
      </button>
      {error && (
        <span role="alert" className="adm-small" style={{ color: "var(--error)" }}>
          {error}
        </span>
      )}
    </div>
  );
}
