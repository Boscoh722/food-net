import api from '../lib/api.js';

export const productApi = {
  // Get all products
  getProducts: async () => {
    const response = await api.get('/products');
    return response.data;
  },

  // Get product by ID
  getProduct: async (id) => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  // Get categories
  getCategories: async () => {
    const response = await api.get('/categories');
    return response.data;
  }
};

export default productApi;
