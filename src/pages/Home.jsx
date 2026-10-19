import { Link } from "react-router-dom";

function Home() {
  return (
    <div>
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="row align-items-center min-vh-75">

            <div className="col-lg-7">
              <span className="badge bg-primary-subtle text-primary mb-3 px-3 py-2">
                24/7 Roadside Assistance
              </span>

              <h1 className="display-4 fw-bold mb-4">
                Get Help When Your Vehicle Needs It Most
              </h1>

              <p className="lead text-secondary mb-4">
                Connect with nearby mechanics and roadside service providers
                when your vehicle breaks down.
              </p>

              <div className="d-flex gap-3 flex-wrap">
                <Link to="/register" className="btn btn-primary btn-lg px-4">
                  Request Assistance
                </Link>

                <a
                  href="#how-it-works"
                  className="btn btn-outline-dark btn-lg px-4"
                >
                  How It Works
                </a>
              </div>
            </div>

            <div className="col-lg-5 mt-5 mt-lg-0">
              <div className="hero-card shadow">
                <div className="display-1 text-center mb-3">
                  🚗
                </div>

                <h3 className="text-center">
                  Vehicle Breakdown?
                </h3>

                <p className="text-center text-secondary">
                  Report your problem and find available assistance near you.
                </p>

                <div className="d-flex justify-content-around text-center mt-4">
                  <div>
                    <h4 className="fw-bold">Fast</h4>
                    <small className="text-secondary">
                      Assistance
                    </small>
                  </div>

                  <div>
                    <h4 className="fw-bold">Nearby</h4>
                    <small className="text-secondary">
                      Mechanics
                    </small>
                  </div>

                  <div>
                    <h4 className="fw-bold">Easy</h4>
                    <small className="text-secondary">
                      Tracking
                    </small>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-5 bg-white">
        <div className="container">

          <div className="text-center mb-5">
            <h2 className="fw-bold">Our Services</h2>
            <p className="text-secondary">
              Get assistance for common vehicle breakdown problems.
            </p>
          </div>

          <div className="row g-4">

            <ServiceCard
              icon="🔋"
              title="Battery Assistance"
              description="Get help with dead or weak vehicle batteries."
            />

            <ServiceCard
              icon="🛞"
              title="Tyre Assistance"
              description="Get roadside help for flat or damaged tyres."
            />

            <ServiceCard
              icon="🔧"
              title="Engine Problems"
              description="Connect with mechanics for engine-related issues."
            />

            <ServiceCard
              icon="⛽"
              title="Fuel Assistance"
              description="Get help when your vehicle runs out of fuel."
            />

            <ServiceCard
              icon="⚡"
              title="Electrical Problems"
              description="Find assistance for common electrical issues."
            />

            <ServiceCard
              icon="🆘"
              title="Other Assistance"
              description="Report other vehicle problems and request help."
            />

          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-5">
        <div className="container">

          <div className="text-center mb-5">
            <h2 className="fw-bold">How It Works</h2>
            <p className="text-secondary">
              Getting roadside assistance is simple.
            </p>
          </div>

          <div className="row g-4">

            <StepCard
              number="1"
              title="Report Breakdown"
              description="Select your vehicle, problem category and provide your location."
            />

            <StepCard
              number="2"
              title="Find Assistance"
              description="The system identifies suitable nearby available mechanics."
            />

            <StepCard
              number="3"
              title="Track Service"
              description="Track your request as the mechanic accepts and handles the service."
            />

            <StepCard
              number="4"
              title="Complete & Rate"
              description="After assistance is completed, view the service history and provide feedback."
            />

          </div>
        </div>
      </section>
    </div>
  );
}

function ServiceCard({ icon, title, description }) {
  return (
    <div className="col-md-6 col-lg-4">
      <div className="card service-card h-100 border-0 shadow-sm">
        <div className="card-body p-4">
          <div className="service-icon mb-3">
            {icon}
          </div>

          <h5 className="fw-bold">{title}</h5>

          <p className="text-secondary mb-0">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}

function StepCard({ number, title, description }) {
  return (
    <div className="col-md-6 col-lg-3">
      <div className="text-center">

        <div className="step-number mx-auto mb-3">
          {number}
        </div>

        <h5 className="fw-bold">{title}</h5>

        <p className="text-secondary">
          {description}
        </p>

      </div>
    </div>
  );
}

export default Home;