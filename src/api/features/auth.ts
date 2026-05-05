import type {
  ChangePasswordPayload,
  ChangePasswordResponse,
  LoginPayload,
  LoginResponse,
} from "../../types/auth";
import apiClient from "../apiClient";

const authApi = {
  login: async (payload: LoginPayload): Promise<LoginResponse> => {
    const res = await apiClient.post("/auth/login", payload);
    return res.data;
  },

  changePassword: async (
    payload: ChangePasswordPayload,
  ): Promise<ChangePasswordResponse> => {
    const res = await apiClient.post(
      `/${payload.factory}/user/changePassword`,
      payload,
    );
    return res.data;
  },
};

export default authApi;
