import { coreScreenGateItems, screenTypeExtraItems } from "@ux-kb/core";
import { getKb } from "@/lib/kb";
import { requireUser } from "@/lib/authz";

import GatePreview from "./gate-preview";

export default async function GatePage() {
  const user = await requireUser();
  const items = coreScreenGateItems();
  const extras = ["list", "form", "dashboard", "detail", "settings", "auth", "empty-state", "other"].map((t) => ({
    type: t,
    items: screenTypeExtraItems(t),
  }));

  return (
    <div>
      <h2 style={{ marginTop: 0 }}>Core Screen Gate</h2>
      <p style={{ color: "var(--muted)" }}>
        {items.length} core items. Warns when more than 12.
        {items.length > 12 && <span style={{ color: "#f87171" }}> ⚠ exceeds 12</span>}
      </p>

      <h3>Core items (SCR.*)</h3>
      <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 640 }}>
        <thead>
          <tr style={{ textAlign: "left", borderBottom: "1px solid var(--border)" }}>
            <th style={{ padding: 8 }}>ID</th>
            <th style={{ padding: 8 }}>Check</th>
            <th style={{ padding: 8 }}>Severity</th>
            <th style={{ padding: 8 }}>NA forbidden</th>
            <th style={{ padding: 8 }}>Has verify</th>
          </tr>
        </thead>
        <tbody>
          {items.map((it) => (
            <tr key={it.id} style={{ borderBottom: "1px solid var(--border)" }}>
              <td style={{ padding: 8 }}><code>{it.id}</code></td>
              <td style={{ padding: 8 }}>{it.check}</td>
              <td style={{ padding: 8 }}>{it.severity}</td>
              <td style={{ padding: 8 }}>{it.naForbidden ? "yes" : "no"}</td>
              <td style={{ padding: 8 }}>{it.verify?.hint ? "yes" : "no"}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3 style={{ marginTop: 24 }}>Screen-type extras</h3>
      {extras.map((e) => (
        <div key={e.type} style={{ marginBottom: 12 }}>
          <strong>{e.type}</strong>: {e.items.length === 0 ? "none" : e.items.map((i) => i.id).join(", ")}
        </div>
      ))}

      <h3 style={{ marginTop: 24 }}>Gate preview</h3>
      <p style={{ color: "var(--muted)", fontSize: "0.85rem" }}>
        Pick a screen type + components; the preview calls the same code path as the MCP <code>start_gate</code>.
      </p>
      <GatePreview />
    </div>
  );
}
