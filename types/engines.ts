export interface OcrSlipResult { Gaji: number }
export interface OcrBucket { count: number; sum: number; min: number }
export interface OcrMutasiResult {
  Gaji: OcrBucket; THR: OcrBucket; Bonus: OcrBucket; Insentif: OcrBucket;
}
export interface FraudCheck { name: string; passed: boolean; score: number }
export interface FraudResult { passed: boolean; confidence: number; checks: FraudCheck[] }
export interface SlikFacility { lender: string; type: string; installment: number }
export interface SlikResult {
  found: boolean; facilities: SlikFacility[]; totalAngsuran: number; reasoning: string;
}
export interface IdentityResult {
  NIK: string; Nama: string; Gender: 'L' | 'P'; TanggalLahir: string; isPayrollBRI: boolean;
}
