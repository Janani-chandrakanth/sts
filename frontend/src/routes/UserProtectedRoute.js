import { Navigate } from "react-router-dom";
import { getToken } from "../utils/authStorage";

const UserProtectedRoute = ({ children }) => {
  const token = getToken();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default UserProtectedRoute;
