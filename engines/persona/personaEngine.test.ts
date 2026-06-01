import { describe, it, expect } from "vitest";
import { planFlow } from "./personaEngine";
import type { PersonaConfig } from "@/types/flow";

const make = (o: Partial<PersonaConfig>): PersonaConfig => ({
  id: "x", label: "x", shortLabel: "x", incomeType: "fix",
  isPayrollBRI: false, isJointIncome: false, ...o,
});

describe("planFlow", () => {
  it("payroll non-joint skips income_type & upload, uses payroll_confirm", () => {
    expect(planFlow(make({ isPayrollBRI: true }))).toEqual(
      ["opening", "payroll_confirm", "processing", "submitted"]);
  });
  it("non-payroll non-joint shows income_type + document_upload", () => {
    expect(planFlow(make({ isPayrollBRI: false }))).toEqual(
      ["opening", "income_type", "document_upload", "processing", "submitted"]);
  });
  it("payroll joint adds joint_documents", () => {
    expect(planFlow(make({ isPayrollBRI: true, isJointIncome: true }))).toEqual(
      ["opening", "payroll_confirm", "joint_documents", "processing", "submitted"]);
  });
  it("non-payroll joint adds joint_documents after upload", () => {
    expect(planFlow(make({ isJointIncome: true }))).toEqual(
      ["opening", "income_type", "document_upload", "joint_documents", "processing", "submitted"]);
  });
});
