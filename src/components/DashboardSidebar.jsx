import { NavLink } from "react-router-dom";

import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/useAuth";

function DashboardSidebar({ role }) {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const menus = {
    OWNER: [
      { label: "Dashboard", path: "/owner/dashboard", icon: "📊" },
      { label: "My Vehicles", path: "/owner/vehicles", icon: "🚗" },
      { label: "Request Assistance", path: "/owner/request", icon: "🆘" },
      { label: "My Requests", path: "/owner/requests", icon: "📋" },
      { label: "Service History", path: "/owner/history", icon: "🕒" },
      { label: "Feedback", path: "/owner/feedback", icon: "⭐" },
    ],

    MECHANIC: [
      { label: "Dashboard", path: "/mechanic/dashboard", icon: "📊" },
      { label: "My Profile", path: "/mechanic/profile", icon: "👤" },
      { label: "Available Requests", path: "/mechanic/requests", icon: "🆘" },
      { label: "Active Service", path: "/mechanic/active", icon: "🔧" },
      { label: "Completed Jobs", path: "/mechanic/history", icon: "✅" },
      { label: "Availability", path: "/mechanic/availability", icon: "🟢" },
    ],

    ADMIN: [
      { label: "Dashboard", path: "/admin/dashboard", icon: "📊" },
      { label: "Users", path: "/admin/users", icon: "👥" },
      { label: "Mechanics", path: "/admin/mechanics", icon: "🔧" },
      { label: "Categories", path: "/admin/categories", icon: "🏷️" },
      { label: "Requests", path: "/admin/requests", icon: "📋" },
      { label: "Service History", path: "/admin/history", icon: "🕒" },
      { label: "Feedback", path: "/admin/feedback", icon: "⭐" },
    ],
  };

  const menuItems = menus[role] || [];

  return (
    <aside className="dashboard-sidebar">

      <div className="sidebar-brand">
        🚗 <span>RoadAssist</span>
      </div>

      <div className="sidebar-role">
        {role === "OWNER" && "Vehicle Owner"}
        {role === "MECHANIC" && "Mechanic"}
        {role === "ADMIN" && "Administrator"}
      </div>

      <nav className="sidebar-menu">

        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `sidebar-link ${isActive ? "active" : ""}`
            }
          >
            <span className="sidebar-icon">
              {item.icon}
            </span>

            <span>
              {item.label}
            </span>
          </NavLink>
        ))}

      </nav>

      <div className="sidebar-bottom">
        <button
          className="sidebar-logout"
          onClick={async () => {
            try {
              await logout();
            } finally {
              navigate("/login", { replace: true });
            }
          }}
        >
          🚪 Logout
        </button>
      </div>

    </aside>
  );
}

export default DashboardSidebar;
