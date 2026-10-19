import { useEffect, useState } from "react";
import api from "../api/client";

function ServiceHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    api.get("/api/owner/requests/history")
      .then(({ data }) => setHistory(data))
      .catch(() => setError("Unable to load your completed service history."))
      .finally(() => setLoading(false));
  }, []);
  return (
    <div className="p-4"><h2 className="fw-bold mb-1">Service History</h2><p className="text-muted mb-4">Review completed roadside assistance services.</p>
      {error && <div className="alert alert-danger" role="alert">{error}</div>}
      <div className="row g-3 mb-4"><div className="col-md-6"><div className="card border-0 shadow-sm"><div className="card-body"><p className="text-muted mb-1">Completed Services</p><h3 className="fw-bold">{history.length}</h3></div></div></div><div className="col-md-6"><div className="card border-0 shadow-sm"><div className="card-body"><p className="text-muted mb-1">Different Problem Types</p><h3 className="fw-bold">{new Set(history.map((item)=>item.problemCategory)).size}</h3></div></div></div></div>
      <div className="card border-0 shadow-sm"><div className="card-body p-4">{loading ? <p className="text-muted">Loading service history...</p> : history.length === 0 ? <p className="text-center text-muted py-4">Completed services will appear here.</p> : <div className="table-responsive"><table className="table align-middle"><thead><tr><th>Request</th><th>Vehicle</th><th>Problem</th><th>Mechanic</th><th>Service Details</th><th>Completed</th></tr></thead><tbody>{history.map((item)=><tr key={item.requestId}><td>#{item.requestId}</td><td>{item.vehicleNumber}</td><td>{item.problemCategory}</td><td>{item.mechanicName || "—"}</td><td>{item.serviceDetails}</td><td>{new Date(item.completedAt).toLocaleDateString("en-IN")}</td></tr>)}</tbody></table></div>}</div></div>
    </div>
  );
}
export default ServiceHistory;
