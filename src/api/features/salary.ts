import type {
  LastMonth,
  LastMonthPayload,
  Salary,
  SalaryPayload,
} from "../../types/salary";
import apiClient from "../apiClient";

const salaryApi = {
  getLastMonth: async (payload: LastMonthPayload): Promise<LastMonth[]> => {
    const res = await apiClient.get(
      `/${payload.factory}/salary/getLastMonthConfirm/${payload.personId}`,
    );
    return res.data;
  },

  getSalary: async (payload: SalaryPayload): Promise<Salary[]> => {
    const res = await apiClient.post(
      `/${payload.factory}/salary/${payload.personId}/${payload.monthYear}`,
    );
    return res.data;
  },
};

export default salaryApi;
