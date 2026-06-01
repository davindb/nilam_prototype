"use client";

import { CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/cn";
import type { NodeStatus } from "@/types/orchestration";
import type { FraudResult } from "@/types/engines";
import { SpiderChart } from "./SpiderChart";

interface FraudDetectionCardProps {
  status: NodeStatus;
  result: FraudResult | undefined;
}

/**
 * FraudDetectionCard — Row B, first column.
 *
 * Left: SpiderChart radar of the 4 fraud check scores.
 * Right: check list (name + score%) + Overall Confidence %.
 * Idle state shows a faint empty spider and "Menunggu…" text.
 */
export function FraudDetectionCard({ status, result }: FraudDetectionCardProps) {
  const isSuccess = status === "success" && !!result;

  // Build idle scores for the spider when no data yet (low, uniform)
  const idleScores = [0.15, 0.15, 0.15, 0.15];
  const chartScores = isSuccess
    ? result.checks.map((c) => c.score)
    : idleScores;

  return (
    <div className="flex flex-col rounded-xl bg-white px-2.5 py-2 shadow-soft ring-1 ring-bri-line min-h-0">
      {/* Header label */}
      <span className="mb-1.5 block text-[9px] font-semibold uppercase tracking-[0.12em] text-bri-muted">
        Fraud Detection
      </span>

      {/* Body */}
      {!isSuccess ? (
        /* ── Idle / running state ─────────────────────────────── */
        <div className="flex items-center gap-2">
          <div className="opacity-30">
            <SpiderChart scores={idleScores} size={88} />
          </div>
          <div className="flex flex-col gap-1">
            {["Slip Gaji", "Mutasi", "Konsistensi", "Pattern"].map((lbl) => (
              <div key={lbl} className="flex items-center gap-1">
                <div className="h-1.5 w-1.5 rounded-full bg-bri-line" />
                <span className="text-[9px] text-bri-muted/40">{lbl}</span>
              </div>
            ))}
            <p className="mt-1 text-[8px] italic text-bri-muted/40">Menunggu…</p>
          </div>
        </div>
      ) : (
        /* ── Success state ────────────────────────────────────── */
        <div className="flex items-start gap-2">
          {/* Spider chart */}
          <SpiderChart scores={chartScores} size={92} />

          {/* Check list + overall */}
          <div className="flex min-w-0 flex-1 flex-col gap-0.5">
            {result.checks.map((check) => (
              <div key={check.name} className="flex items-center justify-between gap-1">
                <div className="flex items-center gap-1 min-w-0">
                  <CheckCircle2
                    size={9}
                    className="shrink-0 text-emerald-500"
                    strokeWidth={2.5}
                  />
                  <span
                    className={cn(
                      "truncate text-[9px] font-medium text-bri-ink",
                    )}
                  >
                    {check.name}
                  </span>
                </div>
                <span className="shrink-0 text-[9px] font-semibold text-emerald-600">
                  {Math.round(check.score * 100)}%
                </span>
              </div>
            ))}

            {/* Overall confidence — prominent */}
            <div className="mt-1.5 flex items-baseline gap-1 border-t border-bri-line pt-1.5">
              <span className="text-[9px] text-bri-muted">Overall Confidence</span>
              <span className="text-[18px] font-bold leading-none text-emerald-500">
                {Math.round(result.overall * 100)}%
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
