
import { useEffect, useState } from "react";
import api from "../api/client";

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");

  const loadUsers = async () => {
    try {
      const { data } = await api.get("/api/admin/users");
      setUsers(data.content.map((user) => ({ ...user, status: user.active ? "Active" : "Inactive" })));
      setError("");
    } catch {
      setError("Unable to load users. Please try again.");
    }
  };

  useEffect(() => {
    let active = true;
    api.get("/api/admin/users")
      .then(({ data }) => { if (active) setUsers(data.content.map((user) => ({ ...user, status: user.active ? "Active" : "Inactive" }))); })
      .catch(() => { if (active) setError("Unable to load users. Please try again."); });
    return () => { active = false; };
  }, []);

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");

  const toggleStatus = async (user) => {
    try {
      await api.patch(`/api/admin/users/${user.id}/active`, { active: user.status !== "Active" });
      await loadUsers();
    } catch {
      setError("Unable to update that account. An administrator cannot deactivate their own account.");
    }
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase());

    return matchesSearch &&
      (roleFilter === "ALL" || user.role === roleFilter);
  });

  return (
    <div className="p-4">
      <h2 className="fw-bold mb-1">User Management</h2>
      <p className="text-muted mb-4">View and manage registered platform users.</p>
      {error && <div className="alert alert-danger" role="alert">{error}</div>}

      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <div className="card border-0 shadow-sm"><div className="card-body">
            <p className="text-muted mb-1">Total Users</p>
            <h3 className="fw-bold">{users.length}</h3>
          </div></div>
        </div>
        <div className="col-md-4">
          <div className="card border-0 shadow-sm"><div className="card-body">
            <p className="text-muted mb-1">Active Users</p>
            <h3 className="fw-bold">{users.filter((u) => u.status === "Active").length}</h3>
          </div></div>
        </div>
        <div className="col-md-4">
          <div className="card border-0 shadow-sm"><div className="card-body">
            <p className="text-muted mb-1">Mechanics</p>
            <h3 className="fw-bold">{users.filter((u) => u.role === "MECHANIC").length}</h3>
          </div></div>
        </div>
      </div>

      <div className="card border-0 shadow-sm">
        <div className="card-body p-4">
          <div className="row g-3 mb-4">
            <div className="col-md-8">
              <input
                className="form-control"
                placeholder="Search by name or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="col-md-4">
              <select className="form-select" value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
                <option value="ALL">All Roles</option>
                <option value="OWNER">Vehicle Owners</option>
                <option value="MECHANIC">Mechanics</option>
              </select>
            </div>
          </div>

          <div className="table-responsive">
            <table className="table align-middle">
              <thead><tr><th>ID</th><th>Name</th><th>Email</th><th>Role</th><th>Status</th><th>Action</th></tr></thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td className="fw-semibold">{user.name}</td>
                    <td>{user.email}</td>
                    <td><span className="badge bg-light text-dark">{user.role}</span></td>
                    <td><span className={`badge ${user.status === "Active" ? "bg-success" : "bg-secondary"}`}>{user.status}</span></td>
                    <td>
                      <button className={`btn btn-sm ${user.status === "Active" ? "btn-outline-danger" : "btn-outline-success"}`} onClick={() => toggleStatus(user)}>
                        {user.status === "Active" ? "Deactivate" : "Activate"}
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredUsers.length === 0 && <tr><td colSpan="6" className="text-center text-muted py-4">No users found.</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminUsers;
