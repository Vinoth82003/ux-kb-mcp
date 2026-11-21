"use client";

import { useState } from "react";
import { useActionState } from "react";
import { createKeyAction, type CreateKeyState } from "./actions";

const initial: CreateKeyState = { key: null, name: null, error: null };

const CONNECTORS = [
  { id: "claude", label: "Claude Code" },
  { id: "cursor", label: "Cursor" },
  { id: "windsurf", label: "Windsurf" },
  { id: "gemini", label: "Gemini CLI" },
  { id: "chatgpt", label: "ChatGPT (custom connector)" },
  { id: "generic", label: "Generic HTTP client" },
];

const ENDPOINT = "https://ux-kb-site.vercel.app/api/mcp";

function buildCommand(connector: string, key: string): string {
  switch (connector) {
    case "claude":
    case "gemini":
      return `${connector === "claude" ? "claude" : "gemini"} mcp add ${connector === "claude" ? "--transport http ux-kb " : "ux-kb "}${ENDPOINT} \\\n  --header "Authorization: Bearer ${key}"`;
    case "cursor":
      return `{\n  "mcpServers": {\n    "ux-kb": {\n      "url": "${ENDPOINT}",\n      "headers": { "Authorization": "Bearer ${key}" }\n    }\n  }\n}`;
    case "windsurf":
      return `{\n  "mcpServers": {\n    "ux-kb": {\n      "serverUrl": "${ENDPOINT}",\n      "headers": { "Authorization": "Bearer ${key}" }\n    }\n  }\n}`;
    case "chatgpt":
      return `URL: ${ENDPOINT}\nHeader: Authorization: Bearer ${key}`;
    default:
      return `POST ${ENDPOINT}\nAuthorization: Bearer ${key}`;
  }
}

export default function CreateKeyForm({
  maxRateLimit,
  defaultRateLimit,
  isAdmin,
  mfaEnabled,
}: {
  maxRateLimit: number;
  defaultRateLimit: number;
  isAdmin: boolean;
  mfaEnabled: boolean;
}) {
  const [state, action, pending] = useActionState(createKeyAction, initial);
  const [copied, setCopied] = useState(false);
  const [connector, setConnector] = useState("claude");
  const [showKey, setShowKey] = useState(false);
  const [commandCopied, setCommandCopied] = useState(false);

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

  async function copyCommand() {
    if (!state.key) return;
    try {
      await navigator.clipboard.writeText(buildCommand(connector, state.key));
      setCommandCopied(true);
      setTimeout(() => setCommandCopied(false), 1600);
    } catch {
      setCommandCopied(false);
    }
  }

  return (
    <section className="adm-card" aria-labelledby="create-key-title">
      <h2 id="create-key-title" className="adm-section-title">
        Create a key
      </h2>
      <form action={action}>
        <div className="adm-toolbar" style={{ marginBottom: 0 }}>
          <label className="adm-field" style={{ flex: "1 1 220px" }}>
            <span className="adm-label">Name</span>
            <input
              className="adm-input"
              name="name"
              required
              maxLength={64}
              placeholder="claude-code-laptop"
              autoComplete="off"
            />
          </label>
          <label className="adm-field">
            <span className="adm-label">Rate limit / min</span>
            <input
              className="adm-input"
              name="rateLimit"
              type="number"
              min={10}
              max={maxRateLimit}
              defaultValue={defaultRateLimit}
              style={{ width: 120 }}
            />
          </label>
          <label className="adm-field">
            <span className="adm-label">Expires</span>
            <select className="adm-select" name="expiry" defaultValue="90">
              <option value="30">30 days</option>
              <option value="90">90 days</option>
              <option value="365">1 year</option>
              {isAdmin && <option value="never">Never</option>}
            </select>
          </label>
          {mfaEnabled && (
            <label className="adm-field">
              <span className="adm-label">Authenticator code</span>
              <input
                className="adm-input"
                name="mfaCode"
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={7}
                placeholder="123456"
                style={{ width: 130 }}
              />
            </label>
          )}
          <button className="btn btn-primary" type="submit" disabled={pending}>
            {pending ? "Creating…" : "Create key"}
          </button>
        </div>
        <p className="adm-help" style={{ marginTop: 8 }}>
          Limits follow your role: up to {maxRateLimit} calls/min per key. Keys are
          shown once and stored only as a hash.
        </p>
      </form>

      {state.error && (
        <p role="alert" className="adm-alert adm-alert-error" style={{ marginTop: 12 }}>
          {state.error}
        </p>
      )}

      {state.key && (
        <div className="adm-card" style={{ marginTop: 16 }}>
          <p className="adm-help">
            Key for <strong>{state.name}</strong> created. Copy it now — it is stored
            only as a hash and will not be shown again.
          </p>
          <div className="adm-inline" style={{ gap: 8, marginTop: 10 }}>
            <code className="adm-code" style={{ flex: "1 1 auto", wordBreak: "break-all", padding: "8px 10px" }}>
              {showKey ? state.key : "••••••••••••••••"}
            </code>
            <button className="btn btn-ghost" type="button" onClick={() => setShowKey((value) => !value)} style={{ padding: "6px 12px", fontSize: "0.8rem" }}>
              {showKey ? "Hide" : "Show"}
            </button>
            <button className="btn btn-ghost" type="button" onClick={copyKey} style={{ padding: "6px 12px", fontSize: "0.8rem" }}>
              {copied ? "Copied" : "Copy key"}
            </button>
          </div>

          <div style={{ marginTop: 16 }}>
            <div className="adm-section-head" style={{ marginBottom: 6 }}>
              <span className="adm-label">Connection command (with your real key)</span>
              <div className="adm-inline">
                <select
                  className="adm-select"
                  value={connector}
                  onChange={(event) => setConnector(event.target.value)}
                  style={{ width: 180 }}
                >
                  {CONNECTORS.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.label}
                    </option>
                  ))}
                </select>
                <button className="btn btn-primary" type="button" onClick={copyCommand} style={{ padding: "6px 12px", fontSize: "0.8rem" }}>
                  {commandCopied ? "Copied" : "Copy command"}
                </button>
              </div>
            </div>
            <pre className="adm-pre">
              <code>{buildCommand(connector, showKey ? state.key : "<your-api-key>")}</code>
            </pre>
            <p className="adm-help" style={{ marginTop: 8 }}>
              {showKey
                ? "This command contains your real key. Copy it now; the key will not be shown again."
                : "Toggle Show to embed your real key in the command, or copy the template with a placeholder."}
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
