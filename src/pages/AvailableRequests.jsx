import { useCallback, useEffect, useRef, useState } from "react";
import api from "../api/client";

function AvailableRequests() {
  const [requests, setRequests] = useState([]);
  const [acceptedRequests, setAcceptedRequests] = useState([]);
  const [stats, setStats] = useState({ availableRequests: 0 });
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [acceptingId, setAcceptingId] = useState(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [newRequestNotice, setNewRequestNotice] = useState("");
  const seenRequestIds = useRef(null);

  const loadRequests = useCallback(async () => {
    try {
      const [available, mine, summary] = await Promise.all([
        api.get("/api/mechanic/requests"),
        api.get("/api/mechanic/requests/mine"),
        api.get("/api/mechanic/requests/stats"),
      ]);
      const nextIds = new Set(available.data.map((request) => request.id));
      if (seenRequestIds.current !== null) {
        const added = available.data.filter((request) => !seenRequestIds.current.has(request.id));
        if (added.length > 0) {
          setNewRequestNotice(`${added.length} new nearby request${added.length === 1 ? " is" : "s are"} available in your list.`);
        }
      }
      seenRequestIds.current = nextIds;
      setRequests(available.data);
      setAcceptedRequests(mine.data);
      setStats(summary.data);
      setError("");
    } catch (loadError) {
      setError(loadError.response?.data?.message || "Unable to load requests. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;
    const refresh = () => { if (active && !document.hidden) void loadRequests(); };
    refresh();
    const interval = window.setInterval(refresh, 15000);
    return () => { active = false; window.clearInterval(interval); };
  }, [loadRequests]);

  const handleAccept = async (request) => {
    if (!window.confirm(`Accept assistance request #${request.id}?`)) return;
    setAcceptingId(request.id);
    setError("");
    setMessage("");
    try {
      await api.post(`/api/mechanic/requests/${request.id}/accept`);
      setSelectedRequest(null);
      setMessage(`Request #${request.id} has been accepted.`);
      await loadRequests();
    } catch (acceptError) {
      const message = acceptError.response?.data?.message || "Unable to accept this request. Refresh and try again.";
      await loadRequests();
      setError(message);
    } finally {
      setAcceptingId(null);
    }
  };

  const statusLabel = (status) => ({
    REQUESTED: "Requested",
    ACCEPTED: "Accepted",
    ON_THE_WAY: "On the Way",
    IN_SERVICE: "In Service",
    COMPLETED: "Completed",
  }[status] || status);

  const formatDate = (value) => value
    ? new Date(value).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })
    : "—";

  const vehicleLabel = (request) =>
    [request.vehicleBrand, request.vehicleModel].filter(Boolean).join(" ") || request.vehicleType;

  return (
    <div className="p-4">
      <div className="mb-4">
        <h2 className="fw-bold mb-1">Available Requests</h2>
        <p className="text-muted mb-0">Find nearby breakdown requests and accept jobs you can handle.</p>
      </div>

      {error && <div className="alert alert-danger" role="alert">{error}</div>}
      {message && <div className="alert alert-success" role="status">{message}</div>}
      {newRequestNotice && <div className="alert alert-info" role="status">{newRequestNotice} Requests refresh every 15 seconds while this page is open.</div>}

      <div className="row g-3 mb-4">
        <div className="col-md-4"><div className="card border-0 shadow-sm"><div className="card-body">
          <p className="text-muted mb-1">Available Requests</p><h3 className="fw-bold mb-0">{stats.availableRequests ?? requests.length}</h3>
        </div></div></div>
        <div className="col-md-4"><div className="card border-0 shadow-sm"><div className="card-body">
          <p className="text-muted mb-1">Assigned to You</p><h3 className="fw-bold mb-0">{acceptedRequests.length}</h3>
        </div></div></div>
        <div className="col-md-4"><div className="card border-0 shadow-sm"><div className="card-body">
          <p className="text-muted mb-1">Request Categories</p><h3 className="fw-bold mb-0">6</h3>
        </div></div></div>
      </div>

      <div className="card border-0 shadow-sm">
        <div className="card-body p-4">
          <h5 className="fw-bold mb-1">Nearby Assistance Requests</h5>
          <p className="small text-muted mb-3">You only see active requests that match your availability, specialization, and resolved service location. New eligible requests appear automatically.</p>
          {loading ? <div className="text-center py-5">Loading requests...</div> : requests.length === 0 ? (
            <div className="text-center py-5"><div className="fs-1 mb-3">✅</div><h5>No available requests</h5>
              <p className="text-muted mb-0">New requests will appear here when available.</p></div>
          ) : (
            <div className="row g-3">
              {requests.map((request) => (
                <div className="col-12" key={request.id}><div className="border rounded-3 p-3">
                  <div className="d-flex flex-wrap justify-content-between gap-3">
                    <div>
                      <span className="badge bg-warning text-dark mb-2">{request.problemCategory}</span>
                      <h5 className="fw-bold mb-1">Request #{request.id}</h5>
                      <p className="text-muted mb-1">{vehicleLabel(request)} · {request.vehicleNumber}</p>
                      <p className="mb-1"><strong>Location:</strong> {request.location}</p>
                      {Number.isFinite(request.distanceKm) && <p className="text-muted small mb-1">About {request.distanceKm.toFixed(1)} km away</p>}
                      <p className="text-muted small mb-0">Requested {formatDate(request.requestedAt)}</p>
                    </div>
                    <div className="d-flex align-items-center gap-2">
                      <button className="btn btn-outline-primary" onClick={() => setSelectedRequest(request)}>View Details</button>
                      <button className="btn btn-primary" disabled={acceptingId !== null}
                        onClick={() => handleAccept(request)}>
                        {acceptingId === request.id ? "Accepting..." : "Accept"}
                      </button>
                    </div>
                  </div>
                </div></div>
              ))}
            </div>
          )}
        </div>
      </div>

      {selectedRequest && (
        <div className="card border-0 shadow-sm mt-4"><div className="card-body p-4">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="fw-bold mb-0">Request #{selectedRequest.id}</h5>
            <button className="btn btn-sm btn-outline-secondary" onClick={() => setSelectedRequest(null)}>Close</button>
          </div>
          <div className="row g-3">
            <div className="col-md-6"><strong>Vehicle</strong><p className="text-muted">{vehicleLabel(selectedRequest)} ({selectedRequest.vehicleNumber})</p></div>
            <div className="col-md-6"><strong>Problem Category</strong><p className="text-muted">{selectedRequest.problemCategory}</p></div>
            <div className="col-md-6"><strong>Location</strong><p className="text-muted">{selectedRequest.location}</p></div>
            <div className="col-md-6"><strong>Requested</strong><p className="text-muted">{formatDate(selectedRequest.requestedAt)}</p></div>
            <div className="col-12"><strong>Problem Description</strong><p className="text-muted">{selectedRequest.description}</p></div>
          </div>
          <button className="btn btn-primary" disabled={acceptingId !== null}
            onClick={() => handleAccept(selectedRequest)}>
            {acceptingId === selectedRequest.id ? "Accepting..." : "Accept This Request"}
          </button>
        </div></div>
      )}

      <div className="card border-0 shadow-sm mt-4"><div className="card-body p-4">
        <h5 className="fw-bold mb-3">Requests Assigned to You</h5>
        {acceptedRequests.length === 0 ? <p className="text-muted mb-0">You have no assigned requests.</p> :
          acceptedRequests.map((request) => (
            <div key={request.id} className="d-flex flex-wrap justify-content-between align-items-center border-bottom py-3 gap-2">
              <div><strong>Request #{request.id}</strong><p className="text-muted mb-0">{vehicleLabel(request)} · {request.problemCategory}</p></div>
              <span className="badge bg-primary">{statusLabel(request.status)}</span>
            </div>
          ))}
      </div></div>
    </div>
  );
}

export default AvailableRequests;
