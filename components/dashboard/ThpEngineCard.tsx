"use client";

import { cn } from "@/lib/cn";
import { formatRupiah } from "@/lib/formatRupiah";
import { computeThp, computeJointThp } from "@/engines/thp/thpEngine";
import { useCountUp } from "@/hooks/useCountUp";
import type { CustomerIncome } from "@/types/income";

interface ThpEngineCardProps {
  nasabah: CustomerIncome | undefined;
  pasangan: CustomerIncome | undefined;
  isJoint: boolean;
}

/** Animated THP value display using count-up */
function AnimatedThp({
  value,
  className,
}: {
  value: number;
  className?: string;
}) {
  const displayed = useCountUp(value, 400);
  return <span className={className}>{formatRupiah(displayed)}</span>;
}

/**
 * ThpEngineCard — Row C, rightmost column.
 *
 * Layout: flex h-full flex-col so card fills its grid cell.
 * Header shrink-0; body flex-1 with justify-between so:
 *   RUMUS chips → THP Nasabah/Pasangan boxes → THP Total
 * are evenly distributed to fill the card height with no empty hole.
 */
export function ThpEngineCard({ nasabah, pasangan, isJoint }: ThpEngineCardProps) {
  const pending = !nasabah;

  const nThp = nasabah ? computeThp(nasabah) : null;
  const pThp = pasangan ? computeThp(pasangan) : null;
  const joint = nasabah ? computeJointThp(nasabah, isJoint ? pasangan : undefined) : null;

  const nasabahThp = nThp?.thp ?? 0;
  const pasanganThp = pThp?.thp ?? 0;
  const totalThp = joint?.total ?? 0;

  const formulaChips = nThp
    ? [
        { label: "Adj. Gaji",     value: nThp.adjusted["Gaji"],     type: "income" as const },
        { label: "Adj. THR",      value: nThp.adjusted["THR"],      type: "income" as const },
        { label: "Adj. Bonus",    value: nThp.adjusted["Bonus"],    type: "income" as const },
        { label: "Adj. Insentif", value: nThp.adjusted["Insentif"], type: "income" as const },
        { label: "Angsuran",      value: nThp.angsuran,             type: "deduct" as const },
      ]
    : [];

  return (
    <div className="flex h-full flex-col rounded-xl border border-bri-line bg-white px-2 py-1.5 shadow-soft">
      {/* Header */}
      <span className="mb-1 block shrink-0 text-[8px] font-semibold uppercase tracking-[0.12em] text-bri-muted leading-none">
        THP Calculation Engine
      </span>

      {pending ? (
        <div className="flex flex-1 items-center justify-center">
          <span className="text-[9px] italic text-bri-muted/40">Menunggu…</span>
        </div>
      ) : (
        /* Body — flex-1 with justify-between: RUMUS | THP boxes | Total */
        <div className="flex flex-1 flex-col justify-between gap-1">
          {/* RUMUS (formula chips) */}
          <div>
            <span className="text-[7px] font-semibold uppercase tracking-wider text-bri-muted">
              Rumus
            </span>
            <div className="mt-0.5 flex flex-wrap items-center gap-0.5">
              {formulaChips.map((chip, i) => (
                <div key={chip.label} className="flex items-center gap-0.5">
                  {i > 0 && (
                    <span
                      className={cn(
                        "text-[8px] font-bold",
                        chip.type === "deduct" ? "text-red-400" : "text-bri-muted",
                      )}
                    >
                      {chip.type === "deduct" ? "−" : "+"}
                    </span>
                  )}
                  <div
                    className={cn(
                      "flex flex-col items-center rounded px-1 py-0.5",
                      chip.type === "income"
                        ? "bg-bri-bg text-bri-blue"
                        : "bg-red-50 text-red-500",
                    )}
                  >
                    <span className="text-[6.5px] font-semibold leading-none">{chip.label}</span>
                    <span className="text-[7.5px] font-bold leading-tight">
                      {formatRupiah(chip.value)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* THP boxes — joint: [Nasabah|Pasangan] then THP Total below
                          non-joint: [Nasabah | Total] side by side, both prominent */}
          {isJoint ? (
            /* Joint — keep 3-section vertical layout: RUMUS · [N|P] · Total */
            <div className="grid grid-cols-2 gap-1">
              {/* THP Nasabah */}
              <div className="rounded-lg border border-bri-navy/20 bg-bri-bg p-1.5">
                <span className="block text-[7px] font-semibold uppercase text-bri-muted leading-none mb-0.5">
                  THP Nasabah
                </span>
                <AnimatedThp
                  value={nasabahThp}
                  className="block text-[12px] font-bold text-bri-navy leading-tight"
                />
              </div>

              {/* THP Pasangan — joint mode */}
              <div className="rounded-lg border border-bri-navy/20 bg-bri-bg p-1.5">
                <span className="block text-[7px] font-semibold uppercase text-bri-muted leading-none mb-0.5">
                  THP Pasangan
                </span>
                {pThp ? (
                  <AnimatedThp
                    value={pasanganThp}
                    className="block text-[12px] font-bold text-bri-navy leading-tight"
                  />
                ) : (
                  <span className="block text-[12px] font-bold text-bri-muted leading-tight">—</span>
                )}
              </div>
            </div>
          ) : (
            /* Non-joint: Nasabah + Total side by side, both prominent, no Pasangan box */
            <div className="grid grid-cols-2 gap-2">
              {/* THP Nasabah — wider box */}
              <div className="rounded-lg border border-bri-navy/20 bg-bri-bg p-2">
                <span className="block text-[7px] font-semibold uppercase text-bri-muted leading-none mb-1">
                  THP Nasabah
                </span>
                <AnimatedThp
                  value={nasabahThp}
                  className="block text-[14px] font-bold text-bri-navy leading-tight"
                />
              </div>

              {/* THP Total — highlighted, same row */}
              <div className="rounded-lg border border-bri-navy/25 bg-gradient-to-br from-bri-bg to-bri-bg/60 p-2">
                <span className="block text-[7px] font-semibold uppercase text-bri-muted leading-none mb-1">
                  THP Total
                </span>
                <AnimatedThp
                  value={totalThp}
                  className="block text-[14px] font-extrabold text-bri-navy leading-tight"
                />
              </div>
            </div>
          )}

          {/* THP Total — full-width headline pinned at bottom (joint only) */}
          {isJoint && (
            <div className="rounded-lg border border-bri-navy/25 bg-gradient-to-br from-bri-bg to-bri-bg/60 p-1.5">
              <span className="block text-[7px] font-semibold uppercase text-bri-muted leading-none mb-0.5">
                THP Total (Joint Income)
              </span>
              <AnimatedThp
                value={totalThp}
                className="block text-[16px] font-extrabold text-bri-navy leading-tight"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
