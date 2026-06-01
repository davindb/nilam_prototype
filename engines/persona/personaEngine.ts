import type { FlowStep, PersonaConfig } from "@/types/flow";

export function planFlow(p: PersonaConfig): FlowStep[] {
  const steps: FlowStep[] = ["opening"];
  if (p.isPayrollBRI) steps.push("payroll_confirm");
  else steps.push("income_type", "document_upload");
  if (p.isJointIncome) steps.push("joint_documents");
  steps.push("processing", "submitted");
  return steps;
}
