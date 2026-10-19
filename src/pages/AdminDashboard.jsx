import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/client";

function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");
  useEffect(() => {
    api.get("/api/admin/overview").then(({ data }) => setStats(data))
      .catch(() => setError("Unable to load current platform statistics."));
  }, []);
  const metrics = stats ? [
    ["Users", stats.users], ["Active Users", stats.activeUsers],
    ["Requests", stats.requests], ["Awaiting Mechanic", stats.requested],
    ["Completed", stats.completed], ["Feedback", stats.feedback],
  ] : [];
  const sections = [["Users", "/admin/users"], ["Mechanics", "/admin/mechanics"], ["Categories", "/admin/categories"], ["Requests", "/admin/requests"], ["Service History", "/admin/history"], ["Feedback", "/admin/feedback"]];
  return (
    <div className="p-4">
      <div className="mb-4"><h2 className="fw-bold mb-1">Admin Dashboard</h2><p className="text-muted mb-0">Current RoadAssist platform activity.</p></div>
      {error && <div className="alert alert-danger" role="alert">{error}</div>}
      <div className="row g-3 mb-4">{metrics.map(([label,value])=><div className="col-6 col-lg-4" key={label}><div className="card border-0 shadow-sm h-100"><div className="card-body"><p className="text-muted mb-1">{label}</p><h3 className="fw-bold mb-0">{value}</h3></div></div></div>)}</div>
      <div className="row g-3">{sections.map(([title,path])=><div className="col-md-6 col-lg-4" key={path}><div className="card border-0 shadow-sm h-100"><div className="card-body p-4"><h5 className="fw-bold">{title}</h5><Link className="btn btn-outline-primary" to={path}>Open {title}</Link></div></div></div>)}</div>
    </div>
  );
}
export default AdminDashboard;
