import apiClient from "./api-client";

export const adminAuthApi = {
  login: async ({ email, password }) => {
    const response = await apiClient.post("/admin/auth/login", { email, password });
    const payload = response.data;

    if (payload?.status !== "SUCCESS" || !payload?.data?.accessToken) {
      throw new Error(payload?.message || "Admin login failed. Please try again.");
    }

    return payload.data;
  },
};
