import { getKb } from "@/lib/kb";
import { requireUser } from "@/lib/authz";
import { routeFeature } from "@ux-kb/core";

import RouteTester from "./route-tester";

export default async function RoutingPage() {
  await requireUser();
  const kb = getKb();
  const routes = kb.repo.routes();
  return (
    <div>
      <h2 style={{ marginTop: 0 }}>Routing</h2>
      <p style={{ color: "var(--muted)" }}>{routes.length} routing rules.</p>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 640 }}>
          <thead>
            <tr style={{ textAlign: "left", borderBottom: "1px solid var(--border)" }}>
              <th style={{ padding: 8 }}>Match tags</th>
              <th style={{ padding: 8 }}>Added docs</th>
            </tr>
          </thead>
          <tbody>
            {routes.map((r, i) => (
              <tr key={i} style={{ borderBottom: "1px solid var(--border)" }}>
                <td style={{ padding: 8 }}>{r.match.join(", ")}</td>
                <td style={{ padding: 8 }}>{r.add.join(", ")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <h3 style={{ marginTop: 24 }}>Route tester</h3>
      <RouteTester />
    </div>
  );
}
