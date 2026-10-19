import { useEffect, useRef, useState } from "react";
import api from "../api/client";

function MyRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [history, setHistory] = useState([]);
  const [historyError, setHistoryError] = useState("");
  const [statusNotice, setStatusNotice] = useState("");
  const previousStatuses = useRef(null);

  const statusLabel = (status) => ({
    REQUESTED: "Requested",
    ACCEPTED: "Accepted",
    ON_THE_WAY: "On the Way",
    IN_SERVICE: "In Service",
    COMPLETED: "Completed",
  }[status] || status);

  useEffect(() => {
    let active = true;
    const refresh = async () => {
      if (!active || document.hidden) return;
      try {
        const { data } = await api.get("/api/owner/requests");
        if (!active) return;
        const nextStatuses = new Map(data.map((request) => [request.id, request.status]));
        if (previousStatuses.current !== null) {
          const changed = data.filter((request) => previousStatuses.current.get(request.id)
            && previousStatuses.current.get(request.id) !== request.status);
          if (changed.length > 0) {
            setStatusNotice(changed.map((request) => `Request #${request.id}: ${statusLabel(request.status)}`).join(" · "));
          }
        }
        previousStatuses.current = nextStatuses;
        setRequests(data);
        setError("");
      } catch {
        if (active) setError("Unable to refresh your assistance requests. Please try again.");
      } finally {
        if (active) setLoading(false);
      }
    };
    void refresh();
    const interval = window.setInterval(() => { void refresh(); }, 15000);
    return () => { active = false; window.clearInterval(interval); };
  }, []);

  const formatDate = (value) => value
    ? new Date(value).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })
    : "—";

  const openRequest = async (request) => {
    setSelectedRequest(request);
    setHistory([]);
    setHistoryError("");
    try {
      const response = await api.get(`/api/owner/requests/${request.id}/history`);
      setHistory(response.data);
    } catch {
      setHistoryError("Unable to load request history.");
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "Requested":
      case "REQUESTED":
        return "bg-warning text-dark";

      case "Accepted":
      case "ACCEPTED":
        return "bg-primary";

      case "On the Way":
      case "ON_THE_WAY":
        return "bg-info text-dark";

      case "In Service":
      case "IN_SERVICE":
        return "bg-secondary";

      case "Completed":
      case "COMPLETED":
        return "bg-success";

      default:
        return "bg-light text-dark";
    }
  };

  return (
    <div className="p-4">

      {/* Header */}
      <div className="mb-4">
        <h2 className="fw-bold mb-1">
          My Requests
        </h2>

        <p className="text-muted mb-0">
          Track your vehicle assistance requests.
        </p>
      </div>

      {/* Requests */}
      <div className="card border-0 shadow-sm">

        <div className="card-body p-4">

          <h5 className="fw-bold mb-4">
            Assistance Requests
          </h5>

          {error && <div className="alert alert-danger" role="alert">{error}</div>}
          {statusNotice && <div className="alert alert-info" role="status" aria-live="polite">Request update: {statusNotice}</div>}

          {loading ? (
            <div className="text-center py-5">Loading requests...</div>
          ) : requests.length === 0 ? (

            <div className="text-center py-5">

              <div className="fs-1 mb-3">
                📋
              </div>

              <h5>No assistance requests</h5>

              <p className="text-muted">
                Your submitted requests will appear here.
              </p>

            </div>

          ) : (

            <div className="table-responsive">

              <table className="table align-middle">

                <thead>
                  <tr>
                    <th>Request ID</th>
                    <th>Vehicle</th>
                    <th>Problem</th>
                    <th>Location</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>

                  {requests.map((request) => (

                    <tr key={request.id}>

                      <td className="fw-semibold">
                        #{request.id}
                      </td>

                      <td>
                        {request.vehicleNumber}
                      </td>

                      <td>
                        {request.problemCategory}
                      </td>

                      <td>
                        {request.location}
                      </td>

                      <td>
                        {formatDate(request.requestedAt)}
                      </td>

                      <td>
                        <span
                          className={`badge ${getStatusClass(
                            request.status
                          )}`}
                        >
                          {statusLabel(request.status)}
                        </span>
                      </td>

                      <td>
                        <button
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => openRequest(request)}
                        >
                          View
                        </button>
                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          )}

        </div>

      </div>

      {/* Request Details */}
      {selectedRequest && (
        <div className="card border-0 shadow-sm mt-4">

          <div className="card-body p-4">

            <div className="d-flex justify-content-between align-items-center mb-4">

              <h5 className="fw-bold mb-0">
                Request #{selectedRequest.id}
              </h5>

              <button
                className="btn btn-sm btn-outline-secondary"
                onClick={() => setSelectedRequest(null)}
              >
                Close
              </button>

            </div>

            <div className="row g-3">

              <div className="col-md-6">
                <strong>Vehicle</strong>
                <p className="text-muted mb-0">
                  {selectedRequest.vehicleNumber}
                </p>
              </div>

              <div className="col-md-6">
                <strong>Problem</strong>
                <p className="text-muted mb-0">
                  {selectedRequest.problemCategory}
                </p>
              </div>

              <div className="col-md-6">
                <strong>Location</strong>
                <p className="text-muted mb-0">
                  {selectedRequest.location}
                </p>
              </div>

              <div className="col-md-6">
                <strong>Date</strong>
                <p className="text-muted mb-0">
                  {formatDate(selectedRequest.requestedAt)}
                </p>
              </div>

              <div className="col-12">
                <strong>Description</strong>
                <p className="text-muted mb-0">
                  {selectedRequest.description}
                </p>
              </div>

              <div className="col-12">
                <strong>Current Status</strong>

                <div className="mt-2">
                  <span
                    className={`badge ${getStatusClass(
                      selectedRequest.status
                    )}`}
                  >
                    {statusLabel(selectedRequest.status)}
                  </span>
                </div>
              </div>

              {selectedRequest.status === "REQUESTED" && selectedRequest.matchingMessage && (
                <div className="col-12">
                  <div className={`alert ${selectedRequest.matchingStatus === "NO_ELIGIBLE_MECHANIC" || selectedRequest.matchingStatus === "LOCATION_REQUIRED" ? "alert-warning" : "alert-info"} mb-0`} role="status">
                    {selectedRequest.matchingMessage}
                  </div>
                </div>
              )}

              <div className="col-12">
                <strong>Status History</strong>
                {historyError && <p className="text-danger mb-1">{historyError}</p>}
                {history.length === 0 && !historyError
                  ? <p className="text-muted mb-0">Loading or no history is available.</p>
                  : <ul className="list-group list-group-flush mt-2">
                    {history.map((entry, index) => (
                      <li className="list-group-item px-0" key={`${entry.toStatus}-${index}`}>
                        <span className="fw-semibold">{statusLabel(entry.toStatus)}</span>
                        <span className="text-muted"> · {entry.changedByRole === "MECHANIC" ? entry.changedByName : "RoadAssist"} · {formatDate(entry.changedAt)}</span>
                      </li>
                    ))}
                  </ul>}
              </div>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}

export default MyRequests;
