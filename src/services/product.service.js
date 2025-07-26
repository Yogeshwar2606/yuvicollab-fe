import { PRODUCT_ENDPOINTS, createApiRequest } from '../config/api';

export const productService = {
  getAllProducts: async (filters = {}) => {
    const queryParams = new URLSearchParams(filters).toString();
    const url = queryParams ? `${PRODUCT_ENDPOINTS.GET_ALL}?${queryParams}` : PRODUCT_ENDPOINTS.GET_ALL;
    return createApiRequest(url);
  },

  getProductById: async (productId) => {
    return createApiRequest(PRODUCT_ENDPOINTS.GET_ONE(productId));
  },

  addReview: async (productId, reviewData) => {
    return createApiRequest(PRODUCT_ENDPOINTS.ADD_REVIEW(productId), {
      method: 'POST',
      body: JSON.stringify(reviewData),
    });
  },
}; 