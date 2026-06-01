"use client";

import {
  Landmark,
  ScanLine,
  ShieldCheck,
  IdCard,
  Building2,
  Coins,
  Calculator,
  CheckCircle2,
  XCircle,
  Loader2,
  type LucideIcon,
} from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/cn";
import { ConfidenceMeter } from "./ConfidenceMeter";
import type { NodeSpec, NodeStatus, OrchestrationEvent } from "@/types/orchestration";
import type { NodeGroup } from "@/types/orchestration";

const GROUP_ICONS: Record<NodeGroup, LucideIcon> = {
  payroll: Landmark,
  ocr: ScanLine,
  fraud: ShieldCheck,
  identity: IdCard,
  slik: Building2,
  income: Coins,
  thp: Calculator,
};

interface PipelineNodeProps {
  spec: NodeSpec;
  status: NodeStatus;
  event?: OrchestrationEvent;
}

/**
 * Single engine pipeline node rendered as a status row:
 * - idle:   muted dot, "Menunggu" right label
 * - running: glow-pulse Loader2 spin + progress bar w/ scan-shimmer + reasoning
 * - success: emerald CheckCircle2 + optional ConfidenceMeter
 * - failed:  red XCircle
 */
export function PipelineNode({ spec, status, event }: PipelineNodeProps) {
  const shouldReduceMotion = useReducedMotion();
  const Icon = GROUP_ICONS[spec.group];

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-3">
        {/* Status glyph */}
        <div className="flex h-7 w-7 shrink-0 items-center justify-center">
          {status === "idle" && (
            <span className="h-2 w-2 rounded-full bg-bri-line" />
          )}
          {status === "running" && (
            <span className="animate-glow-pulse flex h-7 w-7 items-center justify-center rounded-full ring-2 ring-nilam-run/30">
              <Loader2
                size={15}
                strokeWidth={2.25}
                className="animate-spin text-nilam-run"
              />
            </span>
          )}
          {status === "success" && (
            <CheckCircle2 size={17} strokeWidth={2} className="text-nilam-ok" />
          )}
          {status === "failed" && (
            <XCircle size={17} strokeWidth={2} className="text-red-500" />
          )}
        </div>

        {/* Group icon + label */}
        <div className="flex min-w-0 flex-1 items-center gap-2">
          <Icon
            size={13}
            strokeWidth={2}
            className={cn(
              "shrink-0",
              status === "running" && "text-nilam-run",
              status === "success" && "text-bri-navy",
              (status === "idle" || status === "failed") && "text-bri-muted"
            )}
          />
          <span
            className={cn(
              "truncate text-sm font-medium",
              status === "idle" && "text-bri-muted",
              status === "running" && "text-bri-ink",
              status === "success" && "text-bri-navy",
              status === "failed" && "text-red-600"
            )}
          >
            {spec.label}
          </span>
        </div>

        {/* Right detail */}
        <div className="shrink-0">
          {status === "idle" && (
            <span className="text-xs text-bri-muted">Menunggu</span>
          )}
          {status === "success" && event?.confidence != null && (
            <ConfidenceMeter confidence={event.confidence} />
          )}
          {status === "failed" && (
            <span className="text-xs text-red-500">Gagal</span>
          )}
        </div>
      </div>

      {/* Running: progress bar + scan-shimmer */}
      {status === "running" && (
        <div className="ml-10 flex flex-col gap-1">
          <div className="relative h-1 overflow-hidden rounded-pill bg-bri-bg">
            <motion.div
              className="absolute left-0 top-0 h-full rounded-pill bg-nilam-run"
              initial={{ width: 0 }}
              animate={{ width: `${(event?.progress ?? 0) * 100}%` }}
              transition={{ duration: shouldReduceMotion ? 0 : 0.4, ease: "easeOut" }}
            />
            {/* scan-shimmer overlay */}
            <span className="absolute inset-0 overflow-hidden rounded-pill">
              <span className="absolute top-0 h-full w-12 animate-scan-shimmer bg-gradient-to-r from-transparent via-white/60 to-transparent" />
            </span>
          </div>
          {event?.reasoning && (
            <p className="text-[11px] leading-snug text-bri-muted line-clamp-2">
              {event.reasoning}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
