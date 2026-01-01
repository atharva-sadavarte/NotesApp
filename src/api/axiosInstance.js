import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import useAuthStore from '../store/authStore';

const api = axios.create({
  baseURL: 'http://localhost:3000/api', // change if needed
  // baseURL:'http://192.168.1.34/api',
  timeout: 10000,
});
// const api = axios.create({
//   baseURL: 'http://192.168.1.34:3000/api',
//   timeout: 10000,
// });

// ---------------------------
// Request Interceptor
// Attach token automatically
// ---------------------------
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('token');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// ---------------------------
// Response Interceptor
// Auto logout on 401
// ---------------------------
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // console.log('🔴 Token invalid or expired. Logging out...');

      const logout = useAuthStore.getState().logout;
      await logout();
    }

    return Promise.reject(error);
  }
);

export default api;
