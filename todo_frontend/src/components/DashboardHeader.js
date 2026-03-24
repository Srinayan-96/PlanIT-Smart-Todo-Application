import { Button } from "@mui/material";
import { FiMoon, FiSun } from "react-icons/fi";

function DashboardHeader({ darkMode, onToggleTheme }) {
  return (
    <header className="dashboard-header">
      <div>
        <h1 className="dashboard-title">Task Dashboard</h1>
        <p className="dashboard-subtitle">Track progress, manage priorities, finish faster</p>
      </div>
      <Button
        className="mui-header-btn"
        variant="outlined"
        onClick={onToggleTheme}
        startIcon={darkMode ? <FiSun /> : <FiMoon />}
      >
        {darkMode ? "Light Mode" : "Dark Mode"}
      </Button>
    </header>
  );
}

export default DashboardHeader;
