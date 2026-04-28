import type {
  CheckTaiwanParams,
  CheckTaiwanResponse,
  LeavePayload,
  LeaveInformation,
  LeaveList,
  LeaveDetail,
  TransportAllowance,
} from "../types/supervisorLeave";
import apiClient from "./apiClient";

const supervisorLeaveApi = {
  checkTaiwan: async (
    params: CheckTaiwanParams,
  ): Promise<CheckTaiwanResponse> => {
    const res = await apiClient.get(`/onleaveSupervisor/isTaiwan`, {
      params,
    });
    return res.data;
  },

  getLeaveInfo: async (payload: LeavePayload): Promise<LeaveInformation> => {
    const res = await apiClient.post(
      "/onleaveSupervisor/getLeaveInformationByID",
      payload,
    );
    return res.data;
  },

  getLeaveList: async (payload: LeavePayload): Promise<LeaveList> => {
    const res = await apiClient.post(
      "/onleaveSupervisor/getListOfLeaveHistoryById",
      payload,
    );
    return res.data;
  },

  getLeaveDetail: async (id: number): Promise<LeaveDetail> => {
    const res = await apiClient.get(
      `/onleaveSupervisor/getLeaveDetail?id=${id}`,
    );
    return res.data;
  },

  getSubsidyData: async (
    payload: LeavePayload,
  ): Promise<TransportAllowance> => {
    const res = await apiClient.post(
      "/onleaveSupervisor/getSubsidyMonthByFactory",
      payload,
    );
    return res.data;
  },
};

export default supervisorLeaveApi;
