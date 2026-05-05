import type { TranslationResponse } from "../../types/translation";
import apiClient from "../apiClient";

const translationApi = {
  getLanguages: async (): Promise<TranslationResponse> => {
    const res = await apiClient.get("/auth/language");
    return res.data;
  },
};

export default translationApi;
