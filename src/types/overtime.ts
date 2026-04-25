export interface OvertimeData {
  Person_ID: string;
  Check_Day: string;
  Overtime: number;
  YN: string;
}

export interface OvertimePayload {
  factory: string;
  userId: string;
  year: string;
}
