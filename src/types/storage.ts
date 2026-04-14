import type { User } from "./user";

export interface StorageSchema {
  auth: {
    accessToken: string;
    // refreshToken: string;
    user: User;
    // authenticate: boolean;
  };
}

export interface Lang {
  code: string;
  label: string;
  native: string;
  flag: string;
}
