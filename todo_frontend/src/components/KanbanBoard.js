const classify = (task) => {
  if (task.completed) return "done";
  if (!task.dueDate) return "planned";
  const due = new Date(task.dueDate);
  const now = new Date();
  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);
  if (due < now) return "overdue";
  if (due <= endOfDay) return "today";
  return "planned";
};

function Column({ title, tasks, onToggle, onDelete }) {
  return (
    <div className="kanban-col">
      <h4>{title}</h4>
      <div className="kanban-list">
        {tasks.map((task) => (
          <article className="kanban-card" key={task._id}>
            <p>{task.title}</p>
            <small>{task.dueDate ? new Date(task.dueDate).toLocaleString() : "No due date"}</small>
            <div className="timer-actions">
              <button className="action-btn" onClick={() => onToggle(task._id)}>
                Toggle
              </button>
              <button className="action-btn" onClick={() => onDelete(task._id)}>
                Delete
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

function KanbanBoard({ tasks, onToggle, onDelete }) {
  const columns = {
    overdue: tasks.filter((task) => classify(task) === "overdue"),
    today: tasks.filter((task) => classify(task) === "today"),
    planned: tasks.filter((task) => classify(task) === "planned"),
    done: tasks.filter((task) => classify(task) === "done"),
  };

  return (
    <section className="card">
      <div className="kanban-grid">
        <Column title="Overdue" tasks={columns.overdue} onToggle={onToggle} onDelete={onDelete} />
        <Column title="Today" tasks={columns.today} onToggle={onToggle} onDelete={onDelete} />
        <Column title="Planned" tasks={columns.planned} onToggle={onToggle} onDelete={onDelete} />
        <Column title="Done" tasks={columns.done} onToggle={onToggle} onDelete={onDelete} />
      </div>
    </section>
  );
}

export default KanbanBoard;
