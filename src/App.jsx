
import { Routes, Route, useLocation, Link } from "react-router-dom";

// Shared components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import DashboardLayout from "./components/DashboardLayout";

// Public pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";

// Owner pages
import OwnerDashboard from "./pages/OwnerDashboard";
import MyVehicles from "./pages/MyVehicles";
import RequestAssistance from "./pages/RequestAssistance";
import MyRequests from "./pages/MyRequests";
import ServiceHistory from "./pages/ServiceHistory";
import Feedback from "./pages/Feedback";

// Mechanic pages
import MechanicDashboard from "./pages/MechanicDashboard";
import MechanicProfile from "./pages/MechanicProfile";
import AvailableRequests from "./pages/AvailableRequests";
import ActiveService from "./pages/ActiveService";
import CompletedJobs from "./pages/CompletedJobs";
import Availability from "./pages/Availability";

// Admin pages
import AdminDashboard from "./pages/AdminDashboard";
import AdminUsers from "./pages/AdminUsers";
import AdminMechanics from "./pages/AdminMechanics";
import AdminCategories from "./pages/AdminCategories";
import AdminRequests from "./pages/AdminRequests";
import AdminHistory from "./pages/AdminHistory";
import AdminFeedback from "./pages/AdminFeedback";

function App() {
  const location = useLocation();

  const isDashboardRoute =
    location.pathname.startsWith("/owner/") ||
    location.pathname.startsWith("/mechanic/") ||
    location.pathname.startsWith("/admin/");

  return (
    <>
      {!isDashboardRoute && <Navbar />}

      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Vehicle Owner routes */}
        <Route
          path="/owner/dashboard"
          element={
            <DashboardLayout role="OWNER">
              <OwnerDashboard />
            </DashboardLayout>
          }
        />

        <Route
          path="/owner/vehicles"
          element={
            <DashboardLayout role="OWNER">
              <MyVehicles />
            </DashboardLayout>
          }
        />

        <Route
          path="/owner/request"
          element={
            <DashboardLayout role="OWNER">
              <RequestAssistance />
            </DashboardLayout>
          }
        />

        <Route
          path="/owner/requests"
          element={
            <DashboardLayout role="OWNER">
              <MyRequests />
            </DashboardLayout>
          }
        />

        <Route
          path="/owner/history"
          element={
            <DashboardLayout role="OWNER">
              <ServiceHistory />
            </DashboardLayout>
          }
        />

        <Route
          path="/owner/feedback"
          element={
            <DashboardLayout role="OWNER">
              <Feedback />
            </DashboardLayout>
          }
        />

        {/* Mechanic routes */}
        <Route
          path="/mechanic/dashboard"
          element={
            <DashboardLayout role="MECHANIC">
              <MechanicDashboard />
            </DashboardLayout>
          }
        />

        <Route
          path="/mechanic/profile"
          element={
            <DashboardLayout role="MECHANIC">
              <MechanicProfile />
            </DashboardLayout>
          }
        />

        <Route
          path="/mechanic/requests"
          element={
            <DashboardLayout role="MECHANIC">
              <AvailableRequests />
            </DashboardLayout>
          }
        />

        <Route
          path="/mechanic/active"
          element={
            <DashboardLayout role="MECHANIC">
              <ActiveService />
            </DashboardLayout>
          }
        />

        <Route
          path="/mechanic/history"
          element={
            <DashboardLayout role="MECHANIC">
              <CompletedJobs />
            </DashboardLayout>
          }
        />

        <Route
          path="/mechanic/availability"
          element={
            <DashboardLayout role="MECHANIC">
              <Availability />
            </DashboardLayout>
          }
        />

        {/* Administrator routes */}
        <Route
          path="/admin/dashboard"
          element={
            <DashboardLayout role="ADMIN">
              <AdminDashboard />
            </DashboardLayout>
          }
        />

        <Route
          path="/admin/users"
          element={
            <DashboardLayout role="ADMIN">
              <AdminUsers />
            </DashboardLayout>
          }
        />

        <Route
          path="/admin/mechanics"
          element={
            <DashboardLayout role="ADMIN">
              <AdminMechanics />
            </DashboardLayout>
          }
        />

        <Route
          path="/admin/categories"
          element={
            <DashboardLayout role="ADMIN">
              <AdminCategories />
            </DashboardLayout>
          }
        />

        <Route
          path="/admin/requests"
          element={
            <DashboardLayout role="ADMIN">
              <AdminRequests />
            </DashboardLayout>
          }
        />

        <Route
          path="/admin/history"
          element={
            <DashboardLayout role="ADMIN">
              <AdminHistory />
            </DashboardLayout>
          }
        />

        <Route
          path="/admin/feedback"
          element={
            <DashboardLayout role="ADMIN">
              <AdminFeedback />
            </DashboardLayout>
          }
        />

        {/* Invalid URL */}
        <Route
          path="*"
          element={
            <div className="container text-center py-5">
              <h1 className="display-4 fw-bold">404</h1>
              <h4>Page Not Found</h4>
              <p className="text-muted">
                The page you're looking for doesn't exist.
              </p>
              <Link to="/" className="btn btn-primary">
                Back to Home
              </Link>
            </div>
          }
        />
      </Routes>

      {!isDashboardRoute && <Footer />}
    </>
  );
}

export default App;
