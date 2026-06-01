"use client";

import { Calculator } from "lucide-react";
import { GlassCard } from "@/components/common/GlassCard";
import { SectionHeading } from "@/components/common/SectionHeading";
import { computeJointThp } from "@/engines/thp/thpEngine";
import { useCountUp } from "@/hooks/useCountUp";
import { formatRupiah, formatJuta } from "@/lib/formatRupiah";
import type { ComponentKey, CustomerIncome } from "@/types/income";

// Ordered component keys for formula display
const COMPONENT_KEYS: ComponentKey[] = ["Gaji", "THR", "Bonus", "Insentif"];

interface ThpEngineCardProps {
  nasabah: CustomerIncome;
  pasangan?: CustomerIncome;
}

// ---------------------------------------------------------------------------
// Formula chip: a small labeled number badge
// ---------------------------------------------------------------------------

function FormulaChip({
  label,
  value,
  tone = "neutral",
}: {
  label: string;
  value: number;
  tone?: "neutral" | "deduct";
}) {
  return (
    <span className="inline-flex flex-col items-center gap-0.5">
      <span className="text-[9px] font-semibold uppercase tracking-wide text-bri-muted">
        {label}
      </span>
      <span
        className={`rounded-pill px-2 py-0.5 text-[11px] font-bold tabular-nums ${
          tone === "deduct"
            ? "bg-red-50 text-red-500 ring-1 ring-red-200"
            : "bg-bri-bg text-bri-navy ring-1 ring-bri-line"
        }`}
      >
        {tone === "deduct" ? "− " : ""}
        {formatJuta(value)}
      </span>
    </span>
  );
}

// ---------------------------------------------------------------------------
// Single-customer THP block: formula + animated result
// ---------------------------------------------------------------------------

function ThpBlock({
  label,
  result,
}: {
  label: string;
  result: ReturnType<typeof computeJointThp>["nasabah"];
}) {
  const animatedThp = useCountUp(result.thp, 400);

  return (
    <div className="flex flex-col gap-3">
      {/* Role label */}
      <p className="text-[11px] font-semibold uppercase tracking-wide text-bri-muted">{label}</p>

      {/* Visual formula */}
      <div className="flex flex-wrap items-end gap-x-1.5 gap-y-2">
        {COMPONENT_KEYS.map((key, i) => (
          <span key={key} className="flex items-end gap-1.5">
            {i > 0 && <span className="pb-1 text-sm font-bold text-bri-muted">+</span>}
            <FormulaChip label={key} value={result.adjusted[key] ?? 0} />
          </span>
        ))}
        <span className="flex items-end gap-1.5">
          <span className="pb-1 text-sm font-bold text-red-400">−</span>
          <FormulaChip label="Angsuran" value={result.angsuran} tone="deduct" />
        </span>
        <span className="flex items-end gap-1.5">
          <span className="pb-1 text-sm font-bold text-bri-muted">=</span>
          <span className="flex flex-col items-center gap-0.5">
            <span className="text-[9px] font-semibold uppercase tracking-wide text-bri-muted">THP</span>
            <span className="rounded-pill bg-bri-navy px-3 py-0.5 text-[12px] font-bold tabular-nums text-white shadow-soft">
              {formatJuta(animatedThp)}
            </span>
          </span>
        </span>
      </div>

      {/* Explainable breakdown audit trail */}
      <div className="rounded-bubble bg-white/60 px-3 py-2 ring-1 ring-bri-line">
        <p className="mb-1.5 text-[9px] font-semibold uppercase tracking-wide text-bri-muted">
          Rincian Perhitungan
        </p>
        <div className="flex flex-col gap-1">
          {COMPONENT_KEYS.map((key) => {
            const val = result.adjusted[key] ?? 0;
            return (
              <div key={key} className="flex items-center justify-between">
                <span className="text-[11px] text-bri-muted">{key}</span>
                <span className="font-mono text-[11px] tabular-nums text-bri-ink">
                  {formatRupiah(val)}
                </span>
              </div>
            );
          })}
          <div className="my-1 border-t border-bri-line" />
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-bri-muted">Gross</span>
            <span className="font-mono text-[11px] tabular-nums text-bri-ink">
              {formatRupiah(result.grossBeforeAngsuran)}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-red-400">− Angsuran</span>
            <span className="font-mono text-[11px] tabular-nums text-red-500">
              {formatRupiah(result.angsuran)}
            </span>
          </div>
          <div className="flex items-center justify-between font-semibold">
            <span className="text-[11px] text-bri-navy">THP</span>
            <span className="font-mono text-[11px] tabular-nums text-bri-navy">
              {formatRupiah(animatedThp)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main card
// ---------------------------------------------------------------------------

/**
 * THP Calculation Engine card.
 *
 * Computes JointThp purely in render — instant recalc whenever nasabah/pasangan
 * props change (driven by hook state from slider interactions).
 */
export function ThpEngineCard({ nasabah, pasangan }: ThpEngineCardProps) {
  const joint = computeJointThp(nasabah, pasangan);
  const animatedTotal = useCountUp(joint.total, 400);

  return (
    <GlassCard className="overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-2.5 border-b border-bri-line px-4 py-3">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-bri-bg text-bri-blue">
          <Calculator size={15} strokeWidth={2.25} />
        </span>
        <SectionHeading>THP Calculation Engine</SectionHeading>
      </div>

      <div className="flex flex-col gap-5 px-4 py-4">
        {/* Nasabah block */}
        <ThpBlock label="THP Nasabah" result={joint.nasabah} />

        {/* Pasangan block — only for joint income */}
        {joint.pasangan && (
          <>
            <div className="border-t border-bri-line" />
            <ThpBlock label="THP Pasangan" result={joint.pasangan} />
          </>
        )}

        {/* Total THP — prominent summary band */}
        {joint.pasangan && (
          <div className="rounded-bubble bg-bri-bg px-4 py-3 ring-1 ring-bri-line">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wide text-bri-muted">
                  THP Total Keluarga
                </p>
                <p className="mt-0.5 text-[11px] text-bri-muted">
                  THP Nasabah + THP Pasangan
                </p>
              </div>
              <span className="text-xl font-bold tabular-nums text-bri-navy">
                {formatJuta(animatedTotal)}
              </span>
            </div>
          </div>
        )}

        {/* Single mode: just the THP summary band */}
        {!joint.pasangan && (
          <div className="rounded-bubble bg-bri-bg px-4 py-3 ring-1 ring-bri-line">
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-bri-muted">
                THP Nasabah
              </p>
              <span className="text-xl font-bold tabular-nums text-bri-navy">
                {formatJuta(animatedTotal)}
              </span>
            </div>
          </div>
        )}
      </div>
    </GlassCard>
  );
}
