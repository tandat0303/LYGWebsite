import axios from "axios";
import { apiConfig } from "./apiConfig";
import storage from "../libs/storage";
import { store } from "../store/store";
import { logout } from "../features/authSlice";

const apiClient = axios.create({
  baseURL: apiConfig.baseUrl,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 1800000,
});

apiClient.interceptors.request.use((config) => {
  const state = store.getState();

  const token = state.auth.accessToken || storage.get("auth")?.accessToken;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => response,

  (error) => {
    const status = error?.response?.status;

    if (status === 401 && !error.config.url.includes("/auth/login")) {
      storage.remove("auth");
      store.dispatch(logout());
      window.location.href = "/login";
    }

    return Promise.reject(error);
  },
);

export default apiClient;
