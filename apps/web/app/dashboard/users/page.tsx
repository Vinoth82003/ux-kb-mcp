import { getStore } from "@/lib/store";
import { requireAdmin } from "@/lib/authz";
import PageHeader from "../page-header";
import UserActions from "./user-actions";

export const dynamic = "force-dynamic";

export default async function UsersPage() {
  const actor = await requireAdmin();
  const store = await getStore();
  const users = await store.listUsers();

  const enriched = await Promise.all(
    users.map(async (user) => ({
      ...user,
      activeKeys: await store.countActiveKeys(user.id),
    })),
  );
  const admins = enriched.filter((user) => user.role === "ADMIN" && !user.suspendedAt).length;

  return (
    <div>
      <PageHeader
        eyebrow="Settings"
        title="Users & roles"
        description="Every GitHub identity that has signed in. Role and suspension changes require a fresh authenticator code when the acting admin has MFA enabled."
        actions={
          <span className="adm-badge adm-badge-info">
            {admins} active {admins === 1 ? "admin" : "admins"}
          </span>
        }
      />

      <div className="adm-alert adm-alert-info" style={{ marginBottom: 16 }}>
        The last active admin cannot be demoted or suspended. Suspending an account
        revokes every API key it owns so access stops immediately.
      </div>

      {enriched.length === 0 ? (
        <div className="adm-empty">
          <strong>No users yet</strong>
          <p>Identities appear here after their first sign-in.</p>
        </div>
      ) : (
        <div className="adm-table-wrap">
          <table className="adm-table">
            <caption className="sr-only">Users, roles, and account status</caption>
            <thead>
              <tr>
                <th scope="col">Identity</th>
                <th scope="col">Role</th>
                <th scope="col">Active keys</th>
                <th scope="col">MFA</th>
                <th scope="col">Joined</th>
                <th scope="col">Status</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {enriched.map((user) => (
                <tr key={user.id}>
                  <td>
                    <strong>{user.name?.trim() || user.login}</strong>
                    <div className="adm-muted adm-small">
                      <code className="adm-code">github:{user.login}</code>
                    </div>
                  </td>
                  <td>
                    <span
                      className={`adm-badge ${user.role === "ADMIN" ? "adm-badge-warning" : "adm-badge-neutral"}`}
                    >
                      {user.role.toLowerCase()}
                    </span>
                  </td>
                  <td>{user.activeKeys}</td>
                  <td>
                    {user.mfaEnabled ? (
                      <span className="adm-badge adm-badge-success">on</span>
                    ) : (
                      <span className="adm-badge adm-badge-neutral">off</span>
                    )}
                  </td>
                  <td className="adm-muted">{user.createdAt.toLocaleDateString()}</td>
                  <td>
                    {user.suspendedAt ? (
                      <span className="adm-badge adm-badge-danger">suspended</span>
                    ) : (
                      <span className="adm-badge adm-badge-success">active</span>
                    )}
                  </td>
                  <td>
                    {user.id === actor.id ? (
                      <span className="adm-muted adm-small">This is you</span>
                    ) : (
                      <UserActions
                        id={user.id}
                        login={user.login}
                        suspended={Boolean(user.suspendedAt)}
                        role={user.role}
                        mfaEnabled={actor.mfaEnabled}
                      />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
