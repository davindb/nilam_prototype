/**
 * Rupiah formatting helpers for NILAM income cards.
 */

/**
 * Formats a number as Indonesian Rupiah.
 * Example: 10_000_000 → "Rp10.000.000"
 */
export function formatRupiah(n: number): string {
  return "Rp" + n.toLocaleString("id-ID");
}

/**
 * Compact Rupiah variant for tight UI spots.
 * Example: 10_500_000 → "Rp10,5 jt", 10_000_000 → "Rp10 jt"
 */
export function formatJuta(n: number): string {
  const jt = n / 1_000_000;
  const rounded = Math.round(jt * 10) / 10;
  const formatted = rounded % 1 === 0 ? String(rounded) : String(rounded).replace(".", ",");
  return `Rp${formatted} jt`;
}
