import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import OwnerDashboard from "./pages/OwnerDashboard";
import MechanicDashboard from "./pages/MechanicDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import DashboardLayout from "./components/DashboardLayout";
import MyVehicles from "./pages/MyVehicles";
import RequestAssistance from "./pages/RequestAssistance";
import MyRequests from "./pages/MyRequests";
import ServiceHistory from "./pages/ServiceHistory";
import Feedback from "./pages/Feedback";
import MechanicProfile from "./pages/MechanicProfile";

function App() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/owner/dashboard" element={<DashboardLayout role="OWNER"><OwnerDashboard /></DashboardLayout>}/>
        <Route path="/mechanic/dashboard" element={<DashboardLayout role="MECHANIC"><MechanicDashboard /></DashboardLayout>}/>
        <Route path="/admin/dashboard" element={<DashboardLayout role="ADMIN"><AdminDashboard /></DashboardLayout>}/>
        <Route path="/owner/vehicles" element={ <DashboardLayout role="OWNER"><MyVehicles /></DashboardLayout>}/>
        <Route path="/owner/request" element={<DashboardLayout role="OWNER"><RequestAssistance /></DashboardLayout>}/>
        <Route path="/owner/requests" element={<DashboardLayout role="OWNER"> <MyRequests /></DashboardLayout>}/>
        <Route path="/owner/history" element={<DashboardLayout role="OWNER"><ServiceHistory /></DashboardLayout>}/>
        <Route path="/owner/feedback" element={<DashboardLayout role="OWNER"><Feedback /> </DashboardLayout>}/>
        <Route path="/mechanic/profile" element={<DashboardLayout role="MECHANIC"><MechanicProfile /></DashboardLayout>}/>
      </Routes>

      <Footer />
    </>
  );
}

export default App;