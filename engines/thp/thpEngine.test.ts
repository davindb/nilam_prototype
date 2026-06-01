import { describe, it, expect } from "vitest";
import { adjusted, computeThp, computeJointThp } from "./thpEngine";
import type { CustomerIncome, IncomeComponent } from "@/types/income";

const comp = (over: Partial<IncomeComponent>): IncomeComponent => ({
  key: "Gaji", avg: 10_000_000, min: 10_000_000, mode: "avg", weight: 1, ...over,
});

const nasabah = (): CustomerIncome => ({
  role: "nasabah", name: "Nasabah", angsuran: 2_500_000,
  components: [
    comp({ key: "Gaji", avg: 10_000_000, min: 10_000_000 }),
    comp({ key: "THR", avg: 20_000_000, min: 20_000_000 }),
    comp({ key: "Bonus", avg: 30_000_000, min: 10_000_000 }),
    comp({ key: "Insentif", avg: 1_000_000, min: 1_000_000 }),
  ],
});

describe("adjusted", () => {
  it("uses avg * weight in avg mode (spec example: 10jt * 0.5 = 5jt)", () => {
    expect(adjusted(comp({ avg: 10_000_000, mode: "avg", weight: 0.5 }))).toBe(5_000_000);
  });
  it("uses min * weight in min mode", () => {
    expect(adjusted(comp({ min: 8_000_000, mode: "min", weight: 1 }))).toBe(8_000_000);
  });
});

describe("computeThp", () => {
  it("THP = sum(adjusted) - angsuran at full weight/avg", () => {
    const r = computeThp(nasabah());
    expect(r.grossBeforeAngsuran).toBe(61_000_000);
    expect(r.thp).toBe(58_500_000);
    expect(r.adjusted.Gaji).toBe(10_000_000);
  });
});

describe("computeJointThp", () => {
  it("total = nasabah.thp + pasangan.thp", () => {
    const p: CustomerIncome = { ...nasabah(), role: "pasangan", name: "Pasangan", angsuran: 1_500_000 };
    const r = computeJointThp(nasabah(), p);
    expect(r.total).toBe(r.nasabah.thp + (r.pasangan?.thp ?? 0));
  });
  it("total = nasabah.thp when no pasangan", () => {
    const r = computeJointThp(nasabah());
    expect(r.total).toBe(r.nasabah.thp);
  });
});
