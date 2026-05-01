import apiClient from "./api-client";

export const contactApi = {
  get: async () => {
    const response = await apiClient.get("/contact");
    const payload = response.data;
    if (payload?.status && payload.status !== "SUCCESS") {
      throw new Error(payload?.message || "Failed to fetch contact details.");
    }
    return payload?.data ?? null;
  },
};
