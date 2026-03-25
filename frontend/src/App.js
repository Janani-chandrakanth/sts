import { Routes, Route } from "react-router-dom";

/* PAGES */
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import UserDashboard from "./pages/UserDashboard";
import BookAppointment from "./pages/BookAppointment";
import AppointmentReceipt from "./pages/AppointmentReceipt";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import TokenDisplay from "./pages/TokenDisplay";
import MyAppointments from "./pages/MyAppointments";
import Offices from "./pages/Offices";
import Services from "./pages/Services";

/* SUPER ADMIN */
import SuperAdminDashboard from "./pages/SuperAdminDashboard";
import ManageOffices from "./pages/ManageOffices";
import CreateOffice from "./pages/CreateOffice";
import CreateOfficer from "./pages/CreateOfficer";
import ManageOfficers from "./pages/ManageOfficers";
import ManageServices from "./pages/ManageServices";
import SuperAdminLayout from "./pages/SuperAdminLayout";

/* ROUTE GUARDS */
import UserProtectedRoute from "./routes/UserProtectedRoute";
import AdminProtectedRoute from "./routes/AdminProtectedRoute";
import UserLoginGuard from "./routes/UserLoginGuard";
import AdminLoginGuard from "./routes/AdminLoginGuard";
import SuperAdminProtectedRoute from "./routes/SuperAdminProtectedRoute";

export default function App() {
  return (
    <Routes>

      {/* 🌐 PUBLIC LANDING */}
      <Route path="/" element={<Landing />} />

      {/* 👤 USER AUTH */}
      <Route
        path="/login"
        element={
          <UserLoginGuard>
            <Login />
          </UserLoginGuard>
        }
      />
      <Route path="/register" element={<Register />} />
      <Route path="/offices" element={<Offices />} />
      <Route path="/services" element={<Services />} />

      {/* 👤 USER PAGES */}
      <Route
        path="/dashboard"
        element={
          <UserProtectedRoute>
            <UserDashboard />
          </UserProtectedRoute>
        }
      />

      <Route
        path="/book"
        element={
          <UserProtectedRoute>
            <BookAppointment />
          </UserProtectedRoute>
        }
      />

      <Route
        path="/appointment-receipt"
        element={
          <UserProtectedRoute>
            <AppointmentReceipt />
          </UserProtectedRoute>
        }
      />

      <Route
        path="/my-appointments"
        element={
          <UserProtectedRoute>
            <MyAppointments />
          </UserProtectedRoute>
        }
      />

      {/* 🧑‍💼 ADMIN AUTH */}
      <Route
        path="/admin/login"
        element={
          <AdminLoginGuard>
            <AdminLogin />
          </AdminLoginGuard>
        }
      />

      {/* 🧑‍💼 ADMIN DASHBOARD */}
      <Route
        path="/admin/dashboard"
        element={
          <AdminProtectedRoute>
            <AdminDashboard />
          </AdminProtectedRoute>
        }
      />

      {/* 📺 TOKEN DISPLAY */}
      <Route path="/token-display" element={<TokenDisplay />} />

      {/* 👑 SUPER ADMIN SYSTEM */}
      <Route
        path="/superadmin"
        element={
          <SuperAdminProtectedRoute>
            <SuperAdminLayout />
          </SuperAdminProtectedRoute>
        }
      >
        <Route path="dashboard" element={<SuperAdminDashboard />} />
        <Route path="offices" element={<ManageOffices />} />
        <Route path="create-office" element={<CreateOffice />} />
        <Route path="services" element={<ManageServices />} />
        <Route path="officers" element={<ManageOfficers />} />
        <Route path="create-officer" element={<CreateOfficer />} />
      </Route>

    </Routes>
  );
}