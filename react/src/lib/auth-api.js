import apiClient from "./api-client";

export const authApi = {
  login: async ({ email, password }) => {
    const response = await apiClient.post("/auth/login", { email, password });
    const payload = response.data;


    if (payload?.status !== "SUCCESS" || !payload?.data?.accessToken) {
      throw new Error(payload?.message || "Login failed. Please try again.");
    }

    return payload.data;
  },

  register: async ({ firstName, lastName, email, phoneNumber, password }) => {
    const response = await apiClient.post("/auth/register", {
      firstName,
      lastName,
      email,
      phoneNumber,
      password,
    });
    const payload = response.data;
    console.log(payload , "dsadsadsadsadssad");

    if (payload?.status && payload.status !== "SUCCESS") {
      throw new Error(payload?.message || "Registration failed. Try again.");
    }

    return payload.data ?? payload;
  },
};
