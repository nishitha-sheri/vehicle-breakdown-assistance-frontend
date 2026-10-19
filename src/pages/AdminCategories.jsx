
import { useEffect, useState } from "react";
import api from "../api/client";

function AdminCategories() {
  const [categories, setCategories] = useState([]);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");

  const loadCategories = async () => {
    try {
      const { data } = await api.get("/api/admin/categories");
      setCategories(data);
    } catch {
      setError("Unable to load categories. Please try again.");
    }
  };

  useEffect(() => {
    let active = true;
    api.get("/api/admin/categories")
      .then(({ data }) => { if (active) setCategories(data); })
      .catch(() => { if (active) setError("Unable to load categories. Please try again."); });
    return () => { active = false; };
  }, []);

  const addCategory = async (e) => {
    e.preventDefault();
    const cleanName = name.trim();

    try {
      await api.post("/api/admin/categories", { name: cleanName, description: description.trim() });
      setName("");
      setDescription("");
      setError("");
      await loadCategories();
    } catch (requestError) {
      setError(requestError.response?.status === 409 ? "This category already exists." : "Unable to add the category.");
    }
  };

  const toggleCategory = async (category) => {
    try {
      await api.patch(`/api/admin/categories/${category.id}/active`, { active: !category.active });
      await loadCategories();
    } catch {
      setError("Unable to update this category.");
    }
  };

  return (
    <div className="p-4">
      <h2 className="fw-bold mb-1">Breakdown Categories</h2>
      <p className="text-muted mb-4">Manage the types of roadside assistance offered.</p>

      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body p-4">
          <h5 className="fw-bold mb-3">Add Category</h5>
          {error && <div className="alert alert-danger">{error}</div>}

          <form onSubmit={addCategory}>
            <div className="row g-3">
              <div className="col-md-4">
                <label className="form-label">Category Name</label>
                <input className="form-control" value={name} onChange={(e) => setName(e.target.value)} required maxLength={20} placeholder="e.g. Towing" />
              </div>
              <div className="col-md-6">
                <label className="form-label">Description</label>
                <input className="form-control" value={description} onChange={(e) => setDescription(e.target.value)} required maxLength={150} placeholder="Describe the service category" />
              </div>
              <div className="col-md-2 d-flex align-items-end">
                <button className="btn btn-primary w-100" type="submit">Add</button>
              </div>
            </div>
          </form>
        </div>
      </div>

      <div className="card border-0 shadow-sm">
        <div className="card-body p-4">
          <h5 className="fw-bold mb-3">All Categories ({categories.length})</h5>
          <div className="table-responsive">
            <table className="table align-middle">
              <thead><tr><th>ID</th><th>Category</th><th>Description</th><th>Status</th><th>Action</th></tr></thead>
              <tbody>
                {categories.map((category) => (
                  <tr key={category.id}>
                    <td>{category.id}</td>
                    <td className="fw-semibold">{category.name}</td>
                    <td>{category.description}</td>
                    <td><span className={`badge ${category.active ? "bg-success" : "bg-secondary"}`}>{category.active ? "Active" : "Inactive"}</span></td>
                    <td>
                      <button className={`btn btn-sm ${category.active ? "btn-outline-danger" : "btn-outline-success"}`} onClick={() => toggleCategory(category)}>
                        {category.active ? "Deactivate" : "Activate"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminCategories;
