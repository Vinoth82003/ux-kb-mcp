import { getStore } from "@/lib/store";
import { revokeKeyAction } from "./actions";
import CreateKeyForm from "./create-key-form";

export const dynamic = "force-dynamic";

export default async function KeysPage() {
  const store = await getStore();
  const keys = await store.listKeys();
  return (
    <div>
      <h2>API keys</h2>
      <CreateKeyForm />
      <table style={{ width: "100%", marginTop: 24, borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ textAlign: "left", borderBottom: "1px solid var(--border)" }}>
            <th style={{ padding: 8 }}>Name</th>
            <th style={{ padding: 8 }}>Rate limit</th>
            <th style={{ padding: 8 }}>Pinned</th>
            <th style={{ padding: 8 }}>Last used</th>
            <th style={{ padding: 8 }}>Status</th>
            <th style={{ padding: 8 }}></th>
          </tr>
        </thead>
        <tbody>
          {keys.map((k) => (
            <tr key={k.id} style={{ borderBottom: "1px solid var(--border)" }}>
              <td style={{ padding: 8 }}>{k.name}</td>
              <td style={{ padding: 8 }}>{k.rateLimit}/min</td>
              <td style={{ padding: 8 }}>{k.pinnedVersion ?? "active release"}</td>
              <td style={{ padding: 8 }}>{k.lastUsedAt ? new Date(k.lastUsedAt).toLocaleString() : "never"}</td>
              <td style={{ padding: 8 }}>{k.revokedAt ? "revoked" : "active"}</td>
              <td style={{ padding: 8 }}>
                {!k.revokedAt && (
                  <form action={revokeKeyAction.bind(null, k.id)}>
                    <button className="btn btn-ghost" type="submit">
                      Revoke
                    </button>
                  </form>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
