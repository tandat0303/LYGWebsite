export interface CheckTaiwanResponse {
  status: number;
  message: string;
}

export interface CheckTaiwanParams {
  factory: string;
  employId: string;
}

export interface LeavePayload {
  factory: string;
  userId: string;
  year: string;
}

export interface HomeLeaveData {
  EngEmpName: string;
  EmployeeID: string;
  HomeLeave_Total: number;
  HomeLeave_UsedApproved: number;
  HomeLeave_UsedPending: number;
  HomeLeave_Remaining: number;
  AL_P1_Dates: string | null;
  AL_P1_Total: number;
  AL_P1_UsedApproved: number;
  AL_P1_UsedPending: number;
  AL_P1_TitleTW: string | null;
  AL_P1_TitleEN: string | null;
  AL_P1_Remaining: number;
  AL_P2_Dates: string | null;
  AL_P2_Total: number;
  AL_P2_UsedApproved: number;
  AL_P2_UsedPending: number;
  AL_P2_TitleTW: string | null;
  AL_P2_TitleEN: string | null;
  AL_P2_Remaining: number;
  Tickets_Total: number;
  Tickets_Used: number;
  Tickets_Pending: number;
  Tickets_Remaining: number;
}

export interface LeaveInformation {
  status: boolean;
  listData: HomeLeaveData;
}

export interface DataHistory {
  ID: number;
  LeaveLabelEN: string;
  LeaveLabelTW: string;
  DateRange: string;
  LeaveInfoEN: string;
  LeaveInfoTW: string;
  Days: number;
  Status: string;
}

export interface LeaveList {
  status: boolean;
  dataHistory: DataHistory[];
}

export interface LeaveRequestInfo {
  SourceID: number;
  BPMNO: string;
  Status: string;
  StartDate: string;
  EndDate: string;
  TotalDays: number;
}

export interface LeaveTag {
  TagType: string;
  TagNameEN: string;
  TagNameTW: string;
  Days: number;
}

export interface LeaveHomeInfo {
  LeaveCategoryID: number;
  PrimaryTagEN: string;
  PrimaryTagTW: string;
  Destination: string;
  ArrangementEN: string;
  ArrangementTW: string;
  DateRange: string;
}

export interface LeaveFlightInfo {
  LeaveCategoryID: number;
  PrimaryTagEN: string;
  PrimaryTagTW: string;
  FlightNo: string;
  Route: string;
  TimeRange: string;
}

export interface LeaveDetail {
  status: boolean;
  data: [
    LeaveRequestInfo[],
    LeaveHomeInfo[] | null,
    LeaveTag[],
    LeaveFlightInfo[] | null,
  ];
}

// Transport Allowance - Non Taiwan
export interface DataSubsidy {
  SubsidyTime: number;
  DutyDate: string;
  SubsidyMonth: number;
  IsPaid: number;
}

export interface TransportAllowance {
  status: boolean;
  message: string;
  dataSubsidy: DataSubsidy[];
}
