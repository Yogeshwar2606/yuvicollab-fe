const API_URL = import.meta.env.VITE_API_URL; 

// API Endpoints
export const AUTH_ENDPOINTS = {
  LOGIN: `${API_URL}/auth/login`,
  REGISTER: `${API_URL}/auth/register`,
  PROFILE: `${API_URL}/auth/profile`,
  LOGOUT: `${API_URL}/auth/logout`,
};

export const PRODUCT_ENDPOINTS = {
  GET_ALL: `${API_URL}/products`,
  GET_ONE: (id) => `${API_URL}/products/${id}`,
  ADD_REVIEW: (id) => `${API_URL}/products/${id}/reviews`,
};

export const CART_ENDPOINTS = {
  GET: `${API_URL}/cart`,
  ADD: `${API_URL}/cart/add`,
  UPDATE: `${API_URL}/cart/update`,
  REMOVE: `${API_URL}/cart/remove`,
  CLEAR: `${API_URL}/cart/clear`,
};

export const WISHLIST_ENDPOINTS = {
  GET: `${API_URL}/wishlist`,
  ADD: `${API_URL}/wishlist/add`,
  REMOVE: `${API_URL}/wishlist/remove`,
  CLEAR: `${API_URL}/wishlist/clear`,
};

export const ORDER_ENDPOINTS = {
  CREATE: `${API_URL}/orders`,
  GET_ALL: `${API_URL}/orders`,
  GET_ONE: (id) => `${API_URL}/orders/${id}`,
  CREATE_PAYMENT: `${API_URL}/orders/payment`,
  VERIFY_PAYMENT: `${API_URL}/orders/verify`,
};

export const ADDRESS_ENDPOINTS = {
  GET_ALL: `${API_URL}/addresses`,
  ADD: `${API_URL}/addresses`,
  UPDATE: (id) => `${API_URL}/addresses/${id}`,
  DELETE: (id) => `${API_URL}/addresses/${id}`,
  SET_DEFAULT: (id) => `${API_URL}/addresses/${id}/default`,
};

// Helper function to create API requests with default options
export const createApiRequest = async (endpoint, options = {}) => {
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include', // For handling cookies
  };

  try {
    const response = await fetch(endpoint, { ...defaultOptions, ...options });
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Something went wrong');
    }

    return data;
  } catch (error) {
    console.error('API Request Error:', error);
    throw error;
  }
}; 