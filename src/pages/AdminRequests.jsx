import { useEffect, useState } from "react";
import api from "../api/client";

const labels = { REQUESTED: "Requested", ACCEPTED: "Accepted", ON_THE_WAY: "On the Way", IN_SERVICE: "In Service", COMPLETED: "Completed" };
function AdminRequests() {
  const [requests, setRequests] = useState([]);
  const [filter, setFilter] = useState("ALL");
  const [error, setError] = useState("");
  useEffect(() => {
    api.get("/api/admin/requests")
      .then(({ data }) => {
        setRequests(data.content.map((r) => ({ ...r, owner: r.ownerName, vehicle: r.vehicleNumber, problem: r.problemCategory, mechanic: r.mechanicName || "Not assigned", status: labels[r.status] || r.status })));
      })
      .catch(() => setError("Unable to load requests."));
  }, []);

  const statusClass = (status) => status === "Completed" ? "bg-success" : status === "Requested" ? "bg-warning text-dark" : status === "Accepted" ? "bg-primary" : status === "On the Way" ? "bg-info text-dark" : "bg-secondary";
  const filtered = requests.filter((r) => filter === "ALL" || r.status === filter);
  return (
    <div className="p-4">
      <h2 className="fw-bold mb-1">Assistance Requests</h2>
      <p className="text-muted mb-4">Monitor breakdown requests across the platform.</p>
      {error && <div className="alert alert-danger" role="alert">{error}</div>}
      <div className="row g-3 mb-4">{["Requested", "Accepted", "In Service", "Completed"].map((status) => <div className="col-6 col-lg-3" key={status}><div className="card border-0 shadow-sm"><div className="card-body"><p className="text-muted mb-1">{status}</p><h3 className="fw-bold">{requests.filter((r) => r.status === status).length}</h3></div></div></div>)}</div>
      <div className="card border-0 shadow-sm"><div className="card-body p-4"><div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-3"><h5 className="fw-bold mb-0">All Requests</h5><select className="form-select" style={{ maxWidth: "230px" }} value={filter} onChange={(e) => setFilter(e.target.value)}><option value="ALL">All statuses</option>{Object.values(labels).map((label) => <option key={label}>{label}</option>)}</select></div>
        <div className="table-responsive"><table className="table align-middle"><thead><tr><th>Request ID</th><th>Owner</th><th>Vehicle</th><th>Problem</th><th>Location</th><th>Mechanic</th><th>Status</th></tr></thead><tbody>{filtered.map((r) => <tr key={r.id}><td className="fw-semibold">#{r.id}</td><td>{r.owner}</td><td>{r.vehicle}</td><td>{r.problem}</td><td>{r.location}</td><td>{r.mechanic}</td><td><span className={`badge ${statusClass(r.status)}`}>{r.status}</span></td></tr>)}{filtered.length === 0 && <tr><td colSpan="7" className="text-center text-muted py-4">No requests for this status.</td></tr>}</tbody></table></div>
      </div></div>
    </div>
  );
}
export default AdminRequests;
