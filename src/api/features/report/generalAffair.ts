import type {
  GeneralAffair,
  GeneralAffairDepartment,
  GeneralAffairDepartmentMYearPayload,
  GeneralAffairDepartmentPayload,
  GeneralAffairFactory,
  GeneralAffairFactoryPayload,
  GeneralAffairPayload,
} from "../../../types/generalAffair";
import apiClient from "../../apiClient";

const generalAffairApi = {
  getGeneralAffair: async (
    payload: GeneralAffairPayload,
  ): Promise<GeneralAffair[]> => {
    const res = await apiClient(
      `/report/generalAffairs/${payload.factory}/${payload.userId}/${payload.level}`,
    );
    return res.data;
  },

  getGeneralAffairFactory: async (
    payload: GeneralAffairFactoryPayload,
  ): Promise<GeneralAffairFactory[]> => {
    const res = await apiClient.get(
      `/report/generalAffairsFactory/${payload.userId}/${payload.factory}/${payload.startDate}/${payload.endDate}`,
    );
    return res.data;
  },

  getGeneralAffairDepartment: async (
    payload: GeneralAffairDepartmentPayload,
  ): Promise<GeneralAffairDepartment[]> => {
    const res = await apiClient.get(
      `/report/generalAffairsDepartment/${payload.depId}/${payload.factory}/${payload.startDate}/${payload.endDate}`,
    );
    return res.data;
  },

  getGeneralAffairDepartmentMYear: async (
    payload: GeneralAffairDepartmentMYearPayload,
  ) => {
    const res = await apiClient.get(
      `/report/generalAffairsDepartmentMYear/${payload.depId}/${payload.factory}/${payload.year}`,
    );
    return res.data;
  },
};

export default generalAffairApi;
