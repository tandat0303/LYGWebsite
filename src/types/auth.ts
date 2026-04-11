import dayjs from "dayjs";

export interface LoginFormValues {
  idNumber: string;
  password: string;
}

export interface ForgotFormValues {
  accountNumber: string;
  idNumber: string;
  issueDate: dayjs.Dayjs;
  birthDate: dayjs.Dayjs;
  factory: string;
  newPassword: string;
}
