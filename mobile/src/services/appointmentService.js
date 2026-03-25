import api from './api';

// Available date slots for an office (next 14 days, no Sundays)
export const getAvailableDates = async (officeId) => {
  const res = await api.get(`/api/appointments/available-dates/${officeId}`);
  return res.data; // [{ date: 'YYYY-MM-DD', availableTokens: N }]
};

// Time slots for a specific date/office
export const getTimeSlots = async (officeId, date) => {
  const res = await api.get('/api/appointments/time-slots', {
    params: { officeId, date },
  });
  return res.data; // ['10:00 - 10:20', '10:20 - 10:40', ...]
};

// Book an appointment
// payload: { officeId, service, date, timeSlot, priorityCategory }
export const bookAppointment = async (payload) => {
  const res = await api.post('/api/appointments/book', payload);
  return res.data; // { message, appointment: { tokenNumber, counterNumber, ... } }
};

// Get logged-in citizen's appointments
export const getMyAppointments = async () => {
  const res = await api.get('/api/appointments/my');
  return res.data; // Array of appointments
};

// Cancel a pending appointment
export const cancelAppointment = async (id) => {
  const res = await api.put(`/api/appointments/cancel/${id}`);
  return res.data;
};
