import { ADDRESS_ENDPOINTS, createApiRequest } from '../config/api';

export const addressService = {
  getAllAddresses: async () => {
    return createApiRequest(ADDRESS_ENDPOINTS.GET_ALL);
  },

  addAddress: async (addressData) => {
    return createApiRequest(ADDRESS_ENDPOINTS.ADD, {
      method: 'POST',
      body: JSON.stringify(addressData),
    });
  },

  updateAddress: async (addressId, addressData) => {
    return createApiRequest(ADDRESS_ENDPOINTS.UPDATE(addressId), {
      method: 'PUT',
      body: JSON.stringify(addressData),
    });
  },

  deleteAddress: async (addressId) => {
    return createApiRequest(ADDRESS_ENDPOINTS.DELETE(addressId), {
      method: 'DELETE',
    });
  },

  setDefaultAddress: async (addressId) => {
    return createApiRequest(ADDRESS_ENDPOINTS.SET_DEFAULT(addressId), {
      method: 'PUT',
    });
  },
}; 