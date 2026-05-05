import type {
  Trip,
  UpdateAddressLivePayload,
  UpdatePickupDropoffStationPayload,
  UpdateTripPayload,
  UpdateUserInfoPayload,
  UpdateVehiclePayload,
  UserInfo,
  UserInfoPayload,
  Vehicle,
} from "../../types/user";
import apiClient from "../apiClient";

const userApi = {
  getUserInfo: async (payload: UserInfoPayload): Promise<UserInfo> => {
    const res = await apiClient.get(
      `/${payload.factory}/user/getUserInfo/${payload.userId}`,
    );
    return res.data.userInfo;
  },

  updateUserInfo: async (factory: string, data: UpdateUserInfoPayload) => {
    const res = await apiClient.put(`/${factory}/user/updateUserInfo`, {
      user: data,
    });
    return res.data;
  },

  getNameVehicle: async (factory: string): Promise<Vehicle[]> => {
    const res = await apiClient.get(`/${factory}/user/getNameVehicle`);
    return res.data;
  },

  updateVehicle: async (factory: string, data: UpdateVehiclePayload) => {
    const res = await apiClient.put(`/${factory}/user/updateVehicle`, data);
    return res.data;
  },

  updateAddressLive: async (
    factory: string,
    data: UpdateAddressLivePayload,
  ) => {
    const res = await apiClient.put(`/${factory}/user/updateAddressLive`, data);
    return res.data;
  },

  getAddressByFactory: async (factory: string): Promise<Trip[]> => {
    const res = await apiClient.get(`/${factory}/user/getAddress${factory}`);
    return res.data;
  },

  updateTrip: async (factory: string, data: UpdateTripPayload) => {
    const res = await apiClient.put(`/${factory}/user/updateTrip`, data);
    return res.data;
  },

  updateStation: async (
    factory: string,
    data: UpdatePickupDropoffStationPayload,
  ) => {
    const res = await apiClient.put(
      `/${factory}/user/updatePickupDropoffStation`,
      data,
    );
    return res.data;
  },
};

export default userApi;
