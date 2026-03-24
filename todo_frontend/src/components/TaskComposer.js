import { useState } from "react";
import { Button, MenuItem, TextField } from "@mui/material";

function TaskComposer({ onAddTask }) {
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [reminderAt, setReminderAt] = useState("");
  const [priority, setPriority] = useState("medium");
  const [category, setCategory] = useState("General");

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!title.trim()) {
      return;
    }
    onAddTask({
      title: title.trim(),
      dueDate: dueDate || null,
      reminderAt: reminderAt || null,
      priority,
      category: category.trim() || "General",
    });
    setTitle("");
    setDueDate("");
    setReminderAt("");
    setPriority("medium");
    setCategory("General");
  };

  return (
    <section className="card">
      <form className="composer-row" onSubmit={handleSubmit}>
        <TextField
          className="mui-input"
          label="Task title"
          size="small"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
        />
        <TextField
          className="mui-input"
          label="Deadline"
          size="small"
          type="datetime-local"
          value={dueDate}
          onChange={(event) => setDueDate(event.target.value)}
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          className="mui-input"
          label="Reminder"
          size="small"
          type="datetime-local"
          value={reminderAt}
          onChange={(event) => setReminderAt(event.target.value)}
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          className="mui-input"
          select
          label="Priority"
          size="small"
          value={priority}
          onChange={(event) => setPriority(event.target.value)}
        >
          <MenuItem value="low">Low</MenuItem>
          <MenuItem value="medium">Medium</MenuItem>
          <MenuItem value="high">High</MenuItem>
        </TextField>
        <TextField
          className="mui-input"
          label="Category"
          size="small"
          value={category}
          onChange={(event) => setCategory(event.target.value)}
        />
        <Button className="mui-primary-btn" variant="contained" type="submit">
          Add Task
        </Button>
      </form>
    </section>
  );
}

export default TaskComposer;
