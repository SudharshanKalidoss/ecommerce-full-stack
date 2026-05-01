import apiClient from "./api-client";

export const adminUsersApi = {
  list: async (params = {}) => {
    const response = await apiClient.get("/admin/users", { params });
    const payload = response.data;
    if (payload?.status && payload.status !== "SUCCESS") {
      throw new Error(payload?.message || "Failed to fetch users.");
    }
    return payload?.data ?? payload;
  },
};
