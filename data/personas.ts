import type { PersonaConfig } from "@/types/flow";

export const PERSONAS: PersonaConfig[] = [
  { id: "payroll-single", label: "Fix · Payroll BRI · Non-Joint", shortLabel: "Payroll · Single", incomeType: "fix", isPayrollBRI: true, isJointIncome: false },
  { id: "payroll-joint", label: "Fix · Payroll BRI · Joint (pasangan Payroll)", shortLabel: "Payroll · Joint", incomeType: "fix", isPayrollBRI: true, isJointIncome: true, spouseIsPayrollBRI: true },
  { id: "nonpayroll-single", label: "Fix · Non-Payroll · Non-Joint", shortLabel: "Non-Payroll · Single", incomeType: "fix", isPayrollBRI: false, isJointIncome: false },
  { id: "nonpayroll-joint", label: "Fix · Non-Payroll · Joint (pasangan Non-Payroll)", shortLabel: "Non-Payroll · Joint", incomeType: "fix", isPayrollBRI: false, isJointIncome: true, spouseIsPayrollBRI: false },
];

export const personaById = (id: string) => PERSONAS.find((p) => p.id === id);
