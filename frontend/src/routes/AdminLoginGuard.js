import { Navigate } from "react-router-dom";

export default function AdminLoginGuard({ children }) {
  const adminToken = localStorage.getItem("adminToken");
  const adminRole = localStorage.getItem("adminRole");

  if (adminToken) {
    if (adminRole === "superadmin") {
      return <Navigate to="/superadmin/dashboard" replace />;
    }
    return <Navigate to="/admin/dashboard" replace />;
  }

  return children;
}
