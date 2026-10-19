import DashboardSidebar from "./DashboardSidebar";
import { Navigate } from "react-router-dom";
import { useAuth } from "../auth/useAuth";

function DashboardLayout({ role, children }) {
  const { user, loading } = useAuth();
  const dashboardRoutes = {
    OWNER: "/owner/dashboard",
    MECHANIC: "/mechanic/dashboard",
    ADMIN: "/admin/dashboard",
  };

  if (loading) return <div className="p-4 text-center">Checking your session...</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== role) return <Navigate to={dashboardRoutes[user.role] || "/login"} replace />;

  return (
    <div className="dashboard-layout">

      <DashboardSidebar role={role} />

      <main className="dashboard-content">
        {children}
      </main>

    </div>
  );
}

export default DashboardLayout;
