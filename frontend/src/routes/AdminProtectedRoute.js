import { Navigate } from "react-router-dom";

export default function AdminProtectedRoute({ children }) {
  const adminToken = localStorage.getItem("adminToken");
  const adminRole = localStorage.getItem("adminRole");

  if (!adminToken) {
    return <Navigate to="/admin/login" replace />;
  }

  // If superadmin accidentally hits an officer route, send them to superadmin dashboard
  if (adminRole === "superadmin") {
    return <Navigate to="/superadmin/dashboard" replace />;
  }

  return children;
}
