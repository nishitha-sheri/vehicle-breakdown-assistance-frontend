
import { useEffect, useState } from "react";
import api from "../api/client";

function RequestAssistance() {
  const [vehicles, setVehicles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingVehicles, setLoadingVehicles] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    vehicleId: "",
    problemCategory: "",
    description: "",
    location: "",
  });

  const [error, setError] = useState("");
  const [submittedRequest, setSubmittedRequest] = useState(null);

  useEffect(() => {
    let active = true;
    api.get("/api/owner/vehicles")
      .then(({ data }) => { if (active) setVehicles(data); })
      .catch(() => { if (active) setError("Unable to load your vehicles. Please try again."); })
      .finally(() => { if (active) setLoadingVehicles(false); });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    let active = true;
    api.get("/api/owner/categories")
      .then(({ data }) => { if (active) setCategories(data); })
      .catch(() => { if (active) setError("Unable to load service categories."); })
      .finally(() => { if (active) setLoadingCategories(false); });
    return () => { active = false; };
  }, []);

  const handleChange = (e) => {
    setFormData((previous) => ({
      ...previous,
      [e.target.name]: e.target.value,
    }));

    setError("");
    setSubmittedRequest(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmittedRequest(null);

    const description = formData.description.trim();
    const location = formData.location.trim();

    if (!vehicles.some((vehicle) => vehicle.id === Number(formData.vehicleId))) {
      setError("Please select a valid vehicle.");
      return;
    }

    if (!formData.problemCategory) {
      setError("Please select a problem category.");
      return;
    }

    if (description.length < 10) {
      setError("Describe the vehicle problem in at least 10 characters.");
      return;
    }

    if (location.length < 5) {
      setError("Please enter a more complete current location.");
      return;
    }

    const requestData = {
      vehicleId: Number(formData.vehicleId),
      problemCategory: formData.problemCategory,
      description,
      location,
    };

    setSubmitting(true);
    try {
      const response = await api.post("/api/owner/requests", requestData);
      setSubmittedRequest(response.data);
      setFormData({ vehicleId: "", problemCategory: "", description: "", location: "" });
    } catch (requestError) {
      setError(requestError.response?.data?.message ||
        "Unable to submit your request. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-4">
      <div className="mb-4">
        <h2 className="fw-bold mb-1">Request Assistance</h2>
        <p className="text-muted mb-0">
          Submit a breakdown request and get help from a nearby mechanic.
        </p>
      </div>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {submittedRequest && (
        <div className="alert alert-success" role="status">
          <strong>Request submitted successfully!</strong>
          <br />
          Request #{submittedRequest.id} was created with status {submittedRequest.status}.
          <br />
          The address was resolved for nearby matching.
          {submittedRequest.matchingMessage && <><br />{submittedRequest.matchingMessage}</>}
        </div>
      )}

      <div className="card border-0 shadow-sm">
        <div className="card-body p-4">
          <h5 className="fw-bold mb-4">Breakdown Details</h5>

          <form onSubmit={handleSubmit}>
            <div className="row g-4">
              <div className="col-md-6">
                <label className="form-label fw-semibold">
                  Select Vehicle
                </label>

                <select
                  name="vehicleId"
                  className="form-select"
                  value={formData.vehicleId}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select your vehicle</option>

                  {vehicles.map((vehicle) => (
                    <option key={vehicle.id} value={vehicle.id}>
                      {vehicle.vehicleNumber} - {vehicle.brand} {vehicle.model}
                    </option>
                  ))}
                </select>
                {loadingVehicles && <small className="text-muted">Loading your vehicles...</small>}
                {!loadingVehicles && vehicles.length === 0 && (
                  <small className="text-muted">Add an active vehicle before requesting assistance.</small>
                )}
              </div>

              <div className="col-md-6">
                <label className="form-label fw-semibold">
                  Problem Category
                </label>

                <select
                  name="problemCategory"
                  className="form-select"
                  value={formData.problemCategory}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select problem</option>
                  {categories.map((category) => <option key={category.id} value={category.name}>{category.name}</option>)}
                </select>
                {loadingCategories && <small className="text-muted">Loading categories...</small>}
              </div>

              <div className="col-12">
                <label className="form-label fw-semibold">
                  Problem Description
                </label>

                <textarea
                  name="description"
                  className="form-control"
                  rows="4"
                  placeholder="Describe the problem with your vehicle..."
                  value={formData.description}
                  onChange={handleChange}
                  minLength={10}
                  maxLength={1000}
                  required
                />

                <small className="text-muted">
                  Minimum 10 characters. {formData.description.trim().length}
                  /1000
                </small>
              </div>

              <div className="col-12">
                <label className="form-label fw-semibold">
                  Current Location
                </label>

                <textarea
                  name="location"
                  className="form-control"
                  rows="2"
                  placeholder="Enter your current location..."
                  value={formData.location}
                  onChange={handleChange}
                  minLength={5}
                  maxLength={300}
                  required
                />

                <small className="text-muted">
                  Enter a street or landmark, area, city, and state so RoadAssist can locate nearby mechanics.
                </small>
              </div>

              <div className="col-12"><small className="text-muted">RoadAssist sends this address to its configured geocoding service to calculate nearby matches. If the address cannot be resolved, the request will not be created. Use an address you are comfortable sharing with that service.</small></div>
              <div className="col-12"><small className="text-muted">Geocoding uses a provider configured by the service administrator. OpenStreetMap-based results are © OpenStreetMap contributors.</small></div>
            </div>

            <div className="mt-4">
              <button type="submit" className="btn btn-primary px-4" disabled={submitting || loadingVehicles || loadingCategories || vehicles.length === 0 || categories.length === 0}>
                🆘 Submit Assistance Request
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default RequestAssistance;
