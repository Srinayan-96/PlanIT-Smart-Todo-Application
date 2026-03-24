function AnalyticsBars({ stats }) {
  const total = Math.max(1, stats.total || 0);
  const completedPct = Math.round(((stats.completed || 0) / total) * 100);
  const pendingPct = 100 - completedPct;
  const overduePct = Math.min(100, Math.round(((stats.overdue || 0) / total) * 100));

  return (
    <section className="card">
      <h3 className="panel-title">Progress Map</h3>
      <div className="bar-row">
        <span>Completed</span>
        <div className="bar-track">
          <div className="bar-fill completed-fill" style={{ width: `${completedPct}%` }} />
        </div>
        <strong>{completedPct}%</strong>
      </div>
      <div className="bar-row">
        <span>Pending</span>
        <div className="bar-track">
          <div className="bar-fill pending-fill" style={{ width: `${pendingPct}%` }} />
        </div>
        <strong>{pendingPct}%</strong>
      </div>
      <div className="bar-row">
        <span>Overdue</span>
        <div className="bar-track">
          <div className="bar-fill overdue-fill" style={{ width: `${overduePct}%` }} />
        </div>
        <strong>{overduePct}%</strong>
      </div>
    </section>
  );
}

export default AnalyticsBars;
