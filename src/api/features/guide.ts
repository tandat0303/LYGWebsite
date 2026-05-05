import type { Book } from "../../types/guide";
import apiClient from "../apiClient";

const guideApi = {
  getAllFiles: async (factory: string): Promise<Book[]> => {
    const res = await apiClient.get(`/auth/${factory}/bookFile`);
    return res.data;
  },
};

export default guideApi;
