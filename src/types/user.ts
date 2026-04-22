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
  Bus_Route?: string;
  PickupDropoffStation?: string;
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
  | "temporaryAddress"
  | "shuttleTrip"
  | "shuttleStop";

export interface Vehicle {
  Name_Vehicle: string;
  Name_Vehicle_VN: string;
  Name_Vehicle_CN: string;
  Name_Vehicle_MM: string;
}

export interface UpdateVehiclePayload {
  personId: string;
  Vehicle: string;
}

export interface UpdateAddressLivePayload {
  personId: string;
  temporaryAddress: string;
}

export interface Station {
  ten: string;
  lat: number;
  long: number;
}

export interface Trip {
  hanh_trinh: string;
  tram_don_tra: Station[];
}

export interface UpdateTripPayload {
  personId: string;
  hanhTrinh: string;
}

export interface UpdatePickupDropoffStationPayload {
  diaDiem: string;
  lat: number;
  long: number;
  personId: string;
}
