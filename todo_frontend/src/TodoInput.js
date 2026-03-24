import { useState } from "react";
import { addTask } from "./api";

function TodoInput({ setTasks }) {
  const [title, setTitle] = useState("");

  function handleAdd() {
    if (title.trim() === "") return;
    addTask(title)
      .then(res => {
        setTasks(prev => [...prev, res.data]);
        setTitle("");
      })
      .catch(err => console.error("Add error:", err));
  }

  return (
    <div>
      <input
        type="text"
        placeholder="Enter task..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <button onClick={handleAdd}>
        Add
      </button>
    </div>
  );
}

export default TodoInput;
