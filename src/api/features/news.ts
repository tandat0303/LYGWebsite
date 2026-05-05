import type { NewsItem } from "../../types/news";
import apiClient from "../apiClient";

const newsApi = {
  getAllNews: async (personId: string): Promise<NewsItem[]> => {
    const res = await apiClient.get(`/news/getAllNews/${personId}`);
    return res.data;
  },
};

export default newsApi;
