import axios from "axios";

/* Citizen Auth API */
const AUTH_API = "https://sts-backend-0zqu.onrender.com/api/auth";

/* Admin Auth API */
const ADMIN_API = "https://sts-backend-0zqu.onrender.com/api/admin";

/* Citizen Login (NO CHANGE) */
export const loginUser = (data) => {
  return axios.post(`${AUTH_API}/login`, data);
};

/* Citizen Register (NO CHANGE) */
export const registerUser = (data) => {
  return axios.post(`${AUTH_API}/register`, data);
};

/* Admin Login (NEW - does not affect existing functionality) */
export const loginAdmin = (data) => {
  return axios.post(`${ADMIN_API}/login`, data);
};