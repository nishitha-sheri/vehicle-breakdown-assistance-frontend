import { useEffect, useState } from "react";
import api from "../api/client";

function CompletedJobs() {
  const [jobs, setJobs] = useState([]);
  const [error, setError] = useState("");
  useEffect(() => {
    api.get("/api/mechanic/requests/mine")
      .then(({ data }) => setJobs(data.filter((job) => job.status === "COMPLETED")))
      .catch(() => setError("Unable to load completed jobs."));
  }, []);
  return (
    <div className="p-4"><div className="mb-4"><h2 className="fw-bold mb-1">Completed Jobs</h2><p className="text-muted mb-0">Review your completed assistance requests.</p></div>
      {error && <div className="alert alert-danger" role="alert">{error}</div>}
      <div className="row g-3 mb-4"><div className="col-md-4"><div className="card border-0 shadow-sm"><div className="card-body"><p className="text-muted mb-1">Completed Jobs</p><h3 className="fw-bold mb-0">{jobs.length}</h3></div></div></div></div>
      <div className="card border-0 shadow-sm"><div className="card-body p-4"><div className="table-responsive"><table className="table align-middle"><thead><tr><th>Request</th><th>Vehicle</th><th>Problem</th><th>Location</th><th>Service Details</th><th>Status</th></tr></thead><tbody>{jobs.map((job)=><tr key={job.id}><td>#{job.id}</td><td>{job.vehicleBrand} {job.vehicleModel} · {job.vehicleNumber}</td><td>{job.problemCategory}</td><td>{job.location}</td><td>{job.serviceDetails || "—"}</td><td><span className="badge bg-success">Completed</span></td></tr>)}{jobs.length===0&&<tr><td colSpan="6" className="text-center text-muted py-4">Completed jobs will appear here.</td></tr>}</tbody></table></div></div></div>
    </div>
  );
}
export default CompletedJobs;
