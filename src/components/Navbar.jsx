import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg bg-white shadow-sm">
      <div className="container">

        <Link className="navbar-brand fw-bold" to="/">
          🚗 RoadAssist
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#mainNavbar"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="mainNavbar">

          <ul className="navbar-nav ms-auto align-items-lg-center">

            <li className="nav-item">
              <Link className="nav-link" to="/">
                Home
              </Link>
            </li>

            <li className="nav-item">
              <a className="nav-link" href="#services">
                Services
              </a>
            </li>

            <li className="nav-item">
              <a className="nav-link" href="#how-it-works">
                How It Works
              </a>
            </li>

            <li className="nav-item ms-lg-3">
              <Link className="btn btn-outline-primary px-4" to="/login">
                Login
              </Link>
            </li>

            <li className="nav-item ms-lg-2 mt-2 mt-lg-0">
              <Link className="btn btn-primary px-4" to="/register">
                Register
              </Link>
            </li>

          </ul>

        </div>
      </div>
    </nav>
  );
}

export default Navbar;