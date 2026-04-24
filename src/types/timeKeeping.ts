type DayKey =
  | "01"
  | "02"
  | "03"
  | "04"
  | "05"
  | "06"
  | "07"
  | "08"
  | "09"
  | "10"
  | "11"
  | "12"
  | "13"
  | "14"
  | "15"
  | "16"
  | "17"
  | "18"
  | "19"
  | "20"
  | "21"
  | "22"
  | "23"
  | "24"
  | "25"
  | "26"
  | "27"
  | "28"
  | "29"
  | "30"
  | "31";

type DayFields = Record<DayKey, string>;

export interface TimeKeeping extends Partial<DayFields> {
  TOTAL1: number;
  TOTAL2: number;
  TOTAL3: number;
  DATE_COME_IN: string;
  RATING: string;
  Working_Time_Pregnancy: number;
  Check_In_Late: number;
  "Department ID": string;
  "PERSON ID": string;
  "Person name": string;
}

export interface TimeKeepingPayload {
  factory: string;
  personId: string;
  year: string;
  month: string;
}

export interface TimeCheckingPayload {
  factory: string;
  personId: string;
  date: string;
}

export interface TimeCheckingResponse {
  checkIn: string;
  checkOut: string;
}

export type DayCellStatus = "green" | "red" | "yellow" | "empty" | "weekend";

export interface CalendarDay {
  date: number;
  month: number;
  year: number;
  rawValue: string;
  status: DayCellStatus;
  isSatOrSun: boolean;
}
