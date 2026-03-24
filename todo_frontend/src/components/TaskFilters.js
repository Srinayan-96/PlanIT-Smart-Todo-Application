import { MenuItem, TextField } from "@mui/material";

function TaskFilters({ filter, setFilter, search, setSearch }) {
  return (
    <section className="card">
      <div className="filter-row">
        <TextField
          className="mui-input"
          select
          label="Filter"
          size="small"
          value={filter}
          onChange={(event) => setFilter(event.target.value)}
        >
          <MenuItem value="all">All</MenuItem>
          <MenuItem value="true">Completed</MenuItem>
          <MenuItem value="false">Pending</MenuItem>
        </TextField>
        <TextField
          className="mui-input"
          label="Search tasks"
          size="small"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
      </div>
    </section>
  );
}

export default TaskFilters;
