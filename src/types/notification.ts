export interface Notification {
  ID: number;
  Subjects: string;
  Notifications: string;
  Content: string;
  File_URL: string;
  Modify_Date: string;
  isReaded: number;
}

export interface NotificationPayload {
  factory: string;
  userId: string;
}
