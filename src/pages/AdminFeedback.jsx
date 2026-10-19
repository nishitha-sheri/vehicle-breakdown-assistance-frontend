import { useEffect, useState } from "react";
import api from "../api/client";

function AdminFeedback() {
  const [feedback, setFeedback] = useState([]);
  const [ratingFilter, setRatingFilter] = useState("ALL");
  const [error, setError] = useState("");
  useEffect(() => {
    api.get("/api/admin/feedback")
      .then(({ data }) => setFeedback(data.content))
      .catch(() => setError("Unable to load feedback."));
  }, []);
  const filtered = feedback.filter((item) => ratingFilter === "ALL" || item.rating === Number(ratingFilter));
  const average = feedback.length ? feedback.reduce((sum, item) => sum + item.rating, 0) / feedback.length : 0;
  return (
    <div className="p-4">
      <h2 className="fw-bold mb-1">Customer Feedback</h2>
      <p className="text-muted mb-4">Review customer ratings and service experiences.</p>
      {error && <div className="alert alert-danger" role="alert">{error}</div>}
      <div className="row g-3 mb-4">{[{label:"Total Reviews",value:feedback.length},{label:"Average Rating",value:`${average.toFixed(1)} / 5`},{label:"Five-Star Reviews",value:feedback.filter((item)=>item.rating===5).length}].map((item)=><div className="col-md-4" key={item.label}><div className="card border-0 shadow-sm"><div className="card-body"><p className="text-muted mb-1">{item.label}</p><h3 className="fw-bold">{item.value}</h3></div></div></div>)}</div>
      <div className="card border-0 shadow-sm"><div className="card-body p-4"><div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4"><h5 className="fw-bold mb-0">Customer Reviews</h5><select className="form-select" style={{maxWidth:"200px"}} value={ratingFilter} onChange={(e)=>setRatingFilter(e.target.value)}><option value="ALL">All ratings</option>{[5,4,3,2,1].map((n)=><option value={n} key={n}>{n} stars</option>)}</select></div>
        <div className="row g-3">{filtered.map((item)=><div className="col-12" key={item.id}><div className="border rounded-3 p-3"><div className="d-flex justify-content-between"><strong>Request #{item.requestId} · {item.vehicleNumber}</strong><span>★ {item.rating}/5</span></div><p className="mb-1">{item.comment}</p><small className="text-muted">{item.mechanicName} · {new Date(item.createdAt).toLocaleDateString("en-IN")}</small></div></div>)}{filtered.length===0&&<p className="text-center text-muted py-4 mb-0">No reviews match this filter.</p>}</div>
      </div></div>
    </div>
  );
}
export default AdminFeedback;
