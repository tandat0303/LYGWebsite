import dayjs from "dayjs";
import type { User } from "./user";

export interface LoginPayload {
  userId: string;
  password: string;
  factory: string;
  exponentPushToken: string;
  DeviceInfo: string;
}

export interface LoginResponse {
  authenticated: boolean;
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface LoginFormValues {
  userId: string;
  password: string;
  factory: string;
}

export interface ForgotFormValues {
  userId: string;
  idNumber: string;
  receivedDate: dayjs.Dayjs;
  birthDate: dayjs.Dayjs;
  factory: string;
  newPassword: string;
}

export interface AuthPayload {
  accessToken: string;
  user: User;
}

export interface ChangePasswordPayload {
  userId: string;
  factory: string;
  password: string;
  newPassword: string;
}

export interface ChangePasswordResponse {
  status: boolean;
  message: string;
}
export interface ChangePasswordValues {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}
