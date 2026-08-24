import { create } from 'zustand';
import axiosClient from '../utils/axiosClient';

const useAuthStore = create((set) => ({
  user: null,
  isLoading: true,

  fetchUser: async () => {
    try {
      const { data } = await axiosClient.get('/users/get-user');
      set({ user: data.data, isLoading: false });
    } catch {
      set({ user: null, isLoading: false });
    }
  },

  login: async ({ username, email, password }) => {
    const { data } = await axiosClient.post('/users/login', { username, email, password });
    set({ user: data.data.user, isLoading: false });
    return data.data.user;
  },

  register: async (formData) => {
    const { data } = await axiosClient.post('/users/register', formData);
    return data.data;
  },

  logout: async () => {
    try {
      await axiosClient.post('/users/logout', {});
    } finally {
      set({ user: null, isLoading: false });
    }
  },
}));

export default useAuthStore;
