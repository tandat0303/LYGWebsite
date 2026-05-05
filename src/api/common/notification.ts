import type {
  Notification,
  NotificationPayload,
} from "../../types/notification";
import apiClient from "../apiClient";

const notificationApi = {
  getAllNotifications: async (
    payload: NotificationPayload,
  ): Promise<Notification[]> => {
    const res = await apiClient.get(
      `/${payload.factory}/notification/getAllNotificationsByUserId/${payload.userId}`,
    );
    return res.data;
  },
};

export default notificationApi;
