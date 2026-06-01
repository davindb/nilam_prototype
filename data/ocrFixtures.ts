import type { OcrSlipResult, OcrMutasiResult, IdentityResult } from "@/types/engines";

export const SLIP_GAJI: OcrSlipResult = { Gaji: 10_000_000 };
export const MUTASI: OcrMutasiResult = {
  Gaji:    { count: 12, sum: 120_000_000, min: 10_000_000 },
  THR:     { count: 1,  sum: 20_000_000,  min: 20_000_000 },
  Bonus:   { count: 2,  sum: 60_000_000,  min: 10_000_000 },
  Insentif:{ count: 6,  sum: 6_000_000,   min: 1_000_000  },
};

export const IDENTITY_PASANGAN: IdentityResult = {
  NIK: "3271234567890001",
  Nama: "SITI NURHALIZA",
  Gender: "Perempuan",
  TanggalLahir: "12/05/1990",
};
