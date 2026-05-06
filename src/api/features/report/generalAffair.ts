import type {
  GeneralAffair,
  GeneralAffairPayload,
} from "../../../types/generalAffair";
import apiClient from "../../apiClient";

const generalAffairApi = {
  getGeneralAffair: async (
    payload: GeneralAffairPayload,
  ): Promise<GeneralAffair> => {
    const res = await apiClient(
      `/report/generalAffairs/${payload.factory}/${payload.userId}/${payload.level}`,
    );
    return res.data;
  },
};

export default generalAffairApi;
