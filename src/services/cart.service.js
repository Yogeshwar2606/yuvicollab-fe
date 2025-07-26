import { CART_ENDPOINTS, createApiRequest } from '../config/api';

export const cartService = {
  getCart: async () => {
    return createApiRequest(CART_ENDPOINTS.GET);
  },

  addToCart: async (productId, quantity = 1) => {
    return createApiRequest(CART_ENDPOINTS.ADD, {
      method: 'POST',
      body: JSON.stringify({ productId, quantity }),
    });
  },

  updateQuantity: async (productId, quantity) => {
    return createApiRequest(CART_ENDPOINTS.UPDATE, {
      method: 'PUT',
      body: JSON.stringify({ productId, quantity }),
    });
  },

  removeFromCart: async (productId) => {
    return createApiRequest(CART_ENDPOINTS.REMOVE, {
      method: 'DELETE',
      body: JSON.stringify({ productId }),
    });
  },

  clearCart: async () => {
    return createApiRequest(CART_ENDPOINTS.CLEAR, {
      method: 'DELETE',
    });
  },
}; 