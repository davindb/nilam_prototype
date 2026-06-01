import type { PersonaConfig } from "@/types/flow";

export const PERSONAS: PersonaConfig[] = [
  { id: "payroll-single", label: "Fix Income · Payroll BRI · Non-Joint", shortLabel: "Payroll · Single", incomeType: "fix", isPayrollBRI: true, isJointIncome: false },
  { id: "payroll-joint", label: "Fix Income · Payroll BRI · Joint", shortLabel: "Payroll · Joint", incomeType: "fix", isPayrollBRI: true, isJointIncome: true },
  { id: "nonpayroll-single", label: "Fix Income · Non-Payroll · Non-Joint", shortLabel: "Non-Payroll · Single", incomeType: "fix", isPayrollBRI: false, isJointIncome: false },
  { id: "nonpayroll-joint", label: "Fix Income · Non-Payroll · Joint", shortLabel: "Non-Payroll · Joint", incomeType: "fix", isPayrollBRI: false, isJointIncome: true },
];

export const personaById = (id: string) => PERSONAS.find((p) => p.id === id);
