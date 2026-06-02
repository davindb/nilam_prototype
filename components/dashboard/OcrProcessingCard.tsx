"use client";

import { useState } from "react";
import { FileText, CheckCircle2, AlertTriangle, SlidersHorizontal } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/cn";
import { DEMO_CONTROLS } from "@/lib/demo";
import { analyzeOcrCoverage } from "@/engines/ocr/coverage";
import {
  SLIP_MONTHS_FULL,
  MUTASI_MONTHS_FULL,
  MUTASI_MONTHS_GAP,
  MUTASI_MIN_MONTHS,
} from "@/data/ocrFixtures";
import type { NodeStatus } from "@/types/orchestration";

interface OcrProcessingCardProps {
  ocrStatus: NodeStatus;
}

interface DocSectionProps {
  title: string;
  /** Detected month keys ("YYYY-MM"). */
  monthKeys: string[];
  /** When true, run full gap analysis (X-of-Y + interior gaps). Mutasi only. */
  showCoverage: boolean;
  /** Minimum required months (only used when showCoverage). */
  minMonths?: number;
  /** Progress percent shown while running. */
  targetPercent: number;
  ocrStatus: NodeStatus;
}

/**
 * One document type inside the OCR card.
 *   idle    → "Menunggu dokumen", empty bar
 *   running → "Mengekstrak data..", animated bar
 *   success → period (first–last month) + per-month chips. For mutasi
 *             (showCoverage) it also reports "X dari Y bulan terdeteksi" and
 *             flags any interior gap; slip gaji just shows it was extracted.
 */
function DocSection({ title, monthKeys, showCoverage, minMonths = 0, targetPercent, ocrStatus }: DocSectionProps) {
  const isIdle = ocrStatus === "idle";
  const isRunning = ocrStatus === "running";
  const isDone = ocrStatus === "success";

  const cov = analyzeOcrCoverage(monthKeys, minMonths);
  const missingKeys = new Set(cov.missing.map((m) => m.key));
  const hasGap = showCoverage && !cov.isComplete;

  const barWidth = isIdle ? "0%" : isDone ? "100%" : `${targetPercent}%`;
  const barColor = isDone ? "bg-emerald-500" : "bg-bri-blue";

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-1">
      {/* Header: icon + title + file count + status icon */}
      <div className="flex items-center gap-1">
        <FileText
          size={11}
          className={cn(isIdle ? "text-bri-line" : isDone ? "text-emerald-500" : "text-bri-blue")}
        />
        <span className="text-[9px] font-semibold text-bri-ink">{title}</span>
        {!isIdle && (
          <span className="rounded-pill bg-bri-bg px-1.5 py-px text-[8px] font-medium text-bri-muted">
            {monthKeys.length} file
          </span>
        )}
        {isDone &&
          (hasGap ? (
            <AlertTriangle size={11} className="ml-auto text-amber-500" strokeWidth={2.5} />
          ) : (
            <CheckCircle2 size={11} className="ml-auto text-emerald-500" strokeWidth={2.5} />
          ))}
      </div>

      {!isDone ? (
        /* idle / running → subtitle + progress bar */
        <>
          <span className={cn("pl-4 text-[8px] leading-none", isRunning ? "text-bri-blue" : "text-bri-muted/60")}>
            {isIdle ? "Menunggu dokumen" : "Mengekstrak data.."}
          </span>
          <div className="mt-0.5 h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
            <motion.div
              className={cn("h-full rounded-full", barColor)}
              initial={{ width: "0%" }}
              animate={{ width: barWidth }}
              transition={{ duration: isIdle ? 0 : 1.8, ease: "easeInOut" }}
            />
          </div>
        </>
      ) : (
        /* success → period + chips + status */
        <>
          <span className="pl-4 text-[8px] leading-none text-bri-muted">
            {showCoverage ? "Bulan awal–akhir" : "Periode"}:{" "}
            <span className="font-medium text-bri-ink">{cov.rangeLabel}</span>
          </span>

          {/* Per-month checklist chips */}
          <div className="mt-0.5 flex flex-wrap gap-1">
            {cov.expected.map((m) => {
              const missing = missingKeys.has(m.key);
              return (
                <span
                  key={m.key}
                  title={missing ? `${m.label} — tidak ditemukan` : m.label}
                  className={cn(
                    "rounded px-1 py-px text-[8px] font-medium leading-none",
                    missing
                      ? "border border-dashed border-amber-400 bg-amber-50 text-amber-600"
                      : "bg-emerald-50 text-emerald-700"
                  )}
                >
                  {m.short}
                </span>
              );
            })}
          </div>

          {/* Status line — single line so the fixed-height card never clips */}
          {showCoverage ? (
            <span
              className={cn(
                "mt-auto flex items-center gap-1 pt-0.5 text-[8px] font-semibold",
                hasGap ? "text-amber-600" : "text-emerald-600"
              )}
            >
              {hasGap ? (
                <AlertTriangle size={9} strokeWidth={2.5} className="shrink-0" />
              ) : (
                <CheckCircle2 size={9} strokeWidth={2.5} className="shrink-0" />
              )}
              {cov.detected.length} dari {cov.expected.length} bulan terdeteksi
              {hasGap && (
                <span className="font-medium">
                  {" "}· hilang: {cov.missing.map((m) => m.label).join(", ")}
                </span>
              )}
            </span>
          ) : (
            <span className="mt-auto flex items-center gap-1 pt-0.5 text-[8px] font-medium text-emerald-600">
              <CheckCircle2 size={9} strokeWidth={2.5} />
              Data berhasil diekstrak
            </span>
          )}
        </>
      )}
    </div>
  );
}

/**
 * OcrProcessingCard — extraction progress + per-month coverage. Slip Gaji shows
 * extracted months only; Mutasi Rekening runs gap analysis (X-of-12 + interior
 * gaps). A demo-only toggle (hidden in production via {@link DEMO_CONTROLS})
 * flips mutasi between complete data and a gap scenario.
 */
export function OcrProcessingCard({ ocrStatus }: OcrProcessingCardProps) {
  const [gapMode, setGapMode] = useState(false);

  return (
    <div className="flex h-full flex-col rounded-xl border border-bri-line bg-white px-2.5 py-2 shadow-soft">
      {/* Header: section label + demo toggle */}
      <div className="mb-2 flex shrink-0 items-center justify-between gap-1">
        <div className="flex items-center gap-1">
          <span className="text-[9px] font-semibold uppercase tracking-[0.12em] text-bri-muted">
            OCR Processing
          </span>
          {ocrStatus === "running" && (
            <span className="text-[8px] text-bri-blue">… Processing…</span>
          )}
        </div>

        {DEMO_CONTROLS && (
          <div
            className="flex items-center gap-0.5 rounded-md border border-bri-line bg-bri-bg/60 p-0.5"
            title="Demo: simulasi gap mutasi"
          >
            <SlidersHorizontal size={9} className="ml-0.5 text-bri-muted" aria-hidden="true" />
            <button
              type="button"
              onClick={() => setGapMode(false)}
              className={cn(
                "rounded px-1.5 py-0.5 text-[8px] font-semibold transition-colors",
                !gapMode ? "bg-bri-navy text-white" : "text-bri-muted hover:text-bri-ink"
              )}
            >
              Lengkap
            </button>
            <button
              type="button"
              onClick={() => setGapMode(true)}
              className={cn(
                "rounded px-1.5 py-0.5 text-[8px] font-semibold transition-colors",
                gapMode ? "bg-amber-500 text-white" : "text-bri-muted hover:text-bri-ink"
              )}
            >
              Gap
            </button>
          </div>
        )}
      </div>

      {/* Slip Gaji (no gap analysis) + Mutasi Rekening (full coverage) */}
      <div className="flex min-h-0 flex-1 flex-col gap-2">
        <DocSection
          title="Slip Gaji"
          monthKeys={SLIP_MONTHS_FULL}
          showCoverage={false}
          targetPercent={76}
          ocrStatus={ocrStatus}
        />
        <div className="h-px w-full shrink-0 bg-bri-line/70" />
        <DocSection
          title="Mutasi Rekening"
          monthKeys={gapMode ? MUTASI_MONTHS_GAP : MUTASI_MONTHS_FULL}
          showCoverage
          minMonths={MUTASI_MIN_MONTHS}
          targetPercent={62}
          ocrStatus={ocrStatus}
        />
      </div>
    </div>
  );
}
