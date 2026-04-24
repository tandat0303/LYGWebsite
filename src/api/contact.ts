import type { ContactItem } from "../types/contact";
import apiClient from "./apiClient";

const contactApi = {
  getContactInfo: async (factory: string): Promise<ContactItem[]> => {
    const res = await apiClient.get(`/${factory}/user/getContactInfo`);
    return res.data;
  },
};

export default contactApi;
