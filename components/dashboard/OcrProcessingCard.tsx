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
 * Uses Framer Motion to animate width from 0 → target% when running,
 * and to 100% when success. Shows a green check when done.
 */
function FileRow({ label, targetPercent, ocrStatus }: FileRowProps) {
  const isIdle = ocrStatus === "idle";
  const isRunning = ocrStatus === "running";
  const isDone = ocrStatus === "success";

  const barWidth = isIdle ? "0%" : isDone ? "100%" : `${targetPercent}%`;
  const barColor = isDone ? "bg-nx-ok" : "bg-nx-blue";

  return (
    <div className="flex flex-col gap-0.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          <FileText
            size={10}
            className={cn(isIdle ? "text-gray-300" : "text-nx-blue")}
          />
          <span className="text-[9px] font-medium text-nx-ink">{label}</span>
        </div>
        <div className="flex items-center gap-1">
          {isRunning && (
            <span className="text-[8px] text-nx-muted">Mengekstrak data…</span>
          )}
          {isDone && (
            <CheckCircle2 size={10} className="text-nx-ok" />
          )}
        </div>
      </div>

      {/* Progress bar track */}
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
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
        <span className="text-[8px] text-nx-muted">
          {isIdle ? "" : isDone ? "100%" : `${targetPercent}%`}
        </span>
      </div>
    </div>
  );
}

/**
 * OcrProcessingCard — shows extraction progress for Slip Gaji and Mutasi Rekening.
 * Driven by `ocrStatus` from useOrchestrationFeed.
 */
export function OcrProcessingCard({ ocrStatus }: OcrProcessingCardProps) {
  return (
    <div className="flex flex-col rounded-xl border border-nx-line bg-white p-2 shadow-sm">
      {/* Section label */}
      <div className="mb-2 flex items-center gap-1">
        <span className="text-[9px] font-bold uppercase tracking-widest text-nx-muted">
          OCR Processing
        </span>
        {ocrStatus === "running" && (
          <span className="text-[8px] text-nx-blue">… Processing…</span>
        )}
      </div>

      {/* File rows */}
      <div className="flex flex-col gap-2">
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
