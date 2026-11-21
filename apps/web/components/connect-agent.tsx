"use client";

import { useMemo, useState } from "react";

type KeyOption = { id: string; name: string; prefix: string };

type Connector = {
  id: string;
  label: string;
  build: (url: string, key: string) => string;
};

const ENDPOINT = "https://ux-kb-site.vercel.app/api/mcp";

const CONNECTORS: Connector[] = [
  {
    id: "claude",
    label: "Claude Code",
    build: (url, key) =>
      `claude mcp add --transport http ux-kb ${url} \\\n  --header "Authorization: Bearer ${key}"`,
  },
  {
    id: "cursor",
    label: "Cursor",
    build: (url, key) =>
      `{\n  "mcpServers": {\n    "ux-kb": {\n      "url": "${url}",\n      "headers": {\n        "Authorization": "Bearer ${key}"\n      }\n    }\n  }\n}`,
  },
  {
    id: "windsurf",
    label: "Windsurf",
    build: (url, key) =>
      `{\n  "mcpServers": {\n    "ux-kb": {\n      "serverUrl": "${url}",\n      "headers": {\n        "Authorization": "Bearer ${key}"\n      }\n    }\n  }\n}`,
  },
  {
    id: "gemini",
    label: "Gemini CLI",
    build: (url, key) =>
      `gemini mcp add ux-kb ${url} \\\n  --header "Authorization: Bearer ${key}"`,
  },
  {
    id: "chatgpt",
    label: "ChatGPT (custom connector)",
    build: (url, key) =>
      `URL: ${url}\nHeader: Authorization: Bearer ${key}`,
  },
  {
    id: "generic",
    label: "Generic HTTP client",
    build: (url, key) =>
      `POST ${url}\nAuthorization: Bearer ${key}\nContent-Type: application/json`,
  },
];

export default function ConnectAgent({ keys }: { keys: KeyOption[] }) {
  const [connector, setConnector] = useState<string>("claude");
  const [selectedKeyId, setSelectedKeyId] = useState<string>(keys[0]?.id ?? "");
  const [copied, setCopied] = useState<boolean>(false);
  const [showCommand, setShowCommand] = useState<boolean>(true);

  const selectedKey = keys.find((key) => key.id === selectedKeyId) ?? keys[0];
  const connectorDef = CONNECTORS.find((item) => item.id === connector) ?? CONNECTORS[0];

  const command = useMemo(
    () => connectorDef.build(ENDPOINT, "<your-api-key>"),
    [connectorDef],
  );

  async function copy() {
    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  }

  const hasKeys = keys.length > 0;

  return (
    <section className="adm-card" aria-labelledby="connect-title">
      <div className="adm-section-head">
        <h2 id="connect-title" className="adm-section-title">
          {hasKeys ? "Connect an agent" : "Create your first API key"}
        </h2>
      </div>

      {!hasKeys ? (
        <>
          <p className="adm-desc">
            Keys are shown once and stored only as a hash. Create one, then return here
            to copy a ready-to-paste connection command.
          </p>
          <a className="btn btn-primary" href="/member/keys" style={{ marginTop: 12, display: "inline-flex" }}>
            Create a key
          </a>
        </>
      ) : (
        <div className="adm-stack" style={{ gap: 12 }}>
          <div className="adm-toolbar" style={{ marginBottom: 0 }}>
            <label className="adm-field">
              <span className="adm-label">Connector</span>
              <select
                className="adm-select"
                value={connector}
                onChange={(event) => setConnector(event.target.value)}
              >
                {CONNECTORS.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="adm-field" style={{ flex: "1 1 220px" }}>
              <span className="adm-label">Key to use</span>
              <select
                className="adm-select"
                value={selectedKeyId}
                onChange={(event) => setSelectedKeyId(event.target.value)}
              >
                {keys.map((key) => (
                  <option key={key.id} value={key.id}>
                    {key.name} ({key.prefix}…)
                  </option>
                ))}
              </select>
            </label>
          </div>

          <p className="adm-help" style={{ margin: 0 }}>
            The command uses <code className="adm-code">&lt;your-api-key&gt;</code> as a
            placeholder. Replace it with the key you saved when you created it.
            {selectedKey ? ` Selected key: ${selectedKey.name} (${selectedKey.prefix}…).` : ""}
          </p>

          <div>
            <div className="adm-section-head" style={{ marginBottom: 6 }}>
              <span className="adm-label">Connection command</span>
              <div className="adm-inline">
                <button
                  className="btn btn-ghost"
                  type="button"
                  onClick={() => setShowCommand((value) => !value)}
                  style={{ padding: "6px 12px", fontSize: "0.8rem" }}
                >
                  {showCommand ? "Hide" : "Show"}
                </button>
                <button className="btn btn-primary" type="button" onClick={copy} style={{ padding: "6px 12px", fontSize: "0.8rem" }}>
                  {copied ? "Copied" : "Copy"}
                </button>
              </div>
            </div>
            {showCommand ? (
              <pre className="adm-pre">
                <code>{command}</code>
              </pre>
            ) : (
              <p className="adm-help" style={{ margin: 0 }}>Command hidden.</p>
            )}
          </div>

          <p className="adm-help" style={{ margin: 0 }}>
            Endpoint: <code className="adm-code">{ENDPOINT}</code>
          </p>
        </div>
      )}
    </section>
  );
}
