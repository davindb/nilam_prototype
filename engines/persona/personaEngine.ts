import type { FlowStep, PersonaConfig } from "@/types/flow";

export function planFlow(_p: PersonaConfig): FlowStep[] {
  return ["opening", "income_type", "joint_income", "requirement", "processing", "analyst_decision"];
}
