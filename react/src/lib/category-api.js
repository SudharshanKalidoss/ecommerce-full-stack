import apiClient from "./api-client";

export const categoryApi = {
  getCategories: async () => {
    const response = await apiClient.get("/categories");
    return response.data;
  },

  getCategoryById: async (categoryId) => {
    const response = await apiClient.get(`/categories/${categoryId}`);
    return response.data;
  },
};
