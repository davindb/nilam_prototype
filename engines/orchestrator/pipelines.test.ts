import { describe, it, expect } from "vitest";
import { PIPELINE_NODES, buildPipeline } from "./pipelines";
import { PERSONAS } from "@/data/personas";

const EXPECTED_ORDER = ["upload", "ocr", "validasi", "fraud", "identity", "slik", "income", "thp"];

describe("PIPELINE_NODES", () => {
  it("has exactly 8 nodes", () => {
    expect(PIPELINE_NODES).toHaveLength(8);
  });

  it("has nodes in the exact order: upload, ocr, validasi, fraud, identity, slik, income, thp", () => {
    expect(PIPELINE_NODES.map((n) => n.nodeId)).toEqual(EXPECTED_ORDER);
  });

  it("upload node has correct label", () => {
    expect(PIPELINE_NODES.find((n) => n.nodeId === "upload")?.label).toBe("Upload");
  });

  it("ocr node has correct label", () => {
    expect(PIPELINE_NODES.find((n) => n.nodeId === "ocr")?.label).toBe("OCR");
  });

  it("validasi node has correct label", () => {
    expect(PIPELINE_NODES.find((n) => n.nodeId === "validasi")?.label).toBe("Validasi Dokumen");
  });

  it("fraud node has correct label", () => {
    expect(PIPELINE_NODES.find((n) => n.nodeId === "fraud")?.label).toBe("Fraud Detection");
  });

  it("identity node has correct label", () => {
    expect(PIPELINE_NODES.find((n) => n.nodeId === "identity")?.label).toBe("Identity Check");
  });

  it("slik node has correct label", () => {
    expect(PIPELINE_NODES.find((n) => n.nodeId === "slik")?.label).toBe("SLIK Retrieval");
  });

  it("income node has correct label", () => {
    expect(PIPELINE_NODES.find((n) => n.nodeId === "income")?.label).toBe("Income Extraction");
  });

  it("thp node has correct label", () => {
    expect(PIPELINE_NODES.find((n) => n.nodeId === "thp")?.label).toBe("THP Engine");
  });
});

describe("buildPipeline", () => {
  it("returns the same 8 nodes for all personas (uniform pipeline)", () => {
    for (const persona of PERSONAS) {
      const nodes = buildPipeline(persona);
      expect(nodes.map((n) => n.nodeId)).toEqual(EXPECTED_ORDER);
    }
  });

  it("returns PIPELINE_NODES reference for any persona", () => {
    for (const persona of PERSONAS) {
      expect(buildPipeline(persona)).toBe(PIPELINE_NODES);
    }
  });
});
