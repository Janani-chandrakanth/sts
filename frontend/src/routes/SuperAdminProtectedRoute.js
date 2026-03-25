import { Navigate } from "react-router-dom";

export default function SuperAdminProtectedRoute({ children }) {
  const adminToken = localStorage.getItem("adminToken");
  const adminRole = localStorage.getItem("adminRole");

  if (!adminToken || adminRole !== "superadmin") {
    // If not logged in or not a superadmin, redirect to admin login
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}
