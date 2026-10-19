import { useEffect, useState } from "react";
import api from "../api/client";

function AdminHistory() {
  const [history, setHistory] = useState([]);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  useEffect(() => {
    api.get("/api/admin/history")
      .then(({ data }) => setHistory(data.content))
      .catch(() => setError("Unable to load service status history."));
  }, []);
  const filtered = history.filter((item) => [item.requestId, item.changedByName, item.toStatus].join(" ").toLowerCase().includes(search.toLowerCase()));
  return (
    <div className="p-4">
      <h2 className="fw-bold mb-1">Service History</h2>
      <p className="text-muted mb-4">Review service status changes recorded for assistance requests.</p>
      {error && <div className="alert alert-danger" role="alert">{error}</div>}
      <div className="row g-3 mb-4"><div className="col-md-6"><div className="card border-0 shadow-sm"><div className="card-body"><p className="text-muted mb-1">Recorded Events</p><h3 className="fw-bold">{history.length}</h3></div></div></div><div className="col-md-6"><div className="card border-0 shadow-sm"><div className="card-body"><p className="text-muted mb-1">Requests Represented</p><h3 className="fw-bold">{new Set(history.map((item)=>item.requestId)).size}</h3></div></div></div></div>
      <div className="card border-0 shadow-sm"><div className="card-body p-4"><input className="form-control mb-4" placeholder="Search request, actor, or status..." value={search} onChange={(e)=>setSearch(e.target.value)} />
        <div className="table-responsive"><table className="table align-middle"><thead><tr><th>Request</th><th>Previous Status</th><th>New Status</th><th>Changed By</th><th>Date</th></tr></thead><tbody>{filtered.map((item,index)=><tr key={`${item.requestId}-${index}`}><td className="fw-semibold">#{item.requestId}</td><td>{item.fromStatus || "—"}</td><td>{item.toStatus}</td><td>{item.changedByName} ({item.changedByRole})</td><td>{new Date(item.changedAt).toLocaleString("en-IN")}</td></tr>)}{filtered.length===0&&<tr><td colSpan="5" className="text-center text-muted py-4">No matching history records.</td></tr>}</tbody></table></div>
      </div></div>
    </div>
  );
}
export default AdminHistory;
