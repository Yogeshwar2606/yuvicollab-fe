import { WISHLIST_ENDPOINTS, createApiRequest } from '../config/api';

export const wishlistService = {
  getWishlist: async () => {
    return createApiRequest(WISHLIST_ENDPOINTS.GET);
  },

  addToWishlist: async (productId) => {
    return createApiRequest(WISHLIST_ENDPOINTS.ADD, {
      method: 'POST',
      body: JSON.stringify({ productId }),
    });
  },

  removeFromWishlist: async (productId) => {
    return createApiRequest(WISHLIST_ENDPOINTS.REMOVE, {
      method: 'DELETE',
      body: JSON.stringify({ productId }),
    });
  },

  clearWishlist: async () => {
    return createApiRequest(WISHLIST_ENDPOINTS.CLEAR, {
      method: 'DELETE',
    });
  },
}; 