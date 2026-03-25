import api from './api';

// --- Dashboard Stats ---
export const getDashboardStats = async () => {
  const res = await api.get('/api/superadmin/dashboard');
  return res.data;
};

// --- Live Token Monitoring ---
export const getLiveTokens = async () => {
  const res = await api.get('/api/superadmin/live-tokens');
  return res.data;
};

// --- Office Management ---
export const getOffices = async () => {
  const res = await api.get('/api/superadmin/offices');
  return res.data;
};

export const createOffice = async (officeData) => {
  const res = await api.post('/api/superadmin/offices', officeData);
  return res.data;
};

export const deleteOffice = async (id) => {
  const res = await api.delete(`/api/superadmin/offices/${id}`);
  return res.data;
};

// --- Officer Management ---
export const getOfficers = async () => {
  const res = await api.get('/api/superadmin/officers');
  return res.data;
};

export const addOfficer = async (officerData) => {
  const res = await api.post('/api/superadmin/officers', officerData);
  return res.data;
};

export const deleteOfficer = async (id) => {
  const res = await api.delete(`/api/superadmin/officers/${id}`);
  return res.data;
};

// --- Service Management ---
export const getServices = async () => {
  const res = await api.get('/api/superadmin/services');
  return res.data;
};

export const createService = async (serviceData) => {
  const res = await api.post('/api/superadmin/services', serviceData);
  return res.data;
};

export const deleteService = async (id) => {
  const res = await api.delete(`/api/superadmin/services/${id}`);
  return res.data;
};
