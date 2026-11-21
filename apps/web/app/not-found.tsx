import Link from "next/link";

export default function NotFound() {
  return (
    <main style={{ padding: 40, textAlign: "center" }}>
      <h1>404 — Not found</h1>
      <p>The page you requested does not exist.</p>
      <Link href="/dashboard">Back to dashboard</Link>
    </main>
  );
}
