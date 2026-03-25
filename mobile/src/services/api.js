import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ⚠️ IMPORTANT: Replace with your computer's local network IP address
// e.g., if your PC is on 192.168.1.5 → 'http://192.168.1.5:5000'
// You can find it by running `ipconfig` on Windows
// Do NOT use 'localhost' — Expo Go on a physical device can't reach it
export const BASE_URL = 'http://192.168.0.15:5000';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach JWT token to every request automatically
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Global error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      return Promise.reject(error.response.data);
    }
    if (error.request) {
      return Promise.reject({
        message: 'Network error – check backend is running and BASE_URL is correct',
      });
    }
    return Promise.reject(error);
  }
);

export default api;
