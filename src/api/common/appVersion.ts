import type { AppVersion } from "../../types/appVersion";
import apiClient from "../apiClient";

const appVersionApi = {
  getAppVersion: async (): Promise<AppVersion> => {
    const res = await apiClient.get("/auth/getversionapp");
    return res.data;
  },
};

export default appVersionApi;
