import type { FlowStep, PersonaConfig } from "@/types/flow";

export function planFlow(p: PersonaConfig): FlowStep[] {
  const steps: FlowStep[] = ["opening"];
  if (!p.isPayrollBRI) steps.push("income_type");
  steps.push("joint_income");
  steps.push("requirement_nasabah");
  if (p.isJointIncome) {
    steps.push("spouse_identity");
    steps.push(p.spouseIsPayrollBRI ? "spouse_confirm" : "spouse_income");
  }
  steps.push("processing", "submitted");
  return steps;
}
