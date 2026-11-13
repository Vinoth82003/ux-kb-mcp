import { getStore } from "@/lib/store";
import { requireAdmin } from "@/lib/authz";
import UserActions from "./user-actions";

export const dynamic = "force-dynamic";

export default async function UsersPage() {
  await requireAdmin();
  const store = await getStore();
  const users = await store.listUsers();

  const counts = await Promise.all(
    users.map(async (user) => ({
      id: user.id,
      active: await store.countActiveKeys(user.id),
    })),
  );
  const activeById = new Map(counts.map((row) => [row.id, row.active]));

  return (
    <div>
      <h2 style={{ marginTop: 0 }}>Users</h2>
      <p style={{ color: "var(--muted)", marginTop: 0 }}>
        Every GitHub identity that has signed in. Suspending blocks new sessions
        and stops the account from using its keys.
      </p>

      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 720 }}>
          <thead>
            <tr style={{ textAlign: "left", borderBottom: "1px solid var(--border)" }}>
              <th style={{ padding: 8 }}>Login</th>
              <th style={{ padding: 8 }}>Role</th>
              <th style={{ padding: 8 }}>Active keys</th>
              <th style={{ padding: 8 }}>Joined</th>
              <th style={{ padding: 8 }}>Status</th>
              <th style={{ padding: 8 }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} style={{ borderBottom: "1px solid var(--border)" }}>
                <td style={{ padding: 8 }}>
                  <code>github:{user.login}</code>
                </td>
                <td style={{ padding: 8 }}>{user.role.toLowerCase()}</td>
                <td style={{ padding: 8 }}>{activeById.get(user.id) ?? 0}</td>
                <td style={{ padding: 8 }}>{user.createdAt.toLocaleDateString()}</td>
                <td style={{ padding: 8, color: user.suspendedAt ? "#f87171" : "#4ade80" }}>
                  {user.suspendedAt ? "suspended" : "active"}
                </td>
                <td style={{ padding: 8 }}>
                  <UserActions id={user.id} suspended={Boolean(user.suspendedAt)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
