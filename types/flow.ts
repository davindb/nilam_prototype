export type FlowStep =
  | 'opening' | 'income_type' | 'payroll_confirm'
  | 'document_upload' | 'joint_documents' | 'processing' | 'submitted';

export interface PersonaConfig {
  id: string;
  label: string;
  shortLabel: string;
  incomeType: 'fix';
  isPayrollBRI: boolean;
  isJointIncome: boolean;
}
