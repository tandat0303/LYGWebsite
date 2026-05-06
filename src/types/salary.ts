export interface LastMonthPayload {
  factory: string;
  personId: string;
}

export interface LastMonth {
  month: string;
}

export interface SalaryPayload extends Partial<LastMonthPayload> {
  monthYear: string;
}

export interface Salary {
  Person_Serial_Key: string;
  Person_ID: string;
  Person_Name: string;
  Hire_Date: string;
  Department_ID: string;
  Department_Name: string;
  Working_Days: number;
  Working_Days_Report: string;
  Overtime: number;
  Vacation_Hours: number;
  Vacation_Overtime: number;
  Main_Salary: number;
  Job_Allowance: number;
  Responsibility_Allowance: number;
  Other_Allowance: number;
  Language_Allowance: number;
  Salary_And_Allowance: number;
  Salary_Of_Month: number;
  Overtime_Pay: number;
  Night_Working_Money: number;
  Environmental_Sanitation: number;
  Hard_Working: number;
  Living_Costs: number;
  Rating_Money: number;
  Yearly_Rating: number;
  P_R_Money: number;
  NV_Money: number;
  Holiday_Hours: number;
  Holiday_Working_Hours: number;
  Holiday_Money: number;
  Holiday_Money_Working: number;
  Woman_Allowance_Hour: number;
  Woman_Allowance: number;
  Advance_Payment: number;
  Union_Pay: number;
  Good_News_Allowance: number;
  Manager_Allowance: number;
  Allowance_For_Baby: number;
  Serving_Pay_1: number;
  Serving_Pay_2: number;
  Meal_Allowance: number;
  Meal_Number: number;
  Other_Pay: number;
  Transportation_Allowance: number;
  Family_Care_Allowance: number;
  No_Check: number;
  Rating_ID: string;
  Check_In_Late_1: number;
  Check_In_Late_2: number;
  Check_Out_Early: number;
  Annual_Leave: number;
  Leave_Days: number;
  YEARLY_OVERTIME: number;
  Night_Working_2: number;
  Night_Working_4: number;
  Night_Working_6: number;
  Night_Working_2_Money: number;
  Night_Working_4_Money: number;
  Night_Working_6_Money: number;
  Rest_Time_During_OT: number;
  Rest_Time_During_OT_Money: number;
  Person_Income_Tax_Money: number;
  NV1_Money: number;
  ATVSV_Allowance: number;
  QIP_Allowance: number;
  PCCC_Allowance: number;
  P_R_Vacation: number;
  NV_Vacation: number;
  NV1_Vacation: number;
  Is_R_Vacation: number;
  Numbers_Baby: number;
  Night_Working_1: number;
  Overtime_Working_Money: number;
  Vacation_Working_Money: number;
  Vacation_Overtime_Working_Money: number;
  Real_Salary: number;
  Working_Time_Pregnancy: number;
  Working_Pregnancy_Pay: number;
  NV2_Vacation: number;
  NV2_Money: number;
  Cost_Of_Living_Support: number;
  Basic_Salary_Start_Date: string;
  Health_Insurance: number;
  Social_Insurance: number;
  Unemployment_Insurance: number;
  NV3_Vacation: number;
  NV3_Money: number;
  NV4_Vacation: number;
  NV4_Money: number;
  NV5_Vacation: number;
  NV5_Money: number;
  NV6_Vacation: number;
  NV6_Money: number;
  Final_Salary: number;
}

export interface PersonalIncomeTax {
  STT: string;
  Year: string;
  Person_ID: string;
  Person_Name: string;
  Position_ID: string;
  Contract_Name: string;
  Tax_Code: string;
  ID: string;
  Real_Salary: number;
  Tax_Exempt_Income: number;
  Taxable_Income: number;
  Personal_Deductions: number;
  NumberOfDependents: number;
  Dependent_Deductions: number;
  Personal_and_Dependent_Deductions: number;
  Compulsory_Insurance: number;
  Total_Deductions: number;
  Tax_Base_Income: number;
  Personal_Income_Tax: number;
  Tax_UpTo_10M: number;
  Tax_10M_To_30M: number;
  Tax_30M_To_60M: number;
  Tax_60M_To_100M: number;
  Tax_Over_100M: number;
}

export interface ThirteenthSalary {
  Year: string;
  Person_ID: string;
  Person_Name: string;
  Date_Come_In: string;
  Department_Name: string;
  Position_ID: string;
  Salary_And_Allowance: number;
  Rating: string;
  Standard_Type: string;
  Number_Month_Bonus: number;
  Rating_Coefficient: number;
  Salary_Month_13: number;
  Rating_Bonus: number;
  High_Workday_Bonus: number;
  Total_Bonus: number;
  Personal_Income_Tax: number;
  Actually_Received: number;
  Note: string | null;
  YN: string | null;
}

export interface ThirteenthSalaryPayload extends Partial<LastMonthPayload> {
  year: string;
}
