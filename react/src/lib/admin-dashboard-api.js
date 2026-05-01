import apiClient from "./api-client";

export const adminDashboardApi = {
  getCounts: async () => {
    const response = await apiClient.get("/admin/dashboard/counts");
    const payload = response.data;

    if (payload?.status && payload.status !== "SUCCESS") {
      throw new Error(payload?.message || "Failed to fetch dashboard counts.");
    }

    return payload?.data ?? {};
  },
};
