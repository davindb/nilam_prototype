import type { SlikResult } from "@/types/engines";

export const SLIK_NASABAH: SlikResult = {
  found: true,
  facilities: [
    { lender: "Bank BRI", type: "KKB (Kredit Kendaraan)", installment: 1_800_000 },
    { lender: "Bank Lain", type: "Kartu Kredit", installment: 700_000 },
  ],
  totalAngsuran: 2_500_000,
  reasoning: "2 fasilitas aktif terdeteksi; total angsuran berjalan Rp2.500.000 (kolektibilitas lancar).",
};
export const SLIK_PASANGAN: SlikResult = {
  found: true,
  facilities: [{ lender: "Bank BRI", type: "KUR Mikro", installment: 1_500_000 }],
  totalAngsuran: 1_500_000,
  reasoning: "1 fasilitas aktif terdeteksi; total angsuran berjalan Rp1.500.000 (kolektibilitas lancar).",
};
