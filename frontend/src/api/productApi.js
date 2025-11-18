import api from '../lib/api.js';

export const productApi = {
  getProducts: async () => {
    const response = await api.get('/products');
    return response.data;
  },

  getProduct: async (id) => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  getCategories: async () => {
    const response = await api.get('/categories');
    return response.data;
  },

  getAllProducts: async () => {
    const response = await api.get('/products/all/products');
    return response.data;
  },

  approveProduct: async (id) => {
    const response = await api.patch(`/products/${id}/approve`);
    return response.data;
  },

  deleteProduct: async (id) => {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  }
};

export default productApi;