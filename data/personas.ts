import type { PersonaConfig } from "@/types/flow";

export const PERSONAS: PersonaConfig[] = [
  { id: "payroll-single",    label: "Payroll BRI · Non Joint Income",      shortLabel: "Payroll · Non-Joint",     incomeType: "fix", isPayrollBRI: true,  isJointIncome: false },
  { id: "payroll-joint",     label: "Payroll BRI · Joint Income",          shortLabel: "Payroll · Joint",         incomeType: "fix", isPayrollBRI: true,  isJointIncome: true,  spouseIsPayrollBRI: true },
  { id: "nonpayroll-single", label: "Non Payroll BRI · Non Joint Income",  shortLabel: "Non-Payroll · Non-Joint", incomeType: "fix", isPayrollBRI: false, isJointIncome: false },
  { id: "nonpayroll-joint",  label: "Non Payroll BRI · Joint Income",      shortLabel: "Non-Payroll · Joint",     incomeType: "fix", isPayrollBRI: false, isJointIncome: true,  spouseIsPayrollBRI: false },
];

export const personaById = (id: string) => PERSONAS.find((p) => p.id === id);
