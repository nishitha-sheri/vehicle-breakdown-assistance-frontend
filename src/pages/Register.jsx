
import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/client";

function Register() {
  const [role, setRole] = useState("OWNER");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    specialization: "",
    serviceLocation: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((previous) => ({
      ...previous,
      [e.target.name]: e.target.value,
    }));

    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const {
      name,
      email,
      phone,
      specialization,
      serviceLocation,
      password,
      confirmPassword,
    } = formData;

    if (!name.trim()) {
      setError("Please enter your full name.");
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email.trim())) {
      setError("Please enter a valid email address.");
      return;
    }

    const normalizedPhone = phone.replace(/[\s()-]/g, "");
    const phonePattern = /^(?:\+91|91)?[6-9]\d{9}$/;

    if (!phonePattern.test(normalizedPhone)) {
      setError("Enter a valid 10-digit Indian mobile number.");
      return;
    }

    if (role === "MECHANIC") {
      if (!specialization) {
        setError("Please select your specialization.");
        return;
      }

      if (!serviceLocation.trim()) {
        setError("Please enter your service location.");
        return;
      }
    }

    if (password.length < 8) {
      setError("Password must contain at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    const requestData = {
      fullName: name.trim(),
      email: email.trim(),
      phone: normalizedPhone,
      password,
      role,
      ...(role === "MECHANIC"
        ? {
            specialization,
            serviceLocation: serviceLocation.trim(),
          }
        : {}),
    };

    try {
      setLoading(true);

      const response = await api.post("/api/auth/register", requestData);

      setSuccess(
        response.data?.message || "Account registered successfully."
      );

      setFormData({
        name: "",
        email: "",
        phone: "",
        specialization: "",
        serviceLocation: "",
        password: "",
        confirmPassword: "",
      });

      setRole("OWNER");
    } catch (err) {
      const status = err.response?.status;
      const serverMessage = err.response?.data?.detail;

      if (status === 409) {
        setError("An account with this email already exists.");
      } else if (status === 400) {
        setError(
          serverMessage ||
            "Registration details are invalid. Please check your inputs."
        );
      } else if (!err.response) {
        setError(
          "Cannot connect to the backend. Check that Spring Boot is running."
        );
      } else {
        setError(
          serverMessage ||
            "Registration failed. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="container">
        <div className="row justify-content-center align-items-center py-5">
          <div className="col-md-7 col-lg-6">
            <div className="card border-0 shadow auth-card">
              <div className="card-body p-4 p-md-5">
                <div className="text-center mb-4">
                  <div className="auth-icon">🚗</div>

                  <h2 className="fw-bold mt-3">Create Account</h2>

                  <p className="text-secondary">
                    Join RoadAssist and get roadside assistance
                  </p>
                </div>

                {error && (
                  <div className="alert alert-danger" role="alert">
                    {error}
                  </div>
                )}

                {success && (
                  <div className="alert alert-success" role="status">
                    {success}
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">
                      Account Type
                    </label>

                    <select
                      className="form-select form-select-lg"
                      value={role}
                      onChange={(e) => {
                        setRole(e.target.value);
                        setError("");
                        setSuccess("");
                      }}
                      required
                    >
                      <option value="OWNER">Vehicle Owner</option>
                      <option value="MECHANIC">
                        Mechanic / Service Provider
                      </option>
                    </select>
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold">
                      Full Name
                    </label>

                    <input
                      type="text"
                      name="name"
                      className="form-control form-control-lg"
                      placeholder="Enter your full name"
                      value={formData.name}
                      onChange={handleChange}
                      autoComplete="name"
                      maxLength={100}
                      required
                    />
                  </div>

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
                      maxLength={150}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold">
                      Phone Number
                    </label>

                    <input
                      type="tel"
                      name="phone"
                      className="form-control form-control-lg"
                      placeholder="Enter your phone number"
                      value={formData.phone}
                      onChange={handleChange}
                      autoComplete="tel"
                      maxLength={15}
                      required
                    />
                  </div>

                  {role === "MECHANIC" && (
                    <>
                      <div className="mb-3">
                        <label className="form-label fw-semibold">
                          Specialization
                        </label>

                        <select
                          name="specialization"
                          className="form-select form-select-lg"
                          value={formData.specialization}
                          onChange={handleChange}
                          required
                        >
                          <option value="">Select specialization</option>
                          <option value="GENERAL">General Mechanic</option>
                          <option value="ENGINE">Engine Specialist</option>
                          <option value="ELECTRICAL">
                            Electrical Specialist
                          </option>
                          <option value="TYRE">Tyre Specialist</option>
                          <option value="BATTERY">Battery Specialist</option>
                        </select>
                      </div>

                      <div className="mb-3">
                        <label className="form-label fw-semibold">
                          Service Location
                        </label>

                        <input
                          type="text"
                          name="serviceLocation"
                          className="form-control form-control-lg"
                          placeholder="Enter your service location"
                          value={formData.serviceLocation}
                          onChange={handleChange}
                          maxLength={255}
                          required
                        />
                      </div>
                    </>
                  )}

                  <div className="mb-3">
                    <label className="form-label fw-semibold">
                      Password
                    </label>

                    <input
                      type="password"
                      name="password"
                      className="form-control form-control-lg"
                      placeholder="Create a password (minimum 8 characters)"
                      value={formData.password}
                      onChange={handleChange}
                      autoComplete="new-password"
                      minLength={8}
                      maxLength={72}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold">
                      Confirm Password
                    </label>

                    <input
                      type="password"
                      name="confirmPassword"
                      className="form-control form-control-lg"
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      autoComplete="new-password"
                      minLength={8}
                      maxLength={72}
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary btn-lg w-100 mt-2"
                    disabled={loading}
                  >
                    {loading ? "Creating Account..." : "Create Account"}
                  </button>
                </form>

                <div className="text-center mt-4">
                  <p className="mb-0 text-secondary">
                    Already have an account?{" "}
                    <Link
                      to="/login"
                      className="text-primary text-decoration-none fw-semibold"
                    >
                      Login
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

export default Register;
