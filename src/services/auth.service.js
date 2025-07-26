import { AUTH_ENDPOINTS, createApiRequest } from '../config/api';

export const authService = {
  login: async (email, password) => {
    return createApiRequest(AUTH_ENDPOINTS.LOGIN, {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  register: async (userData) => {
    return createApiRequest(AUTH_ENDPOINTS.REGISTER, {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  logout: async () => {
    return createApiRequest(AUTH_ENDPOINTS.LOGOUT, {
      method: 'POST',
    });
  },

  updateProfile: async (userData) => {
    return createApiRequest(AUTH_ENDPOINTS.PROFILE, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  },

  getProfile: async () => {
    return createApiRequest(AUTH_ENDPOINTS.PROFILE);
  },
}; 