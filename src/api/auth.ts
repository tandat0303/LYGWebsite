import type { LoginPayload, LoginResponse } from "../types/auth";
import apiClient from "./apiClient";

const authApi = {
  login: async (payload: LoginPayload): Promise<LoginResponse> => {
    const res = await apiClient.post("/auth/login", payload);
    return res.data;
  },
};

export default authApi;
