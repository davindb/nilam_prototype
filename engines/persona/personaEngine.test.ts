import { describe, it, expect } from "vitest";
import { planFlow } from "./personaEngine";
import type { PersonaConfig } from "@/types/flow";
import { PERSONAS } from "@/data/personas";

const make = (o: Partial<PersonaConfig>): PersonaConfig => ({
  id: "x", label: "x", shortLabel: "x", incomeType: "fix",
  isPayrollBRI: false, isJointIncome: false, ...o,
});

const EXPECTED_STEPS = ["opening", "income_type", "joint_income", "requirement", "processing", "analyst_decision"];

describe("planFlow", () => {
  it("returns the 6-step uniform flow for payroll-single", () => {
    expect(planFlow(make({ isPayrollBRI: true, isJointIncome: false }))).toEqual(EXPECTED_STEPS);
  });

  it("returns the 6-step uniform flow for payroll-joint", () => {
    expect(planFlow(make({ isPayrollBRI: true, isJointIncome: true, spouseIsPayrollBRI: true }))).toEqual(EXPECTED_STEPS);
  });

  it("returns the 6-step uniform flow for nonpayroll-single", () => {
    expect(planFlow(make({ isPayrollBRI: false, isJointIncome: false }))).toEqual(EXPECTED_STEPS);
  });

  it("returns the 6-step uniform flow for nonpayroll-joint", () => {
    expect(planFlow(make({ isPayrollBRI: false, isJointIncome: true, spouseIsPayrollBRI: false }))).toEqual(EXPECTED_STEPS);
  });

  it("returns the same 6-step flow for all 4 PERSONAS", () => {
    for (const persona of PERSONAS) {
      expect(planFlow(persona)).toEqual(EXPECTED_STEPS);
    }
  });

  it("flow always starts with opening", () => {
    expect(planFlow(make({}))[0]).toBe("opening");
  });

  it("flow always ends with analyst_decision", () => {
    const steps = planFlow(make({}));
    expect(steps[steps.length - 1]).toBe("analyst_decision");
  });

  it("flow always includes processing before analyst_decision", () => {
    const steps = planFlow(make({}));
    const procIdx = steps.indexOf("processing");
    const analystIdx = steps.indexOf("analyst_decision");
    expect(procIdx).toBeGreaterThan(-1);
    expect(analystIdx).toBe(procIdx + 1);
  });
});
