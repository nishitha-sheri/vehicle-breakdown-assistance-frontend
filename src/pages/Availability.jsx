
import { useEffect, useState } from "react";
import api from "../api/client";

function Availability() {
  const [availability, setAvailability] = useState("OFFLINE");
  const [savedAvailability, setSavedAvailability] = useState("OFFLINE");
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    api.get("/api/mechanic/availability")
      .then(({ data }) => {
        if (active) {
          setAvailability(data.availability);
          setSavedAvailability(data.availability);
        }
      })
      .catch(() => {
        if (active) setError("Could not load your saved availability. Please try again.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, []);

  const options = [
    {
      value: "AVAILABLE",
      title: "Available",
      description: "You can receive new breakdown requests.",
      icon: "🟢",
      color: "success",
    },
    {
      value: "BUSY",
      title: "Busy",
      description: "You are occupied with a service job.",
      icon: "🟡",
      color: "warning",
    },
    {
      value: "OFFLINE",
      title: "Offline",
      description: "You will not receive new requests.",
      icon: "🔴",
      color: "secondary",
    },
  ];

  const handleSave = async () => {
    setSaving(true);
    setError("");
    setSaved(false);
    try {
      const { data } = await api.put("/api/mechanic/availability", { availability });
      setAvailability(data.availability);
      setSavedAvailability(data.availability);
      setSaved(true);
    } catch (requestError) {
      setError(requestError.response?.status === 401
        ? "Your session expired. Sign in again to update availability."
        : "Could not save availability. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const selectedOption = options.find((option) => option.value === availability) || options[2];
  const currentOption = options.find((option) => option.value === savedAvailability) || options[2];

  return (
    <div className="p-4">
      <div className="mb-4">
        <h2 className="fw-bold mb-1">Availability</h2>
        <p className="text-muted mb-0">
          Control whether you are available to accept roadside assistance jobs.
        </p>
      </div>

      {error && <div className="alert alert-danger" role="alert">{error}</div>}
      {loading && <div className="text-muted mb-3" role="status">Loading availability…</div>}

      {saved && (
        <div className="alert alert-success">
          Availability updated to{" "}
          <strong>{selectedOption.title}</strong>.
          <button
            type="button"
            className="btn-close float-end"
            aria-label="Close"
            onClick={() => setSaved(false)}
          />
        </div>
      )}

      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body p-4">
          <h5 className="fw-bold mb-3">Your Current Status</h5>

          <div className="d-flex align-items-center gap-3">
              <span style={{ fontSize: "36px" }}>
              {currentOption.icon}
            </span>

            <div>
              <h4 className="fw-bold mb-1">
                {currentOption.title}
              </h4>

              <p className="text-muted mb-0">
                {currentOption.description}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="card border-0 shadow-sm">
        <div className="card-body p-4">
          <h5 className="fw-bold mb-3">
            Change Availability
          </h5>

          <div className="row g-3">
            {options.map((option) => (
              <div className="col-md-4" key={option.value}>
                <button
                  type="button"
                  className={`card w-100 h-100 text-start ${
                    availability === option.value
                      ? `border-${option.color} border-2`
                      : "border"
                  }`}
                  onClick={() => {
                    setAvailability(option.value);
                    setSaved(false);
                  }}
                  disabled={loading || saving}
                  aria-pressed={availability === option.value}
                >
                  <div className="card-body p-4">
                    <div className="fs-2 mb-3">
                      {option.icon}
                    </div>

                    <h5 className="fw-bold">
                      {option.title}
                    </h5>

                    <p className="text-muted small mb-3">
                      {option.description}
                    </p>

                    {availability === option.value && (
                      <span className="badge bg-primary">
                        Selected
                      </span>
                    )}
                  </div>
                </button>
              </div>
            ))}
          </div>

          <button
            type="button"
            className="btn btn-primary mt-4 px-4"
            onClick={handleSave}
            disabled={loading || saving || availability === savedAvailability}
          >
            {saving ? "Saving…" : "Save Availability"}
          </button>
        </div>
      </div>

      <div className="card border-0 shadow-sm mt-4">
        <div className="card-body p-4">
          <h5 className="fw-bold mb-2">Important</h5>

          <ul className="text-muted mb-0">
            <li>Available: eligible to receive new requests.</li>
            <li>Busy: indicates you are occupied with a job.</li>
            <li>Offline: indicates you are not accepting new requests.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Availability;
