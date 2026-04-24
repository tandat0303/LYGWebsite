import type {
  TimeCheckingPayload,
  TimeCheckingResponse,
  TimeKeeping,
  TimeKeepingPayload,
} from "../types/timeKeeping";
import apiClient from "./apiClient";

const timeKeepingApi = {
  getTimeKeeping: async (payload: TimeKeepingPayload): Promise<TimeKeeping> => {
    const res = await apiClient.get(
      `/${payload.factory}/user/getTimeKeeping/${payload.personId}/${payload.year}/${payload.month}`,
    );
    return res.data;
  },

  getTimeChecking: async (
    payload: TimeCheckingPayload,
  ): Promise<TimeCheckingResponse> => {
    const res = await apiClient.get(
      `/${payload.factory}/user/getTimeChecking/${payload.personId}/${payload.date}`,
    );
    return res.data;
  },
};

export default timeKeepingApi;
