import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../api/axiosInstance';

// Keys
const TOKEN_KEY = 'token';
const USER_KEY = 'user';

const useAuthStore = create((set) => ({
  token: null,
  user: null,
  isLoading: true,

  // ---------------------------
  // Login
  // ---------------------------
  login: async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    const { token, user } = res.data;
  
    // Save token & user in AsyncStorage
    await AsyncStorage.multiSet([
      ['token', token],
      ['user', JSON.stringify(user)]
    ]);
  
    set({ token, user });
  },
  
  // ---------------------------
  // Logout
  // ---------------------------
  logout: async () => {
    await AsyncStorage.multiRemove([TOKEN_KEY, USER_KEY]);
    set({ token: null, user: null });
  },

  // ---------------------------
  // Restore auth on app start
  // ---------------------------
  restoreAuth: async () => {
    const data = await AsyncStorage.multiGet([TOKEN_KEY, USER_KEY]);

    const token = data[0][1];
    const user = data[1][1];

    set({
      token,
      user: user ? JSON.parse(user) : null,
      isLoading: false,
    });
  },
}));

export default useAuthStore;
