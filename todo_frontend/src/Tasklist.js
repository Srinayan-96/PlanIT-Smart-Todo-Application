import { deleteTask, toggleTask } from "./api";

function Tasklist({ tasks, setTasks }) {

  const handleDelete = (id) => {
    deleteTask(id).then(() => {
      setTasks(prev => prev.filter(task => task._id !== id));
    });
  };

  const handleToggle = (id) => {
    toggleTask(id).then(res => {
      setTasks(prev => prev.map(t =>
        t._id === id ? res.data : t
      ));
    });
  };

  return (
    <div>
      <h2>Your Tasks</h2>

      {tasks.length === 0 ? (
        <p>No tasks yet...</p>
      ) : (
        <ul className="todo-list">
          {tasks.map(task => (
            <li
              key={task._id}
              style={{
                textDecoration: task.completed ? "line-through" : "none",
                cursor: "pointer"
              }}
            >
              <span
                    className={task.completed ? "completed" : ""}
                    onClick={() => handleToggle(task._id)}
                >
                    {task.title}
            </span>


              <button
                onClick={() => handleDelete(task._id)}
                style={{ marginLeft: "10px", color: "red" }}
              >
                ❌
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Tasklist;
