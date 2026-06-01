import { describe, it, expect } from "vitest";
import { planFlow } from "./personaEngine";
import type { PersonaConfig } from "@/types/flow";

const make = (o: Partial<PersonaConfig>): PersonaConfig => ({
  id: "x", label: "x", shortLabel: "x", incomeType: "fix",
  isPayrollBRI: false, isJointIncome: false, ...o,
});

describe("planFlow", () => {
  it("payroll-single: skips income_type, no spouse steps", () => {
    expect(planFlow(make({ isPayrollBRI: true, isJointIncome: false }))).toEqual(
      ["opening", "joint_income", "requirement_nasabah", "processing", "submitted"]);
  });
  it("payroll-joint: skips income_type, adds spouse_identity + spouse_confirm (spouse payroll)", () => {
    expect(planFlow(make({ isPayrollBRI: true, isJointIncome: true, spouseIsPayrollBRI: true }))).toEqual(
      ["opening", "joint_income", "requirement_nasabah", "spouse_identity", "spouse_confirm", "processing", "submitted"]);
  });
  it("nonpayroll-single: includes income_type, no spouse steps", () => {
    expect(planFlow(make({ isPayrollBRI: false, isJointIncome: false }))).toEqual(
      ["opening", "income_type", "joint_income", "requirement_nasabah", "processing", "submitted"]);
  });
  it("nonpayroll-joint: includes income_type, adds spouse_identity + spouse_income (spouse non-payroll)", () => {
    expect(planFlow(make({ isPayrollBRI: false, isJointIncome: true, spouseIsPayrollBRI: false }))).toEqual(
      ["opening", "income_type", "joint_income", "requirement_nasabah", "spouse_identity", "spouse_income", "processing", "submitted"]);
  });
});
