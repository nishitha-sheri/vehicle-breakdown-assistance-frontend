
import { useCallback, useEffect, useState } from "react";
import api from "../api/client";

function MyVehicles() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    vehicleNumber: "",
    vehicleType: "Car",
    brand: "",
    model: "",
  });

  const loadVehicles = useCallback(async () => {
    try {
      const response = await api.get("/api/owner/vehicles");
      setVehicles(response.data);
      setError("");
    } catch {
      setError("Unable to load your vehicles. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;
    api.get("/api/owner/vehicles")
      .then(({ data }) => { if (active) setVehicles(data); })
      .catch(() => { if (active) setError("Unable to load your vehicles. Please try again."); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  const handleChange = (e) => {
    setFormData((previous) => ({
      ...previous,
      [e.target.name]: e.target.value,
    }));
    setError("");
  };

  const resetForm = () => {
    setFormData({
      vehicleNumber: "",
      vehicleType: "Car",
      brand: "",
      model: "",
    });
    setEditingId(null);
    setShowForm(false);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const vehicleNumber = formData.vehicleNumber
      .trim()
      .replace(/\s+/g, "")
      .toUpperCase();

    const brand = formData.brand.trim();
    const model = formData.model.trim();

    if (!vehicleNumber || !brand || !model) {
      setError("Please complete all vehicle details.");
      return;
    }

    // Allow common Indian registration formats, e.g. TS09AB1234.
    const vehicleNumberPattern =
      /^[A-Z]{2}\d{1,2}[A-Z]{0,3}\d{1,4}$/;

    if (!vehicleNumberPattern.test(vehicleNumber)) {
      setError(
        "Enter a valid vehicle registration number, e.g. TS09AB1234."
      );
      return;
    }

    const cleanedData = {
      vehicleNumber,
      vehicleType: formData.vehicleType,
      brand,
      model,
    };

    setSaving(true);
    try {
      if (editingId !== null) {
        await api.put(`/api/owner/vehicles/${editingId}`, cleanedData);
      } else {
        await api.post("/api/owner/vehicles", cleanedData);
      }
      resetForm();
      await loadVehicles();
    } catch (requestError) {
      setError(requestError.response?.data?.detail ||
        requestError.response?.data?.message ||
        "Unable to save this vehicle. Please check the details and try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (vehicle) => {
    setEditingId(vehicle.id);
    setFormData({
      vehicleNumber: vehicle.vehicleNumber,
      vehicleType: vehicle.vehicleType,
      brand: vehicle.brand,
      model: vehicle.model,
    });
    setError("");
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this vehicle?")) {
      try {
        await api.delete(`/api/owner/vehicles/${id}`);
        await loadVehicles();
        if (editingId === id) resetForm();
      } catch {
        setError("Unable to delete this vehicle. Please try again.");
      }
    }
  };

  return (
    <div className="p-4">
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
        <div>
          <h2 className="fw-bold mb-1">My Vehicles</h2>
          <p className="text-muted mb-0">
            Manage the vehicles registered to your account.
          </p>
        </div>

        <button
          type="button"
          className="btn btn-primary"
          onClick={() => (showForm ? resetForm() : setShowForm(true))}
        >
          {showForm ? "✕ Close" : "+ Add Vehicle"}
        </button>
      </div>

      {showForm && (
        <div className="card border-0 shadow-sm mb-4">
          <div className="card-body p-4">
            <h5 className="fw-bold mb-4">
              {editingId !== null ? "Edit Vehicle" : "Add New Vehicle"}
            </h5>

            {error && (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label fw-semibold">
                    Vehicle Number
                  </label>
                  <input
                    type="text"
                    name="vehicleNumber"
                    className="form-control"
                    placeholder="e.g. TS09AB1234"
                    value={formData.vehicleNumber}
                    onChange={handleChange}
                    maxLength={15}
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-semibold">
                    Vehicle Type
                  </label>
                  <select
                    name="vehicleType"
                    className="form-select"
                    value={formData.vehicleType}
                    onChange={handleChange}
                    required
                  >
                    <option value="Car">Car</option>
                    <option value="Bike">Bike</option>
                    <option value="Scooter">Scooter</option>
                    <option value="Truck">Truck</option>
                    <option value="Bus">Bus</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-semibold">Brand</label>
                  <input
                    type="text"
                    name="brand"
                    className="form-control"
                    placeholder="e.g. Hyundai"
                    value={formData.brand}
                    onChange={handleChange}
                    maxLength={50}
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-semibold">Model</label>
                  <input
                    type="text"
                    name="model"
                    className="form-control"
                    placeholder="e.g. Creta"
                    value={formData.model}
                    onChange={handleChange}
                    maxLength={50}
                    required
                  />
                </div>
              </div>

              <div className="mt-4">
                <button type="submit" className="btn btn-primary px-4 me-2" disabled={saving}>
                  {saving ? "Saving..." : editingId !== null ? "Update Vehicle" : "Save Vehicle"}
                </button>

                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={resetForm}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="card border-0 shadow-sm">
        <div className="card-body p-4">
          <h5 className="fw-bold mb-4">Registered Vehicles</h5>

          {error && !showForm && <div className="alert alert-danger" role="alert">{error}</div>}

          {loading ? (
            <div className="text-center py-5">Loading vehicles...</div>
          ) : vehicles.length === 0 ? (
            <div className="text-center py-5">
              <div className="fs-1 mb-3">🚗</div>
              <h5>No vehicles added yet</h5>
              <p className="text-muted">
                Add your vehicle to request roadside assistance.
              </p>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => setShowForm(true)}
              >
                + Add Vehicle
              </button>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table align-middle">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Vehicle Number</th>
                    <th>Type</th>
                    <th>Brand</th>
                    <th>Model</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {vehicles.map((vehicle, index) => (
                    <tr key={vehicle.id}>
                      <td>{index + 1}</td>
                      <td className="fw-semibold">{vehicle.vehicleNumber}</td>
                      <td>
                        <span className="badge bg-light text-dark">
                          {vehicle.vehicleType}
                        </span>
                      </td>
                      <td>{vehicle.brand}</td>
                      <td>{vehicle.model}</td>
                      <td>
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-primary me-2"
                          onClick={() => handleEdit(vehicle)}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleDelete(vehicle.id)}
                        >
                          Delete
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
    </div>
  );
}

export default MyVehicles;
