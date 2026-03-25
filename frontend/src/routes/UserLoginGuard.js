import { Navigate } from "react-router-dom";

export default function UserLoginGuard({ children }) {
  const userToken = localStorage.getItem("userToken");

  if (userToken) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
