function ActivityTrend({ trend }) {
  const width = 320;
  const height = 120;
  const maxValue = Math.max(
    1,
    ...trend.flatMap((day) => [day.created || 0, day.completed || 0, day.deleted || 0])
  );

  const buildPath = (key) =>
    trend
      .map((day, i) => {
        const x = (i / Math.max(1, trend.length - 1)) * width;
        const y = height - ((day[key] || 0) / maxValue) * height;
        return `${i === 0 ? "M" : "L"} ${x} ${y}`;
      })
      .join(" ");

  return (
    <section className="card">
      <h3 className="panel-title">7-Day Activity Trend</h3>
      <svg viewBox={`0 0 ${width} ${height}`} className="trend-chart" role="img">
        <path d={buildPath("created")} className="trend-line created-line" />
        <path d={buildPath("completed")} className="trend-line completed-line" />
        <path d={buildPath("deleted")} className="trend-line deleted-line" />
      </svg>
      <p className="muted">Blue: created, Green: completed, Red: deleted</p>
    </section>
  );
}

export default ActivityTrend;
