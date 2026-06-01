"use client";

import { Landmark, CheckCircle2 } from "lucide-react";
import type { NodeStatus } from "@/types/orchestration";
import type { SlikResult } from "@/types/engines";

interface SlikRetrievalCardProps {
  status: NodeStatus;
  slik: SlikResult | undefined;
}

/** Format a number as Indonesian Rupiah: Rp150.000.000 */
function fmtRp(value: number): string {
  return "Rp" + value.toLocaleString("id-ID");
}

/** Label / value row used in the SLIK card. */
function SlikRow({
  label,
  value,
  valueClassName,
}: {
  label: string;
  value: string;
  valueClassName?: string;
}) {
  return (
    <div className="flex items-start justify-between gap-1">
      <span className="shrink-0 text-[8.5px] text-nx-muted">{label}</span>
      <span
        className={
          valueClassName ??
          "text-right text-[8.5px] font-medium text-nx-ink"
        }
      >
        {value}
      </span>
    </div>
  );
}

/**
 * SlikRetrievalCard — Row B, third column.
 *
 * Shows outstanding kredit, angsuran bulanan, tunggakan, status, and a
 * prominent credit score. A "✓ Completed" badge appears in the header
 * when status === "success". Money values formatted as Rp with Indonesian
 * thousands separator (e.g. Rp150.000.000). Idle/running shows faint
 * "Menunggu SLIK…" placeholder.
 */
export function SlikRetrievalCard({ status, slik }: SlikRetrievalCardProps) {
  const isSuccess = status === "success" && !!slik;

  return (
    <div className="flex flex-col rounded-xl border border-nx-line bg-white px-2.5 py-2 shadow-sm">
      {/* Header */}
      <div className="mb-1.5 flex items-center justify-between gap-1">
        <span className="text-[9px] font-bold uppercase tracking-widest text-nx-muted">
          SLIK Retrieval
        </span>
        {isSuccess && (
          <div className="flex items-center gap-0.5 rounded-full bg-nx-okLight px-1.5 py-0.5">
            <CheckCircle2 size={8} className="text-nx-ok" strokeWidth={2.5} />
            <span className="text-[7.5px] font-semibold text-nx-ok">Completed</span>
          </div>
        )}
      </div>

      {!isSuccess ? (
        /* ── Idle / running ───────────────────────────────────── */
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-dashed border-gray-200 bg-gray-50">
            <Landmark size={16} className="text-gray-300" strokeWidth={1.5} />
          </div>
          <p className="text-[9px] italic text-gray-300">Menunggu SLIK…</p>
        </div>
      ) : (
        /* ── Success ──────────────────────────────────────────── */
        <div className="flex items-start gap-2">
          {/* SLIK icon tile */}
          <div className="flex h-10 w-10 shrink-0 flex-col items-center justify-center gap-0.5 rounded-lg border border-nx-blue/20 bg-nx-blue/5">
            <Landmark size={14} className="text-nx-blue" strokeWidth={1.5} />
          </div>

          {/* Data rows */}
          <div className="flex min-w-0 flex-1 flex-col gap-0.5">
            <SlikRow
              label="Outstanding Kredit"
              value={fmtRp(slik.outstanding)}
            />
            <SlikRow
              label="Angsuran Bulanan"
              value={fmtRp(slik.angsuranBulanan)}
            />
            <SlikRow
              label="Tunggakan"
              value={slik.tunggakan === 0 ? "0" : fmtRp(slik.tunggakan)}
            />
            <SlikRow
              label="Status"
              value={slik.status}
              valueClassName="text-right text-[8.5px] font-semibold text-nx-ok"
            />
          </div>
        </div>
      )}

      {/* Score — always shown but faint when idle */}
      {isSuccess && (
        <div className="mt-1.5 flex items-baseline gap-1 border-t border-nx-line pt-1.5">
          <span className="text-[9px] text-nx-muted">Score</span>
          <span className="text-[20px] font-bold leading-none text-nx-blue">
            {slik.score}
          </span>
        </div>
      )}
    </div>
  );
}
