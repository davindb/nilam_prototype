"use client";

import { User } from "lucide-react";
import { GlassCard } from "@/components/common/GlassCard";
import { IncomeComponentRow } from "./IncomeComponentRow";
import { formatRupiah } from "@/lib/formatRupiah";
import type { ComponentKey, ComponentMode, CustomerIncome } from "@/types/income";

interface CustomerCardProps {
  income: CustomerIncome;
  onMode: (key: ComponentKey, mode: ComponentMode) => void;
  onWeight: (key: ComponentKey, weight: number) => void;
}

/**
 * Customer income card: avatar + role header, 4 adjustable component rows,
 * read-only Angsuran footer sourced from SLIK.
 */
export function CustomerCard({ income, onMode, onWeight }: CustomerCardProps) {
  const isNasabah = income.role === "nasabah";
  const roleLabel = isNasabah ? "Nasabah" : "Pasangan Nasabah";

  // Initials for avatar circle
  const initials = income.name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  return (
    <GlassCard className="overflow-hidden">
      {/* ------------------------------------------------------------------ */}
      {/* Header: avatar + role + name                                         */}
      {/* ------------------------------------------------------------------ */}
      <div className="flex items-center gap-3 border-b border-bri-line px-4 py-3">
        <div
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-pill text-xs font-bold text-white ${
            isNasabah ? "bg-bri-navy" : "bg-bri-sky"
          }`}
        >
          {initials || <User size={14} />}
        </div>
        <div className="min-w-0">
          <p
            className={`text-[11px] font-semibold uppercase tracking-wide ${
              isNasabah ? "text-bri-blue" : "text-bri-sky"
            }`}
          >
            {roleLabel}
          </p>
          <p className="truncate text-sm font-semibold text-bri-ink">{income.name}</p>
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Income component rows                                                */}
      {/* ------------------------------------------------------------------ */}
      <div className="flex flex-col gap-2 px-4 py-3">
        {income.components.map((c) => (
          <IncomeComponentRow
            key={c.key}
            component={c}
            onMode={(mode) => onMode(c.key, mode)}
            onWeight={(weight) => onWeight(c.key, weight)}
          />
        ))}
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Angsuran — read-only, sourced from SLIK                              */}
      {/* ------------------------------------------------------------------ */}
      <div className="flex items-center justify-between gap-3 border-t border-bri-line bg-white/40 px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-bri-ink">Angsuran</span>
          <span className="rounded-pill bg-bri-bg px-2 py-0.5 text-[10px] font-semibold text-bri-blue">
            dari SLIK
          </span>
        </div>
        <span className="font-bold tabular-nums text-red-500 text-sm">
          − {formatRupiah(income.angsuran)}
        </span>
      </div>
    </GlassCard>
  );
}
