import apiClient from "./api-client";

export const productApi = {
  list: async (params = {}) => {
    const response = await apiClient.get("/products", { params });
    return response.data;
  },

  getById: async (id) => {
    const response = await apiClient.get(`/products/${id}`);
    return response.data;
  },

  getBySlug: async (slug) => {
    const response = await apiClient.get(`/products/${slug}`);
    return response.data;
  },

  search: async (query) => {
    const response = await apiClient.get("/products", { params: { q: query } });
    return response.data;
  },
};
