import type { PersonaConfig } from "@/types/flow";
import type { NodeSpec } from "@/types/orchestration";

export function buildPipeline(p: PersonaConfig): NodeSpec[] {
  const n: NodeSpec[] = [];

  // --- Nasabah leg ---
  if (p.isPayrollBRI) {
    n.push({ nodeId: "payroll_pull", leg: "nasabah", label: "Payroll Data Retrieval (BRI)", group: "payroll" });
  } else {
    n.push(
      { nodeId: "ocr_slip", leg: "nasabah", label: "OCR — Slip Gaji", group: "ocr" },
      { nodeId: "ocr_mutasi", leg: "nasabah", label: "OCR — Mutasi 12 Bulan", group: "ocr" },
      { nodeId: "doc_validation", leg: "nasabah", label: "Validasi Dokumen (≥12 bln)", group: "ocr" },
      { nodeId: "fraud_screening", leg: "nasabah", label: "Fraud Screening", group: "fraud" },
      { nodeId: "doc_classification", leg: "nasabah", label: "Klasifikasi Dokumen", group: "ocr" },
    );
  }
  n.push(
    { nodeId: "slik_retrieval", leg: "nasabah", label: "SLIK Retrieval (OJK) — Nasabah", group: "slik" },
    { nodeId: "income_extraction", leg: "nasabah", label: "Income Extraction — Nasabah", group: "income" },
  );

  // --- Pasangan leg (joint only) ---
  if (p.isJointIncome) {
    n.push(
      { nodeId: "identity_ocr", leg: "pasangan", label: "OCR — KTP Pasangan", group: "identity" },
      { nodeId: "liveness_selfie", leg: "pasangan", label: "Selfie vs KTP (Liveness)", group: "identity" },
    );
    if (p.spouseIsPayrollBRI) {
      n.push({ nodeId: "payroll_pull", leg: "pasangan", label: "Payroll Data Retrieval (BRI) — Pasangan", group: "payroll" });
    } else {
      n.push(
        { nodeId: "ocr_slip", leg: "pasangan", label: "OCR — Slip Gaji Pasangan", group: "ocr" },
        { nodeId: "ocr_mutasi", leg: "pasangan", label: "OCR — Mutasi Pasangan", group: "ocr" },
        { nodeId: "fraud_screening", leg: "pasangan", label: "Fraud Screening Pasangan", group: "fraud" },
      );
    }
    n.push(
      { nodeId: "slik_retrieval", leg: "pasangan", label: "SLIK Retrieval (OJK) — Pasangan", group: "slik" },
      { nodeId: "income_extraction", leg: "pasangan", label: "Income Extraction — Pasangan", group: "income" },
    );
  }

  // --- Final: THP (nasabah leg) ---
  n.push({ nodeId: "thp_computation", leg: "nasabah", label: "THP Computation", group: "thp" });
  return n;
}
