import { useEffect, useState } from "react";
import api from "../api/client";

function AdminMechanics() {
  const [mechanics, setMechanics] = useState([]);
  const [error, setError] = useState("");
  const load = async () => {
    try {
      const { data } = await api.get("/api/admin/mechanics");
      setMechanics(data.content);
      setError("");
    } catch {
      setError("Unable to load mechanic accounts.");
    }
  };
  useEffect(() => {
    let active = true;
    api.get("/api/admin/mechanics")
      .then(({ data }) => { if (active) setMechanics(data.content); })
      .catch(() => { if (active) setError("Unable to load mechanic accounts."); });
    return () => { active = false; };
  }, []);

  const updateActive = async (mechanic) => {
    try {
      await api.patch(`/api/admin/users/${mechanic.id}/active`, { active: !mechanic.active });
      await load();
    } catch {
      setError("Unable to update this account.");
    }
  };

  return (
    <div className="p-4">
      <h2 className="fw-bold mb-1">Mechanic Management</h2>
      <p className="text-muted mb-4">Review mechanic profiles, availability and account access.</p>
      {error && <div className="alert alert-danger" role="alert">{error}</div>}
      <div className="row g-3 mb-4">
        {[
          { label: "Total Mechanics", value: mechanics.length },
          { label: "Available", value: mechanics.filter((m) => m.availability === "AVAILABLE").length },
          { label: "Inactive", value: mechanics.filter((m) => !m.active).length },
        ].map((item) => <div className="col-md-4" key={item.label}><div className="card border-0 shadow-sm"><div className="card-body"><p className="text-muted mb-1">{item.label}</p><h3 className="fw-bold">{item.value}</h3></div></div></div>)}
      </div>
      <div className="card border-0 shadow-sm"><div className="card-body p-4"><div className="table-responsive"><table className="table align-middle">
        <thead><tr><th>ID</th><th>Mechanic</th><th>Phone</th><th>Specialization</th><th>Location</th><th>Availability</th><th>Account</th><th>Action</th></tr></thead>
        <tbody>{mechanics.map((m) => <tr key={m.id}><td>{m.id}</td><td className="fw-semibold">{m.name}</td><td>{m.phone}</td><td>{m.specialization || "—"}</td><td>{m.serviceLocation || "—"}</td><td>{m.availability || "OFFLINE"}</td><td>{m.active ? "Active" : "Inactive"}</td><td><button className={`btn btn-sm ${m.active ? "btn-outline-danger" : "btn-outline-success"}`} onClick={() => updateActive(m)}>{m.active ? "Deactivate" : "Activate"}</button></td></tr>)}
        {mechanics.length === 0 && <tr><td colSpan="8" className="text-center text-muted py-4">No mechanics found.</td></tr>}</tbody>
      </table></div></div></div>
    </div>
  );
}

export default AdminMechanics;
