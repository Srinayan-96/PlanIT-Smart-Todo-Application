function AlertPanel({ alerts }) {
  return (
    <section className="card">
      <h3 className="panel-title">Upcoming Alerts</h3>
      {alerts.length === 0 ? (
        <p className="muted">No reminders or due-soon tasks.</p>
      ) : (
        <div className="alert-list">
          {alerts.slice(0, 6).map((alert) => (
            <article className="alert-item" key={alert._id}>
              <p className="alert-title">{alert.title}</p>
              <p className="muted">
                Due: {alert.dueDate ? new Date(alert.dueDate).toLocaleString() : "No deadline"}
              </p>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default AlertPanel;
