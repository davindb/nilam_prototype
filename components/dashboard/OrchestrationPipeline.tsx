"use client";

import {
  Upload,
  ScanLine,
  FileCheck2,
  ShieldCheck,
  UserCheck,
  Building2,
  Coins,
  Calculator,
  Check,
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/cn";
import { PIPELINE_NODES } from "@/engines/orchestrator/pipelines";
import type { NodeId, NodeStatus } from "@/types/orchestration";

interface OrchestrationPipelineProps {
  /** Returns the NodeStatus for a given NodeId from useOrchestrationFeed. */
  statusOf: (id: NodeId) => NodeStatus;
}

/** Map each nodeId → its lucide icon component. */
const NODE_ICONS: Record<NodeId, React.ComponentType<{ size?: number; className?: string }>> = {
  upload:   Upload,
  ocr:      ScanLine,
  validasi: FileCheck2,
  fraud:    ShieldCheck,
  identity: UserCheck,
  slik:     Building2,
  income:   Coins,
  thp:      Calculator,
};

/**
 * OrchestrationPipeline — horizontal row of 8 pipeline nodes connected by
 * short connector lines. Node appearance driven by NodeStatus:
 *   success → green filled circle + check icon
 *   running → blue filled circle + pulse animation + node icon
 *   idle    → white circle, gray border, gray icon
 *
 * Connector between two consecutive nodes is blue if both are done/active,
 * otherwise gray.
 */
export function OrchestrationPipeline({ statusOf }: OrchestrationPipelineProps) {
  return (
    <div className="rounded-xl border border-bri-line bg-white p-2 shadow-soft">
      {/* Section label */}
      <span className="mb-2 block text-[9px] font-semibold uppercase tracking-[0.12em] text-bri-muted">
        AI Orchestration Pipeline
      </span>

      {/* Node row — equal-width columns so the 8 circles are evenly
          distributed and the whole stepper is horizontally centered. */}
      <div className="flex">
        {PIPELINE_NODES.map((node, idx) => {
          const status = statusOf(node.nodeId);
          const Icon = NODE_ICONS[node.nodeId];

          // Connector belongs to THIS node and joins the previous node → this
          // node. It is active (navy) once the previous node is done and this
          // node has started, so the line "fills" as the pipeline progresses.
          const prevStatus =
            idx === 0 ? "idle" : statusOf(PIPELINE_NODES[idx - 1].nodeId);
          const connectorActive =
            idx > 0 &&
            prevStatus === "success" &&
            (status === "success" || status === "running");

          return (
            <div
              key={node.nodeId}
              className="relative flex flex-1 flex-col items-center"
            >
              {/* Connector — absolutely positioned at the circle's vertical
                  center (top-[13px] = half of the 28px circle), spanning from
                  the previous column's center to this column's center. Sits
                  BEHIND the circles, so label line-count never shifts it. */}
              {idx > 0 && (
                <div
                  className={cn(
                    "absolute left-[-50%] right-1/2 top-[13px] h-[2px] rounded-full transition-colors duration-300",
                    connectorActive ? "bg-bri-navy" : "bg-bri-line"
                  )}
                  aria-hidden="true"
                />
              )}

              {/* Circle */}
              <div className="relative z-10">
                {/* Pulse ring for running */}
                {status === "running" && (
                  <motion.div
                    className="absolute inset-0 rounded-full bg-bri-navy/20"
                    animate={{ scale: [1, 1.6], opacity: [0.6, 0] }}
                    transition={{ duration: 1.2, repeat: Infinity, ease: "easeOut" }}
                  />
                )}

                <div
                  className={cn(
                    "relative flex h-7 w-7 items-center justify-center rounded-full border-2 transition-colors",
                    status === "success" &&
                      "border-emerald-500 bg-emerald-500 text-white",
                    status === "running" &&
                      "border-bri-navy bg-bri-navy text-white",
                    status === "idle" && "border-bri-line bg-white text-bri-muted"
                  )}
                >
                  {status === "success" ? (
                    <Check size={12} strokeWidth={2.5} />
                  ) : (
                    <Icon size={12} />
                  )}
                </div>
              </div>

              {/* Label — fixed 2-line height so every circle stays on the
                  same row regardless of whether the label wraps. */}
              <span
                className={cn(
                  "mt-1 flex h-5 w-full items-start justify-center px-0.5 text-center text-[8px] leading-tight",
                  status === "success" && "font-medium text-emerald-600",
                  status === "running" && "font-semibold text-bri-navy",
                  status === "idle" && "text-bri-muted"
                )}
              >
                {node.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
