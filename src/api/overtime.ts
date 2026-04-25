import type { OvertimeData, OvertimePayload } from "../types/overtime";
import apiClient from "./apiClient";

const overtimeApi = {
  getOvertimeData: async (
    payload: OvertimePayload,
  ): Promise<OvertimeData[]> => {
    const res = await apiClient.get(
      `/${payload.factory}/user/overTime/${payload.userId}/${payload.year}`,
    );
    return res.data;
  },
};

export default overtimeApi;
