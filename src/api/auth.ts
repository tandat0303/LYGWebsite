import type { LoginPayload } from "../types/auth";
import apiClient from "./apiClient";

const authApi = {
  login: async (payload: LoginPayload) => {
    const res = await apiClient.post("/auth/login", payload);
    return res.data;
  },
};

export default authApi;
