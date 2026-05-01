import apiClient from "./api-client";

export const adminContactApi = {
  get: async () => {
    const response = await apiClient.get("/admin/contact");
    const payload = response.data;
    if (payload?.status && payload.status !== "SUCCESS") {
      throw new Error(payload?.message || "Failed to fetch contact details.");
    }
    return payload?.data ?? null;
  },

  update: async (payload = {}) => {
    const formData = new FormData();

    formData.append("primaryContact", payload.primaryContact || "");
    formData.append("primaryEmail", payload.primaryEmail || "");
    formData.append("address", payload.address || "");
    formData.append("socialProfiles", JSON.stringify(payload.socialProfiles || []));

    if (payload.logoFile instanceof File) {
      formData.append("logo", payload.logoFile);
    }

    const response = await apiClient.put("/admin/contact", formData);
    const body = response.data;
    if (body?.status && body.status !== "SUCCESS") {
      throw new Error(body?.message || "Failed to update contact details.");
    }
    return body?.data ?? body;
  },
};
