"use client";

import { cn } from "@/lib/cn";
import { formatRupiah } from "@/lib/formatRupiah";
import { adjusted } from "@/engines/thp/thpEngine";
import type { CustomerIncome, ComponentKey, ComponentMode } from "@/types/income";

interface IncomeComponentsCardProps {
  title: string;
  income: CustomerIncome | undefined;
  onMode: (key: ComponentKey, mode: ComponentMode) => void;
  onWeight: (key: ComponentKey, weight: number) => void;
  /** When true, renders a non-interactive "stripped" view (non-joint pasangan) */
  stripped?: boolean;
}

/**
 * IncomeComponentsCard — Row C, col 1 or col 3.
 *
 * A compact table: Komponen | Mode | Nilai Dasar | Bobot | Adjusted
 * One row per income component (Gaji, THR, Bonus, Insentif).
 * Below: Angsuran Bulanan (SLIK) in red.
 */
export function IncomeComponentsCard({
  title,
  income,
  onMode,
  onWeight,
  stripped = false,
}: IncomeComponentsCardProps) {
  const isStripped = stripped || !income;
  const pending = !income;

  return (
    <div
      className={cn(
        "flex flex-col rounded-xl border border-nx-line bg-white px-2 py-1.5 shadow-sm",
        isStripped && !pending && "opacity-60",
      )}
    >
      {/* Header */}
      <div className="mb-1 flex items-center justify-between gap-1">
        <span className="text-[8px] font-bold uppercase tracking-widest text-nx-muted leading-none">
          {title}
        </span>
        {isStripped && !pending && (
          <span className="rounded-full bg-gray-100 px-1.5 py-0.5 text-[7px] font-semibold text-nx-muted">
            Non-Joint
          </span>
        )}
      </div>

      {/* Pending state */}
      {pending ? (
        <div className="flex flex-1 items-center justify-center py-2">
          <span className="text-[9px] italic text-gray-300">Menunggu ekstraksi…</span>
        </div>
      ) : (
        <>
          {/* Table */}
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="pb-0.5 text-left text-[7px] font-semibold uppercase text-nx-muted w-[18%]">Komponen</th>
                <th className="pb-0.5 text-center text-[7px] font-semibold uppercase text-nx-muted w-[20%]">Mode</th>
                <th className="pb-0.5 text-right text-[7px] font-semibold uppercase text-nx-muted w-[22%]">Nilai Dasar</th>
                <th className="pb-0.5 text-center text-[7px] font-semibold uppercase text-nx-muted w-[22%]">Bobot</th>
                <th className="pb-0.5 text-right text-[7px] font-semibold uppercase text-nx-muted w-[18%]">Adjusted</th>
              </tr>
            </thead>
            <tbody>
              {income.components.map((comp) => {
                const base = comp.mode === "avg" ? comp.avg : comp.min;
                const adj = adjusted(comp);
                return (
                  <tr key={comp.key} className="border-t border-nx-line/50">
                    {/* Komponen */}
                    <td className="py-0.5 pr-1 text-[9px] font-medium text-nx-ink">{comp.key}</td>

                    {/* Mode toggle */}
                    <td className="py-0.5 px-0.5">
                      <div className="flex items-center justify-center gap-0.5">
                        {(["avg", "min"] as ComponentMode[]).map((m) => (
                          <button
                            key={m}
                            disabled={isStripped}
                            onClick={() => !isStripped && onMode(comp.key, m)}
                            className={cn(
                              "rounded px-1 py-0.5 text-[7px] font-semibold uppercase leading-none transition-colors",
                              comp.mode === m
                                ? "bg-nx-blue text-white"
                                : "bg-gray-100 text-nx-muted hover:bg-gray-200",
                              isStripped && "cursor-default",
                            )}
                          >
                            {m}
                          </button>
                        ))}
                      </div>
                    </td>

                    {/* Nilai Dasar */}
                    <td className="py-0.5 text-right text-[8.5px] text-nx-ink pr-1">
                      {isStripped ? "—" : formatRupiah(base)}
                    </td>

                    {/* Bobot */}
                    <td className="py-0.5 px-1">
                      {isStripped ? (
                        <span className="block text-center text-[8.5px] text-nx-muted">—</span>
                      ) : (
                        <div className="flex items-center gap-0.5">
                          <input
                            type="range"
                            min={0}
                            max={1}
                            step={0.05}
                            value={comp.weight}
                            onChange={(e) => onWeight(comp.key, parseFloat(e.target.value))}
                            className="h-1.5 w-full cursor-pointer accent-[#2563EB]"
                          />
                          <span className="w-6 shrink-0 text-right text-[7.5px] text-nx-muted">
                            {comp.weight.toFixed(2)}
                          </span>
                        </div>
                      )}
                    </td>

                    {/* Adjusted */}
                    <td className="py-0.5 text-right">
                      <span
                        className={cn(
                          "text-[9px] font-bold",
                          isStripped ? "text-nx-muted" : "text-nx-blue",
                        )}
                      >
                        {isStripped ? "—" : formatRupiah(adj)}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Angsuran row */}
          <div className="mt-1 flex items-center justify-between border-t border-nx-line pt-1">
            <span className="text-[8px] font-medium text-nx-muted">
              Angsuran Bulanan (SLIK)
            </span>
            <span className="text-[9px] font-bold text-red-500">
              {isStripped ? "—" : formatRupiah(income.angsuran)}
            </span>
          </div>
        </>
      )}
    </div>
  );
}
