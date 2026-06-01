import { describe, it, expect } from "vitest";
import { buildPipeline } from "./pipelines";
import { PERSONAS } from "@/data/personas";

const byId = (id: string) => PERSONAS.find((p) => p.id === id)!;

describe("buildPipeline", () => {
  describe("payroll-single", () => {
    const nodes = buildPipeline(byId("payroll-single"));

    it("starts with payroll_pull", () => {
      expect(nodes[0].nodeId).toBe("payroll_pull");
    });

    it("ends with thp_computation", () => {
      expect(nodes[nodes.length - 1].nodeId).toBe("thp_computation");
    });

    it("has no OCR nodes", () => {
      const ocrNodes = nodes.filter((n) => n.group === "ocr");
      expect(ocrNodes).toHaveLength(0);
    });

    it("has only nasabah leg nodes", () => {
      const pasanganNodes = nodes.filter((n) => n.leg === "pasangan");
      expect(pasanganNodes).toHaveLength(0);
    });
  });

  describe("nonpayroll-joint", () => {
    const nodes = buildPipeline(byId("nonpayroll-joint"));

    it("has both nasabah and pasangan legs", () => {
      const legs = new Set(nodes.map((n) => n.leg));
      expect(legs.has("nasabah")).toBe(true);
      expect(legs.has("pasangan")).toBe(true);
    });

    it("ends with thp_computation", () => {
      expect(nodes[nodes.length - 1].nodeId).toBe("thp_computation");
    });

    it("nasabah leg has OCR nodes", () => {
      const nasabahOcr = nodes.filter((n) => n.leg === "nasabah" && n.group === "ocr");
      expect(nasabahOcr.length).toBeGreaterThan(0);
    });

    it("pasangan leg has identity_ocr and liveness_selfie", () => {
      const identityNodes = nodes.filter((n) => n.leg === "pasangan" && n.group === "identity");
      const nodeIds = identityNodes.map((n) => n.nodeId);
      expect(nodeIds).toContain("identity_ocr");
      expect(nodeIds).toContain("liveness_selfie");
    });

    it("pasangan leg appears after nasabah leg income_extraction", () => {
      const nasabahIncomeIdx = nodes.findIndex(
        (n) => n.leg === "nasabah" && n.nodeId === "income_extraction"
      );
      const firstPasanganIdx = nodes.findIndex((n) => n.leg === "pasangan");
      expect(firstPasanganIdx).toBeGreaterThan(nasabahIncomeIdx);
    });
  });

  describe("payroll-joint", () => {
    const nodes = buildPipeline(byId("payroll-joint"));

    it("starts with payroll_pull on nasabah", () => {
      expect(nodes[0].nodeId).toBe("payroll_pull");
      expect(nodes[0].leg).toBe("nasabah");
    });

    it("has pasangan leg nodes", () => {
      const pasanganNodes = nodes.filter((n) => n.leg === "pasangan");
      expect(pasanganNodes.length).toBeGreaterThan(0);
    });

    it("ends with thp_computation", () => {
      expect(nodes[nodes.length - 1].nodeId).toBe("thp_computation");
    });
  });

  describe("nonpayroll-single", () => {
    const nodes = buildPipeline(byId("nonpayroll-single"));

    it("has no payroll_pull node", () => {
      expect(nodes.some((n) => n.nodeId === "payroll_pull")).toBe(false);
    });

    it("starts with ocr_slip on nasabah", () => {
      expect(nodes[0].nodeId).toBe("ocr_slip");
      expect(nodes[0].leg).toBe("nasabah");
    });

    it("ends with thp_computation", () => {
      expect(nodes[nodes.length - 1].nodeId).toBe("thp_computation");
    });

    it("has no pasangan leg", () => {
      expect(nodes.some((n) => n.leg === "pasangan")).toBe(false);
    });
  });
});
