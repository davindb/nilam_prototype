export type FlowStep =
  | "opening"
  | "income_type"          // non-payroll nasabah only
  | "joint_income"         // always asked
  | "requirement_nasabah"  // payroll → confirm; non-payroll → upload slip+mutasi
  | "spouse_identity"      // joint: KTP + selfie
  | "spouse_confirm"       // joint + spouse payroll: confirm (no income upload)
  | "spouse_income"        // joint + spouse non-payroll: upload spouse slip+mutasi
  | "processing"
  | "submitted";

export interface PersonaConfig {
  id: string;
  label: string;
  shortLabel: string;
  incomeType: 'fix';
  isPayrollBRI: boolean;
  isJointIncome: boolean;
  spouseIsPayrollBRI?: boolean;
}
