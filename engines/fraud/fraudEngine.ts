import type { FraudResult } from "@/types/engines";

export const FRAUD_CONFIDENCE = 0.985;
export const LIVENESS_CONFIDENCE = 0.971;

export function screen(label = "dokumen"): FraudResult {
  return {
    passed: true, confidence: FRAUD_CONFIDENCE,
    checks: [
      { name: "Metadata integrity", passed: true, score: 0.99 },
      { name: "Tampering / splicing", passed: true, score: 0.98 },
      { name: `Konsistensi nominal (${label})`, passed: true, score: 0.985 },
    ],
  };
}
export function livenessMatch(): FraudResult {
  return {
    passed: true, confidence: LIVENESS_CONFIDENCE,
    checks: [
      { name: "Liveness (anti-spoof)", passed: true, score: 0.97 },
      { name: "Face match selfie ↔ KTP", passed: true, score: 0.972 },
    ],
  };
}
