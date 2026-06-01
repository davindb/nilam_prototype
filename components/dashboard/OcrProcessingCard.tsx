"use client";

import { FileText, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/cn";
import type { NodeStatus } from "@/types/orchestration";

interface OcrProcessingCardProps {
  ocrStatus: NodeStatus;
}

interface FileRowProps {
  label: string;
  targetPercent: number;
  ocrStatus: NodeStatus;
}

/**
 * Animated progress bar row for a single OCR document.
 * Shows label + subtitle beneath it, progress bar, and percent.
 * States:
 *   idle    → subtitle "Menunggu dokumen", bar empty
 *   running → subtitle "Mengekstrak data..", bar animating
 *   success → subtitle "Data berhasil diekstrak", bar full + green check
 */
function FileRow({ label, targetPercent, ocrStatus }: FileRowProps) {
  const isIdle = ocrStatus === "idle";
  const isRunning = ocrStatus === "running";
  const isDone = ocrStatus === "success";

  const barWidth = isIdle ? "0%" : isDone ? "100%" : `${targetPercent}%`;
  const barColor = isDone ? "bg-emerald-500" : "bg-bri-blue";

  const subtitle = isIdle
    ? "Menunggu dokumen"
    : isRunning
    ? "Mengekstrak data.."
    : "Data berhasil diekstrak";

  const subtitleColor = isDone
    ? "text-emerald-600"
    : isRunning
    ? "text-bri-blue"
    : "text-bri-muted/60";

  return (
    <div className="flex flex-col gap-0.5">
      {/* Label row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          <FileText
            size={10}
            className={cn(isIdle ? "text-bri-line" : isDone ? "text-emerald-500" : "text-bri-blue")}
          />
          <span className="text-[9px] font-medium text-bri-ink">{label}</span>
        </div>
        {isDone && (
          <CheckCircle2 size={10} className="text-emerald-500" strokeWidth={2.5} />
        )}
      </div>

      {/* Subtitle */}
      <span className={cn("text-[8px] pl-4 leading-none", subtitleColor)}>
        {subtitle}
      </span>

      {/* Progress bar track */}
      <div className="mt-0.5 h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
        <motion.div
          className={cn("h-full rounded-full", barColor)}
          initial={{ width: "0%" }}
          animate={{ width: barWidth }}
          transition={{
            duration: isIdle ? 0 : isDone ? 0.4 : 1.8,
            ease: isDone ? "easeOut" : "easeInOut",
          }}
        />
      </div>

      {/* Percent label */}
      <div className="flex justify-end">
        <span className="text-[8px] text-bri-muted">
          {isIdle ? "" : isDone ? "100%" : `${targetPercent}%`}
        </span>
      </div>
    </div>
  );
}

/**
 * OcrProcessingCard — shows extraction progress for Slip Gaji and Mutasi Rekening.
 * Each document row has a subtitle reflecting current state.
 * Card sizes to its content (header + 2 rows), no empty bottom.
 */
export function OcrProcessingCard({ ocrStatus }: OcrProcessingCardProps) {
  return (
    <div className="flex h-full flex-col rounded-xl border border-bri-line bg-white px-2.5 py-2 shadow-soft">
      {/* Section label */}
      <div className="mb-2 flex shrink-0 items-center gap-1">
        <span className="text-[9px] font-semibold uppercase tracking-[0.12em] text-bri-muted">
          OCR Processing
        </span>
        {ocrStatus === "running" && (
          <span className="text-[8px] text-bri-blue">… Processing…</span>
        )}
      </div>

      {/* File rows — flex-1 with justify-between to fill card height evenly */}
      <div className="flex flex-1 flex-col justify-between gap-1">
        <FileRow
          label="Slip Gaji"
          targetPercent={76}
          ocrStatus={ocrStatus}
        />
        <FileRow
          label="Mutasi Rekening"
          targetPercent={62}
          ocrStatus={ocrStatus}
        />
      </div>
    </div>
  );
}
