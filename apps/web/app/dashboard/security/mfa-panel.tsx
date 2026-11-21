"use client";

import { useState, useTransition } from "react";
import QRCode from "qrcode";
import { confirmMfaAction, disableMfaAction, startMfaSetupAction } from "./actions";

export default function MfaPanel({ enabled }: { enabled: boolean }) {
  const [pending, startTransition] = useTransition();
  const [setup, setSetup] = useState<{ secret: string; otpauth: string } | null>(null);
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
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
      try {
        const url = await QRCode.toDataURL(result.otpauth, { margin: 1, width: 220, errorCorrectionLevel: "M" });
        setQrDataUrl(url);
      } catch {
        setQrDataUrl(null);
      }
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
      setQrDataUrl(null);
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
        <div className="adm-stack" style={{ gap: 10 }}>
          <p className="adm-help" style={{ margin: 0 }}>
            Works with 1Password, Authy, Google Authenticator, Microsoft Authenticator,
            and any TOTP-compatible app.
          </p>
          <div className="adm-actions">
            <button className="btn btn-primary" type="button" onClick={begin} disabled={pending}>
              {pending ? "Starting…" : "Set up MFA"}
            </button>
          </div>
        </div>
      ) : (
        <div className="adm-stack" style={{ gap: 16 }}>
          <div className="adm-grid adm-grid-2" style={{ alignItems: "start" }}>
            <div className="adm-stack" style={{ gap: 10, alignItems: "center" }}>
              <div
                className="adm-card"
                style={{ padding: 12, background: "#fff", display: "grid", placeItems: "center" }}
                aria-label="QR code for your authenticator app"
              >
                {qrDataUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={qrDataUrl} alt="QR code containing the TOTP secret" width={220} height={220} />
                ) : (
                  <div className="adm-skeleton" style={{ width: 220, height: 220 }} />
                )}
              </div>
              <p className="adm-help" style={{ margin: 0, textAlign: "center" }}>
                Scan this with your authenticator app.
              </p>
            </div>

            <ol className="adm-doc-body" style={{ margin: 0, paddingLeft: 20 }}>
              <li>Open your authenticator app.</li>
              <li>Tap the <strong>+</strong> button to add an account.</li>
              <li>Select <strong>Other account</strong> (or “Enter a setup key”).</li>
              <li>Scan the QR code on the left, or enter the details manually:</li>
            </ol>
          </div>

          <div className="adm-card" style={{ padding: 12 }}>
            <dl className="adm-kv" style={{ gridTemplateColumns: "150px minmax(0, 1fr)" }}>
              <dt>Account name</dt>
              <dd><code className="adm-code">UX KB</code></dd>
              <dt>Secret key</dt>
              <dd style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                <code className="adm-code" style={{ wordBreak: "break-all" }}>{setup.secret}</code>
                <button className="btn btn-ghost" type="button" onClick={copySecret} style={{ padding: "4px 8px", fontSize: "0.78rem" }}>
                  {copied ? "Copied" : "Copy"}
                </button>
              </dd>
              <dt>Type</dt>
              <dd>Time-based (TOTP)</dd>
              <dt>Digits</dt>
              <dd>6</dd>
              <dt>Period</dt>
              <dd>30 seconds</dd>
            </dl>
            <p className="adm-help" style={{ marginTop: 8 }}>
              Spaces in the secret are ignored. Store the secret somewhere safe if you
              want a backup; it will not be shown again after enrollment.
            </p>
          </div>

          <label className="adm-field" style={{ maxWidth: 260 }}>
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
                setQrDataUrl(null);
              }}
              disabled={pending}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {error && <p role="alert" className="adm-alert adm-alert-error">{error}</p>}
      {notice && <p role="status" className="adm-alert adm-alert-success">{notice}</p>}
    </div>
  );
}
