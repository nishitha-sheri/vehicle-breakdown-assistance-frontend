function Footer() {
  return (
    <footer className="bg-dark text-white mt-5">
      <div className="container py-5">
        <div className="row g-4">

          <div className="col-md-6">
            <h5 className="fw-bold">🚗 RoadAssist</h5>
            <p className="text-light opacity-75">
              A vehicle breakdown assistance platform that connects
              vehicle owners with nearby mechanics and roadside service
              providers.
            </p>
          </div>

          <div className="col-md-3">
            <h6 className="fw-bold">Quick Links</h6>
            <ul className="list-unstyled">
              <li className="mb-2">
                <a href="/" className="text-light text-decoration-none">
                  Home
                </a>
              </li>

              <li className="mb-2">
                <a href="#services" className="text-light text-decoration-none">
                  Services
                </a>
              </li>

              <li>
                <a
                  href="#how-it-works"
                  className="text-light text-decoration-none"
                >
                  How It Works
                </a>
              </li>
            </ul>
          </div>

          <div className="col-md-3">
            <h6 className="fw-bold">Assistance</h6>
            <p className="text-light opacity-75 mb-1">
              Battery
            </p>
            <p className="text-light opacity-75 mb-1">
              Tyre
            </p>
            <p className="text-light opacity-75 mb-1">
              Engine
            </p>
            <p className="text-light opacity-75">
              Fuel & Electrical
            </p>
          </div>

        </div>

        <hr className="border-secondary my-4" />

        <div className="text-center text-light opacity-75">
          <small>
            © 2026 RoadAssist. Vehicle Breakdown Assistance System.
          </small>
        </div>
      </div>
    </footer>
  );
}

export default Footer;