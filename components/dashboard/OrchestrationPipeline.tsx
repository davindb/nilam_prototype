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
    <div className="rounded-xl border border-nx-line bg-white p-2 shadow-sm">
      {/* Section label */}
      <span className="mb-2 block text-[9px] font-bold uppercase tracking-widest text-nx-muted">
        AI Orchestration Pipeline
      </span>

      {/* Node row */}
      <div className="flex items-center justify-between">
        {PIPELINE_NODES.map((node, idx) => {
          const status = statusOf(node.nodeId);
          const Icon = NODE_ICONS[node.nodeId];
          const isLast = idx === PIPELINE_NODES.length - 1;

          // Determine connector color: blue if this node and the next are done
          const nextStatus = isLast ? "idle" : statusOf(PIPELINE_NODES[idx + 1].nodeId);
          const connectorActive =
            (status === "success") &&
            (nextStatus === "success" || nextStatus === "running");

          return (
            <div key={node.nodeId} className="flex flex-1 items-center">
              {/* Node */}
              <div className="flex flex-col items-center gap-0.5">
                {/* Circle */}
                <div className="relative">
                  {/* Pulse ring for running */}
                  {status === "running" && (
                    <motion.div
                      className="absolute inset-0 rounded-full bg-nx-blue/20"
                      animate={{ scale: [1, 1.6], opacity: [0.6, 0] }}
                      transition={{ duration: 1.2, repeat: Infinity, ease: "easeOut" }}
                    />
                  )}

                  <div
                    className={cn(
                      "relative flex h-7 w-7 items-center justify-center rounded-full border-2 transition-colors",
                      status === "success" &&
                        "border-nx-ok bg-nx-ok text-white",
                      status === "running" &&
                        "border-nx-blue bg-nx-blue text-white",
                      status === "idle" &&
                        "border-gray-300 bg-white text-gray-400"
                    )}
                  >
                    {status === "success" ? (
                      <Check size={12} strokeWidth={2.5} />
                    ) : (
                      <Icon size={12} />
                    )}
                  </div>
                </div>

                {/* Label */}
                <span
                  className={cn(
                    "max-w-[52px] text-center text-[8px] leading-tight",
                    status === "success" && "font-medium text-nx-ok",
                    status === "running" && "font-semibold text-nx-blue",
                    status === "idle" && "text-nx-muted"
                  )}
                >
                  {node.label}
                </span>
              </div>

              {/* Connector line (not after last node) */}
              {!isLast && (
                <div
                  className={cn(
                    "mx-0.5 h-[2px] flex-1 rounded-full transition-colors duration-300",
                    connectorActive ? "bg-nx-blue" : "bg-gray-200"
                  )}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
