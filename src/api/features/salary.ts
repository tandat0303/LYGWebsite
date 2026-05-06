import type {
  LastMonth,
  LastMonthPayload,
  PersonalIncomeTax,
  Salary,
  SalaryPayload,
  ThirteenthSalary,
  ThirteenthSalaryPayload,
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

  getPersonalIncomeTax: async (
    payload: SalaryPayload,
  ): Promise<PersonalIncomeTax[]> => {
    const res = await apiClient.get(
      `/${payload.factory}/salary/getPersonalIncomeTax/${payload.personId}/${payload.monthYear}`,
    );
    return res.data;
  },

  getThirteenthSalary: async (
    payload: ThirteenthSalaryPayload,
  ): Promise<ThirteenthSalary> => {
    const res = await apiClient.get(
      `/${payload.factory}/user/getThirteenthSalary/${payload.personId}/${payload.year}`,
    );
    return res.data;
  },
};

export default salaryApi;
