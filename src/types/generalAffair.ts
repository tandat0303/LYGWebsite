export interface GeneralAffairPayload {
  factory: string;
  userId: string;
  level: string;
}

export interface GeneralAffair {
  Fty: string;
  Amount: number;
  Title_Fty: string;
  Title_MeNu: string;
  ID_Account: string;
  StartDate: string;
  EndDate: string;
}

export interface GeneralAffairFactoryPayload extends Partial<GeneralAffairPayload> {
  startDate: string;
  endDate: string;
}

export interface GeneralAffairFactory {
  Names: string;
  DepID: string;
  Amount: number;
  Fty: string;
  StartDate: string;
  EndDate: string;
}

export interface GeneralAffairDepartmentPayload extends Partial<GeneralAffairFactoryPayload> {
  depId: string;
}

export interface GeneralAffairDepartment {
  MMYear: string;
  Amount: number;
  MMYear_Title: string;
  Fty: string;
  DepID: string;
}

export interface GeneralAffairDepartmentMYearPayload extends Partial<GeneralAffairDepartmentPayload> {
  year: string;
}
