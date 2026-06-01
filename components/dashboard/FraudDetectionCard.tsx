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
 * Layout: flex h-full flex-col so card fills its grid cell.
 * Header shrink-0; body flex-1 so it expands.
 * Success state: spider chart left / checks right, confidence pinned at bottom.
 * Idle state: faint spider + "Menunggu…" centered.
 */
export function FraudDetectionCard({ status, result }: FraudDetectionCardProps) {
  const isSuccess = status === "success" && !!result;

  const idleScores = [0.15, 0.15, 0.15, 0.15];
  const chartScores = isSuccess
    ? result.checks.map((c) => c.score)
    : idleScores;

  return (
    <div className="flex h-full flex-col rounded-xl border border-bri-line bg-white px-2.5 py-2 shadow-soft">
      {/* Header label */}
      <span className="mb-1.5 block shrink-0 text-[9px] font-semibold uppercase tracking-[0.12em] text-bri-muted">
        Fraud Detection
      </span>

      {/* Body — flex-1, fills remaining height */}
      {!isSuccess ? (
        /* ── Idle / running state ─────────────────────────────── */
        <div className="flex flex-1 items-center gap-2">
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
        /* ── Success state — spider left / checks right, confidence pinned bottom ── */
        <div className="flex flex-1 flex-col min-h-0">
          {/* Main row: spider + check list */}
          <div className="flex flex-1 items-center gap-2 min-h-0">
            {/* Spider chart — vertically centered */}
            <div className="flex shrink-0 items-center">
              <SpiderChart scores={chartScores} size={92} />
            </div>

            {/* Check list — fills remaining width, distributes rows evenly */}
            <div className="flex min-w-0 flex-1 flex-col justify-between gap-0.5">
              {result.checks.map((check) => (
                <div key={check.name} className="flex items-center justify-between gap-1">
                  <div className="flex items-center gap-1 min-w-0">
                    <CheckCircle2
                      size={9}
                      className="shrink-0 text-emerald-500"
                      strokeWidth={2.5}
                    />
                    <span className="truncate text-[9px] font-medium text-bri-ink">
                      {check.name}
                    </span>
                  </div>
                  <span className="shrink-0 text-[9px] font-semibold text-emerald-600">
                    {Math.round(check.score * 100)}%
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Overall confidence — pinned at bottom */}
          <div className="mt-1.5 flex shrink-0 items-baseline gap-1 border-t border-bri-line pt-1.5">
            <span className="text-[9px] text-bri-muted">Overall Confidence</span>
            <span className="text-[18px] font-bold leading-none text-emerald-500">
              {Math.round(result.overall * 100)}%
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
