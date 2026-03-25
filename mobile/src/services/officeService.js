import api from './api';

// All offices (used for the booking flow office picker)
export const getAllOffices = async () => {
  const res = await api.get('/api/admin/offices');
  return res.data; // Array of office objects
};

// Services for a given office type (RTO / VAO / Revenue)
export const getServicesByOfficeType = async (officeType) => {
  const res = await api.get('/api/services', { params: { officeType } });
  return res.data.services; // Array of service objects
};

// Officer: Today's queue
export const getTodayQueue = async (date) => {
  const res = await api.get('/api/admin/queue', { params: { date } });
  return res.data; // Array of appointments (pending)
};

// Officer: Call next token
export const callNextToken = async (date) => {
  const res = await api.put('/api/admin/next', null, { params: { date } });
  return res.data;
};

// Officer: Complete a token
export const completeToken = async (id) => {
  const res = await api.put(`/api/admin/complete/${id}`);
  return res.data;
};
