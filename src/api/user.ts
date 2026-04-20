import type { UserInfo, UserInfoPayload, Vehicle } from "../types/user";
import apiClient from "./apiClient";

const userApi = {
  getUserInfo: async (payload: UserInfoPayload): Promise<UserInfo> => {
    const res = await apiClient.get(
      `/${payload.factory}/user/getUserInfo/${payload.userId}`,
    );
    return res.data.userInfo;
  },

  getNameVehicle: async (factory: string): Promise<Vehicle[]> => {
    const res = await apiClient.get(`/${factory}/user/getNameVehicle`);
    return res.data;
  },
};

export default userApi;
