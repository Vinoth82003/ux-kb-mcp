import { requireUser } from "@/lib/authz";

export const dynamic = "force-dynamic";

export default async function ReviewPage() {
  await requireUser();
  return (
    <div>
      <h2 style={{ marginTop: 0 }}>Pending changes</h2>
      <p style={{ color: "var(--muted)" }}>
        Review queue. Self-approval is blocked in the UI and API (four-eyes rule).
      </p>
      <p style={{ fontSize: "0.85rem", color: "var(--muted)" }}>
        Automated checks run on submit: schema validity, sanitizer, token budgets, verify coverage, ID stability.
        A failing blocker check disables approval.
      </p>
      <div style={{ marginTop: 16, padding: 16, background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8 }}>
        No pending changes.
      </div>
    </div>
  );
}
