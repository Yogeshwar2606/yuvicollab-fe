import { ORDER_ENDPOINTS, createApiRequest } from '../config/api';

export const orderService = {
  createOrder: async (orderData) => {
    return createApiRequest(ORDER_ENDPOINTS.CREATE, {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  },

  getAllOrders: async () => {
    return createApiRequest(ORDER_ENDPOINTS.GET_ALL);
  },

  getOrderById: async (orderId) => {
    return createApiRequest(ORDER_ENDPOINTS.GET_ONE(orderId));
  },

  createPayment: async (orderId) => {
    return createApiRequest(ORDER_ENDPOINTS.CREATE_PAYMENT, {
      method: 'POST',
      body: JSON.stringify({ orderId }),
    });
  },

  verifyPayment: async (paymentData) => {
    return createApiRequest(ORDER_ENDPOINTS.VERIFY_PAYMENT, {
      method: 'POST',
      body: JSON.stringify(paymentData),
    });
  },
}; 