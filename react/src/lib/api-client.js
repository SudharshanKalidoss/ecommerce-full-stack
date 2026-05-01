import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://ecommerce-full-stack-production.up.railway.app/api";

export const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Don't set Content-Type for FormData, let the browser set it with boundary
    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
    }

    return config;
  },
  (error) => Promise.reject(error)
);

const normalizeError = (error) => {
  if (error.response) {
    return {
      status: error.response.status,
      message: error.response.data?.message || error.response.statusText || "Request failed",
      data: error.response.data,
    };
  }

  if (error.request) {
    return {
      status: null,
      message: "No response received from server. Please try again.",
      data: null,
    };
  }

  return {
    status: null,
    message: error.message || "An unexpected error occurred.",
    data: null,
  };
};

apiClient.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(normalizeError(error))
);

export const setAuthToken = (token) => {
  if (token) {
    apiClient.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete apiClient.defaults.headers.common.Authorization;
  }
};

export const clearAuthToken = () => {
  delete apiClient.defaults.headers.common.Authorization;
};

export default apiClient;
