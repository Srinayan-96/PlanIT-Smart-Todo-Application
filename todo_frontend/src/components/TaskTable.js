function TaskTable({ tasks, loading, onToggle, onDelete }) {
  const getDeadlineState = (task) => {
    if (!task.dueDate) {
      return "No deadline";
    }
    const due = new Date(task.dueDate);
    if (!task.completed && due < new Date()) {
      return "Overdue";
    }
    return due.toLocaleString();
  };

  return (
    <section className="card">
      <div className="table-wrap">
        <table className="task-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Status</th>
              <th>Priority</th>
              <th>Category</th>
              <th>Deadline</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan="7">Loading tasks...</td>
              </tr>
            )}
            {!loading && tasks.length === 0 && (
              <tr>
                <td colSpan="7">No tasks found for this filter.</td>
              </tr>
            )}
            {!loading &&
              tasks.map((task) => (
                <tr key={task._id}>
                  <td>{task.title}</td>
                  <td>
                    <span className={`badge ${task.completed ? "completed" : "pending"}`}>
                      {task.completed ? "Completed" : "Pending"}
                    </span>
                  </td>
                  <td>
                    <span className={`badge priority-${task.priority || "medium"}`}>
                      {task.priority || "medium"}
                    </span>
                  </td>
                  <td>{task.category || "General"}</td>
                  <td>{getDeadlineState(task)}</td>
                  <td>{new Date(task.createdAt).toLocaleDateString()}</td>
                  <td>
                    <button className="action-btn" onClick={() => onToggle(task._id)}>
                      Toggle
                    </button>
                    <button className="action-btn" onClick={() => onDelete(task._id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default TaskTable;
