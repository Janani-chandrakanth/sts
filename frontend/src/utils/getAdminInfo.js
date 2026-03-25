import { jwtDecode } from "jwt-decode";

export const getAdminInfo = () => {
  const token = localStorage.getItem("adminToken");
  if (!token) return null;

  try {
    return jwtDecode(token);
  } catch {
    return null;
  }
};
