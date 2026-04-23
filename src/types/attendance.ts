export type AttendanceStatus =
  | "present"
  | "late"
  | "absent"
  | "holiday"
  | "leave"
  | "overtime"
  | "weekend";

export interface DayRecord {
  date: number;
  month: number;
  year: number;
  status: AttendanceStatus;
  checkIn?: string;
  checkOut?: string;
  overtimeHours?: number;
  note?: string;
}
