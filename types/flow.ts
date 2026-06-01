export type FlowStep =
  | "opening"
  | "income_type"
  | "joint_income"
  | "requirement"
  | "processing"
  | "analyst_decision";

export interface PersonaConfig {
  id: string;
  label: string;
  shortLabel: string;
  incomeType: "fix";
  isPayrollBRI: boolean;
  isJointIncome: boolean;
  spouseIsPayrollBRI?: boolean;
}
