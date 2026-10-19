
import { useCallback, useEffect, useState } from "react";
import api from "../api/client";

const serviceStages = [
  "Accepted",
  "On the Way",
  "In Service",
  "Completed",
];

function ActiveService() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedService, setSelectedService] = useState(null);
  const [serviceDetails, setServiceDetails] = useState("");
  const [message, setMessage] = useState("");

  const loadServices = useCallback(async () => {
    try {
      const { data } = await api.get("/api/mechanic/requests/mine");
      const labels = { ACCEPTED: "Accepted", ON_THE_WAY: "On the Way", IN_SERVICE: "In Service", COMPLETED: "Completed" };
      setServices(data.map((request) => ({
        ...request,
        vehicle: `${request.vehicleBrand} ${request.vehicleModel}`,
        problem: request.problemCategory,
        status: labels[request.status] || request.status,
      })));
      setError("");
    } catch {
      setError("Unable to load your service requests. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;
    api.get("/api/mechanic/requests/mine")
      .then(({ data }) => {
        if (!active) return;
        const labels = { ACCEPTED: "Accepted", ON_THE_WAY: "On the Way", IN_SERVICE: "In Service", COMPLETED: "Completed" };
        setServices(data.map((request) => ({ ...request, vehicle: `${request.vehicleBrand} ${request.vehicleModel}`, problem: request.problemCategory, status: labels[request.status] || request.status })));
      })
      .catch(() => { if (active) setError("Unable to load your service requests. Please try again."); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  const updateStatus = async (serviceId, newStatus, notes = null) => {
    setError("");
    const values = { "On the Way": "ON_THE_WAY", "In Service": "IN_SERVICE", Completed: "COMPLETED" };
    try {
      await api.patch(`/api/mechanic/requests/${serviceId}/status`, { status: values[newStatus], notes });
      await loadServices();
      setSelectedService(null);
      setMessage(`Request #${serviceId} updated to "${newStatus}".`);
    } catch (requestError) {
      setError(requestError.response?.status === 409
        ? "This request can no longer move to that status. Refresh and try again."
        : "Unable to update the request status. Please try again.");
    }
  };

  const handleComplete = (service) => {
    updateStatus(service.id, "Completed", serviceDetails);
    setSelectedService(null);
    setServiceDetails("");
  };

  const getNextStatus = (status) => {
    const index = serviceStages.indexOf(status);

    if (index === -1 || index === serviceStages.length - 1) {
      return null;
    }

    return serviceStages[index + 1];
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "Accepted":
        return "bg-primary";
      case "On the Way":
        return "bg-info text-dark";
      case "In Service":
        return "bg-warning text-dark";
      case "Completed":
        return "bg-success";
      default:
        return "bg-secondary";
    }
  };

  const activeServices = services.filter(
    (service) => service.status !== "Completed"
  );

  const completedServices = services.filter(
    (service) => service.status === "Completed"
  );

  return (
    <div className="p-4">
      <div className="mb-4">
        <h2 className="fw-bold mb-1">Active Service</h2>
        <p className="text-muted mb-0">
          Manage accepted breakdown requests and update service progress.
        </p>
      </div>

      {message && (
        <div className="alert alert-info alert-dismissible">
          {message}
          <button
            type="button"
            className="btn-close"
            aria-label="Close"
            onClick={() => setMessage("")}
          />
        </div>
      )}
      {error && <div className="alert alert-danger" role="alert">{error}</div>}

      <div className="row g-3 mb-4">
        <div className="col-md-6">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <p className="text-muted mb-1">Active Jobs</p>
              <h3 className="fw-bold mb-0">{activeServices.length}</h3>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <p className="text-muted mb-1">Completed Jobs</p>
              <h3 className="fw-bold mb-0">{completedServices.length}</h3>
            </div>
          </div>
        </div>
      </div>

      <div className="card border-0 shadow-sm">
        <div className="card-body p-4">
          <h5 className="fw-bold mb-4">Your Service Jobs</h5>

          {loading ? <p className="text-muted">Loading service requests…</p> : activeServices.length === 0 ? (
            <div className="text-center py-5">
              <div className="fs-1 mb-3">🔧</div>
              <h5>No active services</h5>
              <p className="text-muted mb-0">
                Accepted requests will appear here.
              </p>
            </div>
          ) : (
            <div className="row g-3">
              {activeServices.map((service) => {
                const nextStatus = getNextStatus(service.status);

                return (
                  <div className="col-12" key={service.id}>
                    <div className="border rounded-3 p-3">
                      <div className="d-flex flex-wrap justify-content-between gap-3">
                        <div>
                          <span className={`badge ${getStatusClass(service.status)} mb-2`}>
                            {service.status}
                          </span>

                          <h5 className="fw-bold mb-1">
                            Request #{service.id}
                          </h5>

                          <p className="mb-1">
                            {service.vehicle} · {service.vehicleNumber}
                          </p>

                          <p className="text-muted mb-1">
                            Problem: {service.problem}
                          </p>

                          <p className="text-muted mb-0">
                            Owner: {service.owner}
                          </p>

                          <p className="text-muted mb-0">
                            Location: {service.location}
                          </p>
                        </div>

                        <div className="d-flex flex-wrap align-items-center gap-2">
                          <button
                            className="btn btn-outline-primary"
                            onClick={() => {
                              setSelectedService(service);
                              setServiceDetails(service.serviceDetails || "");
                            }}
                          >
                            View Details
                          </button>

                          {nextStatus && nextStatus !== "Completed" && (
                            <button
                              className="btn btn-primary"
                              onClick={() => updateStatus(service.id, nextStatus)}
                            >
                              Mark {nextStatus}
                            </button>
                          )}

                          {nextStatus === "Completed" && (
                            <button
                              className="btn btn-success"
                              onClick={() => {
                                setSelectedService(service);
                                setServiceDetails(service.serviceDetails || "");
                              }}
                            >
                              Complete Service
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {selectedService && (
        <div className="card border-0 shadow-sm mt-4">
          <div className="card-body p-4">
            <h5 className="fw-bold mb-3">
              Request #{selectedService.id} Details
            </h5>

            <p>
              <strong>Description:</strong> {selectedService.description}
            </p>

            <p>
              <strong>Current status:</strong>{" "}
              <span className={`badge ${getStatusClass(selectedService.status)}`}>
                {selectedService.status}
              </span>
            </p>

            {selectedService.status === "In Service" && (
              <>
                <label className="form-label fw-semibold">
                  Service Details
                </label>

                <textarea
                  className="form-control mb-3"
                  rows="3"
                  placeholder="Describe the repair or assistance provided..."
                  value={serviceDetails}
                  onChange={(e) => setServiceDetails(e.target.value)}
                />

                <button
                  className="btn btn-success me-2"
                  onClick={() => handleComplete(selectedService)}
                >
                  Mark Completed
                </button>
              </>
            )}

            <button
              className="btn btn-outline-secondary"
              onClick={() => setSelectedService(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ActiveService;
