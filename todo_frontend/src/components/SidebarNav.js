import { FiBarChart2, FiCheckSquare, FiClock, FiGrid, FiHome } from "react-icons/fi";

const items = [
  { key: "dashboard", label: "Dashboard", icon: FiHome },
  { key: "tasks", label: "Tasks", icon: FiCheckSquare },
  { key: "insights", label: "Insights", icon: FiGrid },
  { key: "focus", label: "Focus", icon: FiClock },
  { key: "analytics", label: "Analytics", icon: FiBarChart2 },
];

function SidebarNav({ activeSection, onNavigate }) {
  return (
    <aside className="hover-sidebar">
      <div className="brand-mark">PlanIT</div>
      <nav className="side-nav">
        {items.map((item) => {
          const Icon = item.icon;
          return (
          <button
            key={item.key}
            className={`side-link ${activeSection === item.key ? "active-link" : ""}`}
            type="button"
            onClick={() => onNavigate(item.key)}
          >
            <span className="side-icon"><Icon /></span>
            <span className="side-link-label">{item.label}</span>
          </button>
          );
        })}
      </nav>
    </aside>
  );
}

export default SidebarNav;
