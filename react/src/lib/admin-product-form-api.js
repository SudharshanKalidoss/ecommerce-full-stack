import apiClient from "./api-client";

const appendFormData = (formData, data) => {
  formData.append("title", data.title);
  formData.append("salePrice", data.salePrice);
  formData.append("comparePrice", data.comparePrice);
  formData.append("status", String(data.status));
  formData.append("shortDescription", data.shortDescription);
  formData.append("description", data.description);
  formData.append("categoryId", String(data.categoryId));
  formData.append("slug", data.slug);
  formData.append("stock", String(data.stock));
  formData.append("variants", JSON.stringify(data.variants || []));
      console.log("Appending thumbnail file:", data.thumbnailFile);

  // Only append thumbnail if a new file is selected
  if (data.thumbnailFile) {
    console.log("Appending thumbnail file:", data.thumbnailFile);
    formData.append("thumbnail", data.thumbnailFile);
  }
};

export const adminProductFormApi = {
  getCategories: async () => {
    const response = await apiClient.get("/admin/categories");
    const payload = response.data;
    if (payload?.status && payload.status !== "SUCCESS") {
      throw new Error(payload?.message || "Failed to fetch categories.");
    }
    return payload?.data ?? [];
  },

  getProductById: async (id) => {
    const response = await apiClient.get(`/admin/products/${id}`);
    const payload = response.data;
    if (payload?.status && payload.status !== "SUCCESS") {
      throw new Error(payload?.message || "Failed to fetch product.");
    }
    return payload?.data ?? null;
  },

  create: async (data) => {
    const formData = new FormData();
    appendFormData(formData, data);
    const response = await apiClient.post("/admin/products", formData);
    const payload = response.data;
    if (payload?.status && payload.status !== "SUCCESS") {
      throw new Error(payload?.message || "Failed to create product.");
    }
    return payload?.data ?? payload;
  },

  update: async (id, data) => {
    const formData = new FormData();
    appendFormData(formData, data);
    const response = await apiClient.put(`/admin/products/${id}`, formData);
    const payload = response.data;
    if (payload?.status && payload.status !== "SUCCESS") {
      throw new Error(payload?.message || "Failed to update product.");
    }
    return payload?.data ?? payload;
  },
};
