const StatCard = ({ label, value }) => (
  <article className="stat-card">
    <p className="stat-label">{label}</p>
    <p className="stat-value">{value}</p>
  </article>
);

function StatsCards({ stats, visibleCount }) {
  const priorities = stats.priorityBreakdown || {};

  return (
    <div className="stats-grid">
      <StatCard label="Total Tasks" value={stats.total} />
      <StatCard label="Completed" value={stats.completed} />
      <StatCard label="Pending" value={stats.pending} />
      <StatCard label="Completion Rate" value={`${stats.completionRate}%`} />
      <StatCard label="Efficiency Score" value={`${stats.efficiencyScore || 0}%`} />
      <StatCard label="Deleted History" value={stats.deletedHistory || 0} />
      <StatCard label="Overdue" value={stats.overdue || 0} />
      <StatCard label="Due in 24h" value={stats.dueSoon || 0} />
      <StatCard label="Visible (Filtered)" value={visibleCount} />
      <StatCard
        label="Priority Mix"
        value={`H:${priorities.high || 0} M:${priorities.medium || 0} L:${priorities.low || 0}`}
      />
    </div>
  );
}

export default StatsCards;
