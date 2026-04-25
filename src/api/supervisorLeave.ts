import type {
  CheckTaiwanParams,
  CheckTaiwanResponse,
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
};

export default supervisorLeaveApi;
