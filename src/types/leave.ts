export interface LeaveSummary {
  Chon?: boolean;
  Person_Serial_Key?: string;
  Person_ID?: string;
  Person_Name?: string;
  Job_Name?: string;
  Date_Come_In?: string;
  Department_Name?: string;
  Vacation_Numbers?: number;
  Vacation_Year?: number;
  TONPHEPNAMTRUOC?: number;
  PHEPTAMTINH?: number;
  TONGPHEPTAMTINH?: number;
  PHEPDOCHAI?: number;
  TONGPHEPDANGHI?: number;
  PHEPKHONGDUOCHUONG?: number;
  TONGPHEPTHUCTE?: number;
  TONGPHEPCONLAI?: number;
  Is_Toxic?: number;
  Is_Toxic_Applied_Date?: string;
  Is_Toxic_End_Date?: string;
  Is_Environmental_Sanitation?: number;
  Job_Serial_Key?: string;
  Job_Applied_Date?: string;
  DANGHI?: number;
  CONLAI?: number;
  DANGHIPTT?: number;
  CONLAIPTT?: number;

  // LHG
  TONG_PHEP?: number;
  DA_NGHI?: number;
  CON_LAI?: number;
}

export interface LeaveData {
  Vacation_ID: string;
  Vacation_Detail_Note: string;
  Vacation_From_Date: string;
  Vacation_To_Date: string;
  Vacation_Hour: number;
  Vacation_Day: number;
}

export interface LeavePayload {
  factory: string;
  userId: string;
  year: string;
}
