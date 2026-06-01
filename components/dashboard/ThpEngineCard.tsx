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
 * ThpEngineCard — Row C, center column.
 * Shows the formula chips, THP Nasabah, THP Pasangan, and THP Total.
 * All numbers animate on change via useCountUp.
 */
export function ThpEngineCard({ nasabah, pasangan, isJoint }: ThpEngineCardProps) {
  const pending = !nasabah;

  // Compute live values (safe defaults if pending)
  const nThp = nasabah ? computeThp(nasabah) : null;
  const pThp = pasangan ? computeThp(pasangan) : null;
  const joint = nasabah ? computeJointThp(nasabah, isJoint ? pasangan : undefined) : null;

  const nasabahThp = nThp?.thp ?? 0;
  const pasanganThp = pThp?.thp ?? 0;
  const totalThp = joint?.total ?? 0;

  // Formula chips: one per component + angsuran
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
    <div className="flex flex-col rounded-xl border border-nx-line bg-white px-2 py-1.5 shadow-sm">
      {/* Header */}
      <span className="mb-1 block text-[8px] font-bold uppercase tracking-widest text-nx-muted leading-none">
        THP Calculation Engine
      </span>

      {pending ? (
        <div className="flex flex-1 items-center justify-center py-4">
          <span className="text-[9px] italic text-gray-300">Menunggu…</span>
        </div>
      ) : (
        <>
          {/* RUMUS (formula chips) */}
          <div className="mb-1.5">
            <span className="text-[7px] font-semibold uppercase tracking-wider text-nx-muted">
              Rumus
            </span>
            <div className="mt-0.5 flex flex-wrap items-center gap-0.5">
              {formulaChips.map((chip, i) => (
                <div key={chip.label} className="flex items-center gap-0.5">
                  {i > 0 && (
                    <span
                      className={cn(
                        "text-[8px] font-bold",
                        chip.type === "deduct" ? "text-red-400" : "text-nx-muted",
                      )}
                    >
                      {chip.type === "deduct" ? "−" : "+"}
                    </span>
                  )}
                  <div
                    className={cn(
                      "flex flex-col items-center rounded px-1 py-0.5",
                      chip.type === "income"
                        ? "bg-nx-blue/10 text-nx-blue"
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

          {/* THP boxes row */}
          <div className="mb-1 grid grid-cols-2 gap-1">
            {/* THP Nasabah */}
            <div className="rounded-lg border border-nx-blue/20 bg-nx-blue/5 p-1.5">
              <span className="block text-[7px] font-semibold uppercase text-nx-muted leading-none mb-0.5">
                THP Nasabah
              </span>
              <AnimatedThp
                value={nasabahThp}
                className="block text-[12px] font-bold text-nx-blue leading-tight"
              />
            </div>

            {/* THP Pasangan */}
            <div
              className={cn(
                "rounded-lg border p-1.5",
                isJoint && pThp
                  ? "border-nx-blue/20 bg-nx-blue/5"
                  : "border-dashed border-nx-line bg-gray-50 opacity-50",
              )}
            >
              <span className="block text-[7px] font-semibold uppercase text-nx-muted leading-none mb-0.5">
                THP Pasangan
              </span>
              {isJoint && pThp ? (
                <AnimatedThp
                  value={pasanganThp}
                  className="block text-[12px] font-bold text-nx-blue leading-tight"
                />
              ) : (
                <span className="block text-[12px] font-bold text-nx-muted leading-tight">—</span>
              )}
            </div>
          </div>

          {/* THP Total — headline */}
          <div className="rounded-lg border border-nx-blue/30 bg-gradient-to-br from-nx-blue/10 to-indigo-50 p-1.5">
            <span className="block text-[7px] font-semibold uppercase text-nx-muted leading-none mb-0.5">
              {isJoint ? "THP Total (Joint Income)" : "THP Total"}
            </span>
            <AnimatedThp
              value={totalThp}
              className="block text-[16px] font-extrabold text-nx-blue leading-tight"
            />
          </div>
        </>
      )}
    </div>
  );
}
