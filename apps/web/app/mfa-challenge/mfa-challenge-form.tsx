"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { verifyMfaChallengeAction } from "./actions";

export default function MfaChallengeForm() {
  const router = useRouter();
  const { update } = useSession();
  const [code, setCode] = useState("");
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function submit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    startTransition(async () => {
      const result = await verifyMfaChallengeAction(code.trim());
      if (result.error) {
        setError(result.error);
        return;
      }
      // Ask Auth.js to re-issue the JWT with mfaVerified=true. The server
      // only honors this because the proof cookie was set by the action above.
      await update({ mfaVerified: true });
      router.replace("/dashboard");
      router.refresh();
    });
  }

  return (
    <form onSubmit={submit} className="adm-card" style={{ maxWidth: 420 }}>
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
          autoFocus
        />
      </label>
      <p className="adm-help" style={{ marginTop: 8 }}>
        Open your authenticator app and enter the current 6-digit code.
      </p>
      <div className="adm-actions" style={{ marginTop: 12 }}>
        <button className="btn btn-primary" type="submit" disabled={pending || code.length !== 6}>
          {pending ? "Verifying…" : "Verify and continue"}
        </button>
      </div>
      {error && (
        <p role="alert" className="adm-alert adm-alert-error" style={{ marginTop: 12 }}>
          {error}
        </p>
      )}
    </form>
  );
}
