import Link from "next/link";

export default function Forbidden() {
  return (
    <main style={{ padding: 40, textAlign: "center" }}>
      <h1>403 — Forbidden</h1>
      <p>You do not have permission to view this page.</p>
      <Link href="/dashboard">Back to dashboard</Link>
    </main>
  );
}
