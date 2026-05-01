import apiClient from "./api-client";

export const adminProductsApi = {
  list: async (params = {}) => {
    const response = await apiClient.get("/admin/products", { params });
    const payload = response.data;
    if (payload?.status && payload.status !== "SUCCESS") {
      throw new Error(payload?.message || "Failed to fetch products.");
    }
    return payload?.data ?? payload;
  },

  remove: async (productId) => {
    const response = await apiClient.delete(`/admin/products/${productId}`);
    const payload = response.data;
    if (payload?.status && payload.status !== "SUCCESS") {
      throw new Error(payload?.message || "Failed to delete product.");
    }
    return payload?.data ?? payload;
  },
};
