import type {
  LeaveData,
  LeavePayload,
  LeaveSummary,
} from "../../../types/leave";
import apiClient from "../../apiClient";

const leaveApi = {
  getLeaveSummary: async (payload: LeavePayload): Promise<LeaveSummary[]> => {
    const res = await apiClient.get(
      `/${payload.factory}/user/onLeaveSummary/${payload.userId}/${payload.year}`,
    );
    return res.data;
  },

  getLeaves: async (payload: LeavePayload): Promise<LeaveData[]> => {
    const res = await apiClient.get(
      `/${payload.factory}/user/onLeave/${payload.userId}/${payload.year}`,
    );
    return res.data;
  },
};

export default leaveApi;
