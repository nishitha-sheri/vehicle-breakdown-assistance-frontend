
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/client";
import { useAuth } from "../auth/useAuth";

function Login() {
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((previous) => ({
      ...previous,
      [e.target.name]: e.target.value,
    }));

    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const email = formData.email.trim();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!formData.password) {
      setError("Please enter your password.");
      return;
    }

    if (!formData.role) {
      setError("Please select your account role.");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post(
        "/api/auth/login",
        {
          email,
          password: formData.password,
          role: formData.role,
        }
      );

      const user = response.data;

      const dashboardRoutes = {
        OWNER: "/owner/dashboard",
        MECHANIC: "/mechanic/dashboard",
        ADMIN: "/admin/dashboard",
      };

      const destination = dashboardRoutes[user.role];

      if (!destination) {
        setError("Invalid account role returned by the server.");
        return;
      }

      setUser(user);

      navigate(destination, { replace: true });
    } catch (err) {
      if (err.response?.status === 401) {
        setError("Incorrect email or password.");
      } else if (err.response?.status === 403) {
        setError(
          err.response.data?.detail ||
            err.response.data?.message ||
            "Your account is inactive or the selected role does not match."
        );
      } else if (err.response?.status === 400) {
        setError("Please check your login details and try again.");
      } else if (err.code === "ERR_NETWORK") {
        setError(
          "Cannot connect to the server. Make sure the backend is running."
        );
      } else {
        setError("Login failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="container">
        <div className="row justify-content-center align-items-center min-vh-75">
          <div className="col-md-6 col-lg-5">
            <div className="card border-0 shadow auth-card">
              <div className="card-body p-4 p-md-5">
                <div className="text-center mb-4">
                  <div className="auth-icon">🚗</div>
                  <h2 className="fw-bold mt-3">Welcome Back</h2>
                  <p className="text-secondary">
                    Login to your RoadAssist account
                  </p>
                </div>

                {error && (
                  <div className="alert alert-danger" role="alert">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      className="form-control form-control-lg"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={handleChange}
                      autoComplete="email"
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold">
                      Password
                    </label>
                    <input
                      type="password"
                      name="password"
                      className="form-control form-control-lg"
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={handleChange}
                      autoComplete="current-password"
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold">
                      Login As
                    </label>
                    <select
                      name="role"
                      className="form-select form-select-lg"
                      value={formData.role}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select role</option>
                      <option value="OWNER">Vehicle Owner</option>
                      <option value="MECHANIC">Mechanic</option>
                      <option value="ADMIN">Administrator</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary btn-lg w-100 mt-2"
                    disabled={loading}
                  >
                    {loading ? "Logging in..." : "Login"}
                  </button>
                </form>

                <div className="text-center mt-4">
                  <p className="mb-0 text-secondary">
                    Don't have an account?{" "}
                    <Link
                      to="/register"
                      className="text-primary text-decoration-none fw-semibold"
                    >
                      Register
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
