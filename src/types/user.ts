export interface User {
  userId: string;
  fullName: string;
  birthday: string;
  idCard: string;
  level: string;
  factory: string;
  isIT: boolean;
  nameshow: string;
  passDate: string;
}

export interface UserInfoPayload {
  factory: string;
  userId: string;
}
export interface UserInfo {
  Person_ID: string;
  Person_Serial_Key: string;
  Department_Serial_Key: string;
  Person_Name: string;
  Birthday: string;
  ID: string;
  ID_Day: string;
  Department_Name: string;
  Date_Come_In: string;
  Mobilephone_Number: string;
  Staying_Address: string;
  Tax_Code: string;
  birthday: string;
  mobilePhoneNumber: string;
  Email: string;
  Vehicle: string;
  Address_Live: string;
}

export type FieldKey =
  | "fullName"
  | "cardNumber"
  | "department"
  | "email"
  | "taxCode"
  | "joinDate"
  | "birthday"
  | "phone"
  | "idCard"
  | "idIssueDate"
  | "permanentAddress"
  | "transport"
  | "temporaryAddress";

export interface Vehicle {
  Name_Vehicle: string;
  Name_Vehicle_VN: string;
  Name_Vehicle_CN: string;
  Name_Vehicle_MM: string;
}
