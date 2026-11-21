"use client";

import { useState, useTransition } from "react";
import { confirmMfaAction, disableMfaAction, startMfaSetupAction } from "./actions";

export default function MfaPanel({ enabled }: { enabled: boolean }) {
  const [pending, startTransition] = useTransition();
  const [setup, setSetup] = useState<{ secret: string; otpauth: string } | null>(null);
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  function begin() {
    setError(null);
    setNotice(null);
    startTransition(async () => {
      const result = await startMfaSetupAction();
      if (result.error || !result.secret || !result.otpauth) {
        setError(result.error ?? "Could not start enrollment.");
        return;
      }
      setSetup({ secret: result.secret, otpauth: result.otpauth });
    });
  }

  function confirm() {
    setError(null);
    setNotice(null);
    startTransition(async () => {
      const result = await confirmMfaAction(code.trim());
      if (result.error) {
        setError(result.error);
        return;
      }
      setSetup(null);
      setCode("");
      setNotice("Two-factor authentication is on. Sensitive actions now ask for a code.");
    });
  }

  function disable() {
    const confirmed = window.confirm(
      "Turn off two-factor authentication?\n\nPublishing, key management, role changes, and release actions will no longer ask for an authenticator code.",
    );
    if (!confirmed) return;
    setError(null);
    setNotice(null);
    startTransition(async () => {
      const result = await disableMfaAction(code.trim());
      if (result.error) {
        setError(result.error);
        return;
      }
      setCode("");
      setNotice("Two-factor authentication is off.");
    });
  }

  async function copySecret() {
    if (!setup) return;
    try {
      await navigator.clipboard.writeText(setup.secret);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      setError("Clipboard access was blocked by the browser.");
    }
  }

  if (enabled) {
    return (
      <div className="adm-stack" style={{ gap: 10 }}>
        <p className="adm-help" style={{ margin: 0 }}>
          On. Publishing, API key management, user and role changes, config, and
          release actions require a fresh 6-digit code.
        </p>
        <label className="adm-field" style={{ maxWidth: 220 }}>
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
        <div className="adm-actions">
          <button className="btn btn-danger" type="button" onClick={disable} disabled={pending || code.length !== 6}>
            {pending ? "Working…" : "Turn off MFA"}
          </button>
        </div>
        {error && <p role="alert" className="adm-alert adm-alert-error">{error}</p>}
        {notice && <p role="status" className="adm-alert adm-alert-success">{notice}</p>}
      </div>
    );
  }

  return (
    <div className="adm-stack" style={{ gap: 10 }}>
      <p className="adm-help" style={{ margin: 0 }}>
        Not enrolled. Add a TOTP factor (1Password, Authy, Google Authenticator) so a
        stolen session cannot publish content or change access on its own.
      </p>

      {!setup ? (
        <div className="adm-actions">
          <button className="btn btn-primary" type="button" onClick={begin} disabled={pending}>
            {pending ? "Starting…" : "Set up MFA"}
          </button>
        </div>
      ) : (
        <>
          <ol className="adm-doc-body" style={{ margin: 0, paddingLeft: 20 }}>
            <li>Open your authenticator app and add an account manually.</li>
            <li>
              Enter this secret (spaces are ignored):
              <br />
              <code className="adm-code" style={{ display: "inline-block", marginTop: 6, wordBreak: "break-all" }}>
                {setup.secret}
              </code>
            </li>
            <li>Type the 6-digit code the app shows.</li>
          </ol>
          <div className="adm-inline">
            <button className="btn btn-ghost" type="button" onClick={copySecret}>
              {copied ? "Copied" : "Copy secret"}
            </button>
            <a className="btn btn-ghost" href={setup.otpauth}>
              Open in authenticator
            </a>
          </div>
          <label className="adm-field" style={{ maxWidth: 220 }}>
            <span className="adm-label">Verification code</span>
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
          <div className="adm-actions">
            <button className="btn btn-primary" type="button" onClick={confirm} disabled={pending || code.length !== 6}>
              {pending ? "Verifying…" : "Confirm and enable"}
            </button>
            <button
              className="btn btn-ghost"
              type="button"
              onClick={() => {
                setSetup(null);
                setCode("");
                setError(null);
              }}
              disabled={pending}
            >
              Cancel
            </button>
          </div>
        </>
      )}

      {error && <p role="alert" className="adm-alert adm-alert-error">{error}</p>}
      {notice && <p role="status" className="adm-alert adm-alert-success">{notice}</p>}
    </div>
  );
}
