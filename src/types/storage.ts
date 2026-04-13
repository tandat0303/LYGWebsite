import type { User } from "./user";

export interface StorageSchema {
  auth: {
    accessToken: string;
    // refreshToken: string;
    user: User;
    // authenticate: boolean;
  };
}
