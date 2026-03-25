import api from './api';

// ── Citizen ──────────────────────────────────────────────
export const loginCitizen = async (email, password) => {
  const res = await api.post('/api/auth/login', { email, password });
  return res.data; // { token, role }
};

export const registerCitizen = async (userData) => {
  // userData: { name, email, password, age, priorityCategory, pincode }
  const res = await api.post('/api/auth/register', userData);
  return res.data; // { message }
};

// ── Officer ───────────────────────────────────────────────
export const loginOfficer = async (username, password) => {
  const res = await api.post('/api/admin/login', { username, password });
  return res.data; // { token, role }
};
