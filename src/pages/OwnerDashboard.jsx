import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/client";
import { useAuth } from "../auth/useAuth";

function OwnerDashboard() {
  const { user } = useAuth();
  const [counts, setCounts] = useState({ vehicles: 0, active: 0, completed: 0 });
  const [error, setError] = useState("");
  useEffect(() => {
    Promise.all([api.get("/api/owner/vehicles"), api.get("/api/owner/requests")])
      .then(([vehicles, requests]) => setCounts({
        vehicles: vehicles.data.length,
        active: requests.data.filter((request) => request.status !== "COMPLETED").length,
        completed: requests.data.filter((request) => request.status === "COMPLETED").length,
      }))
      .catch(() => setError("Unable to load your dashboard summary."));
  }, []);
  return (
    <div className="dashboard-page"><div className="container py-5">
      <div className="mb-4"><h2 className="fw-bold">Welcome, {user?.fullName || "Vehicle Owner"}</h2><p className="text-secondary">Manage your vehicles and request roadside assistance.</p></div>
      {error && <div className="alert alert-danger" role="alert">{error}</div>}
      <div className="row g-4 mb-5">{[["My Vehicles",counts.vehicles], ["Active Requests",counts.active], ["Completed Services",counts.completed]].map(([title,value])=><div className="col-md-4" key={title}><div className="card border-0 shadow-sm dashboard-stat-card"><div className="card-body p-4"><p className="text-secondary mb-1">{title}</p><h3 className="fw-bold mb-0">{value}</h3></div></div></div>)}</div>
      <h4 className="fw-bold mb-3">Quick Actions</h4><div className="row g-4">{[["Manage Vehicles","/owner/vehicles"],["Request Assistance","/owner/request"],["Track Requests","/owner/requests"],["Service History","/owner/history"],["Feedback","/owner/feedback"]].map(([label,path])=><div className="col-md-6 col-lg-4" key={path}><div className="card border-0 shadow-sm h-100"><div className="card-body p-4"><h5 className="fw-bold">{label}</h5><Link to={path} className="btn btn-outline-primary">Open {label}</Link></div></div></div>)}</div>
    </div></div>
  );
}
export default OwnerDashboard;
