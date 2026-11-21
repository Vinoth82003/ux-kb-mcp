export default function DashboardLoading() {
  return (
    <div aria-busy="true" aria-live="polite">
      <span className="sr-only">Loading dashboard data…</span>
      <div className="adm-skeleton" style={{ height: 22, width: 220, marginBottom: 10 }} />
      <div className="adm-skeleton" style={{ height: 14, width: 420, maxWidth: "70%", marginBottom: 24 }} />
      <div className="adm-stats">
        {Array.from({ length: 4 }).map((_, index) => (
          <div className="adm-skeleton" key={index} style={{ height: 92 }} />
        ))}
      </div>
      <div className="adm-skeleton" style={{ height: 280 }} />
    </div>
  );
}
