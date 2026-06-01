import type { OcrSlipResult, OcrMutasiResult } from "@/types/engines";

export const SLIP_GAJI: OcrSlipResult = { Gaji: 10_000_000 };
export const MUTASI: OcrMutasiResult = {
  Gaji: { count: 12, sum: 120_000_000, min: 10_000_000 },
  THR: { count: 1, sum: 20_000_000, min: 20_000_000 },
  Bonus: { count: 2, sum: 60_000_000, min: 10_000_000 },
  Insentif: { count: 6, sum: 6_000_000, min: 1_000_000 },
};
export const SPOUSE_SLIP_GAJI: OcrSlipResult = { Gaji: 8_000_000 };
export const SPOUSE_MUTASI: OcrMutasiResult = {
  Gaji: { count: 12, sum: 96_000_000, min: 8_000_000 },
  THR: { count: 1, sum: 8_000_000, min: 8_000_000 },
  Bonus: { count: 2, sum: 24_000_000, min: 5_000_000 },
  Insentif: { count: 6, sum: 4_800_000, min: 500_000 },
};
export const KTP_PASANGAN = { NIK: "3201234567890002", Nama: "Damar Pratama", Gender: "L" as const, TanggalLahir: "1989-04-12", isPayrollBRI: false };
