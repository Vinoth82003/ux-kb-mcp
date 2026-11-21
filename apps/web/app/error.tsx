"use client";

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <main style={{ padding: 40, textAlign: "center" }}>
      <h1>500 — Something went wrong</h1>
      <p style={{ color: "var(--muted)" }}>{error?.message ?? "Unexpected error."}</p>
      <button className="btn btn-primary" onClick={() => reset()}>Retry</button>
    </main>
  );
}
