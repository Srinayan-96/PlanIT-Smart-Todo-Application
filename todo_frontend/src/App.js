import "./App.css";
import { useEffect, useMemo, useState } from "react";
import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import DashboardHeader from "./components/DashboardHeader";
import Notification from "./components/Notification";
import StatsCards from "./components/StatsCards";
import TaskComposer from "./components/TaskComposer";
import TaskFilters from "./components/TaskFilters";
import TaskTable from "./components/TaskTable";
import AlertPanel from "./components/AlertPanel";
import AnalyticsBars from "./components/AnalyticsBars";
import SidebarNav from "./components/SidebarNav";
import ClockWidget from "./components/ClockWidget";
import FocusTimer from "./components/FocusTimer";
import KanbanBoard from "./components/KanbanBoard";
import ActivityTrend from "./components/ActivityTrend";
import { useNotification } from "./hooks/useNotification";
import {
  createTask,
  fetchActivityTrend,
  fetchAlerts,
  fetchTaskStats,
  fetchTasks,
  removeTask,
  toggleTaskStatus,
} from "./services/taskService";

function App() {
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    pending: 0,
    completionRate: 0,
  });
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [alerts, setAlerts] = useState([]);
  const [trend, setTrend] = useState([]);
  const [view, setView] = useState("table");
  const [activeSection, setActiveSection] = useState("dashboard");
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem("todo-theme") === "dark");
  const { notification, showNotification, clearNotification } = useNotification();

  const loadDashboard = async () => {
    setLoading(true);
    try {
      const [tasksRes, statsRes, alertsRes, trendRes] = await Promise.allSettled([
        fetchTasks({ completed: filter, search }),
        fetchTaskStats(),
        fetchAlerts(),
        fetchActivityTrend(),
      ]);

      if (tasksRes.status === "fulfilled") {
        setTasks(tasksRes.value.data);
      }
      if (statsRes.status === "fulfilled") {
        setStats(statsRes.value.data);
      }
      if (alertsRes.status === "fulfilled") {
        setAlerts(alertsRes.value.data);
      }
      if (trendRes.status === "fulfilled") {
        setTrend(trendRes.value.data);
      }

      const taskFailed = tasksRes.status === "rejected";
      if (taskFailed) {
        throw tasksRes.reason;
      }
    } catch (error) {
      showNotification(error.response?.data?.message || "Failed to load tasks", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter, search]);

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute("data-theme", darkMode ? "dark" : "light");
    localStorage.setItem("todo-theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  const visibleCount = useMemo(() => tasks.length, [tasks]);

  const handleAddTask = async (payload) => {
    try {
      await createTask(payload);
      showNotification("Task added successfully");
      loadDashboard();
    } catch (error) {
      showNotification(error.response?.data?.message || "Could not add task", "error");
    }
  };

  const handleToggleTask = async (id) => {
    try {
      await toggleTaskStatus(id);
      showNotification("Task status updated");
      loadDashboard();
    } catch (error) {
      showNotification(error.response?.data?.message || "Could not update task", "error");
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      await removeTask(id);
      showNotification("Task deleted");
      loadDashboard();
    } catch (error) {
      showNotification(error.response?.data?.message || "Could not delete task", "error");
    }
  };

  const handleNavigate = (section) => {
    setActiveSection(section);
    const target = document.getElementById(`section-${section}`);
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="app-shell">
      <SidebarNav activeSection={activeSection} onNavigate={handleNavigate} />
      <div className="main-column">
        <DashboardHeader darkMode={darkMode} onToggleTheme={() => setDarkMode((prev) => !prev)} />
        <main className="dashboard-content">
          <section className="dashboard-top" id="section-dashboard">
            <StatsCards stats={stats} visibleCount={visibleCount} />
          </section>
          <section className="insights-grid" id="section-insights">
            <AlertPanel alerts={alerts} />
            <AnalyticsBars stats={stats} />
          </section>
          <section className="insights-grid" id="section-analytics">
            <ActivityTrend trend={trend} />
          </section>
          <section className="insights-grid" id="section-focus">
            <ClockWidget />
            <FocusTimer />
          </section>
          <section className="dashboard-main" id="section-tasks">
            <TaskComposer onAddTask={handleAddTask} />
            <TaskFilters
              filter={filter}
              setFilter={setFilter}
              search={search}
              setSearch={setSearch}
            />
            <section className="card">
              <div className="view-toggle">
                <ToggleButtonGroup
                  exclusive
                  value={view}
                  onChange={(_, nextView) => nextView && setView(nextView)}
                  size="small"
                >
                  <ToggleButton value="table">Table View</ToggleButton>
                  <ToggleButton value="kanban">Kanban View</ToggleButton>
                </ToggleButtonGroup>
              </div>
            </section>
            {view === "table" ? (
              <TaskTable
                tasks={tasks}
                loading={loading}
                onToggle={handleToggleTask}
                onDelete={handleDeleteTask}
              />
            ) : (
              <KanbanBoard tasks={tasks} onToggle={handleToggleTask} onDelete={handleDeleteTask} />
            )}
          </section>
        </main>
        <Notification notification={notification} onClose={clearNotification} />
      </div>
    </div>
  );
}

export default App;
