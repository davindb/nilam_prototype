"use client";

import { Flag, ListChecks, Users, FolderCheck, Cpu, Gavel, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/cn";
import { SectionHeading } from "@/components/common/SectionHeading";
import type { FlowStep } from "@/types/flow";

// ---------------------------------------------------------------------------
// Fixed 6-node stepper — independent of the dynamic persona steps array.
// Revision #7: relabelled; icons chosen for clarity; icon clip bug fixed.
// ---------------------------------------------------------------------------

interface NodeDef {
  label: string;
  icon: LucideIcon;
}

const NODES: NodeDef[] = [
  { label: "Start",           icon: Flag },
  { label: "Income Type",     icon: ListChecks },
  { label: "Joint Income",    icon: Users },
  { label: "Requirement",     icon: FolderCheck },
  { label: "Process",         icon: Cpu },
  { label: "Credit Analyst",  icon: Gavel },
];

/** Map each FlowStep → active node index (0-based). */
function stepToIndex(step: FlowStep): number {
  switch (step) {
    case "opening":                                         return 0;
    case "income_type":                                     return 1;
    case "joint_income":                                    return 2;
    case "requirement_nasabah":
    case "spouse_identity":
    case "spouse_confirm":
    case "spouse_income":                                   return 3;
    case "processing":                                      return 4;
    case "submitted":                                       return 5;
    default:                                                return 0;
  }
}

interface JourneyFlowTrackerProps {
  /** Current flow step — used to derive active node index. */
  currentStep: FlowStep;
}

/**
 * Fixed 6-node horizontal stepper for NILAM's Alur Pengajuan.
 * Nodes: Start · Income Type · Joint Income · Requirement · Process · Credit Analyst Decision.
 *
 * Visual rules:
 *   before active → filled navy + check-ring (no pulse)
 *   active        → filled navy + emerald animate-pulse dot
 *   after active  → outline ring-1 ring-bri-line
 *
 * Icon clip fix (#7): each icon sits inside a flex-centred h-9 w-9 circle with
 * icon size={16} so the glyph is well inside the circle boundary at all times.
 * Labels allow horizontal scroll (scroll-thin) rather than shrinking circles.
 */
export function JourneyFlowTracker({ currentStep }: JourneyFlowTrackerProps) {
  const activeIndex = stepToIndex(currentStep);

  return (
    <section className="flex flex-col gap-3">
      <SectionHeading>Alur Pengajuan Nasabah</SectionHeading>
      <ol className="flex items-start overflow-x-auto scroll-thin pb-1">
        {NODES.map((node, i) => {
          const isCurrent = i === activeIndex;
          const isPast    = i < activeIndex;
          const isFilled  = isPast || isCurrent;
          const isLast    = i === NODES.length - 1;
          // Connector goes navy only when both endpoint steps are done/current
          const lineActive = isPast && i + 1 <= activeIndex;

          const Icon = node.icon;

          return (
            <li key={node.label} className="flex min-w-0 flex-1 items-start">
              {/* Step column */}
              <div className="flex min-w-0 flex-1 flex-col items-center px-1">
                {/* Icon circle — h-9 w-9 guarantees icon (size 16) is never clipped */}
                <div className="relative">
                  <span
                    className={cn(
                      "flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-colors duration-300",
                      isCurrent && "bg-bri-navy text-white ring-4 ring-bri-sky/30",
                      !isCurrent && isFilled && "bg-bri-navy text-white",
                      !isFilled && "ring-1 ring-bri-line bg-white text-bri-muted"
                    )}
                  >
                    <Icon size={16} strokeWidth={2.25} />
                  </span>
                </div>

                {/* Pulse dot — only under the current node */}
                <span className="mt-1 h-2 w-2">
                  {isCurrent ? (
                    <span className="block h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
                  ) : null}
                </span>

                <span
                  className={cn(
                    "mt-1 text-center text-[9px] font-semibold leading-tight",
                    // Prevent wrapping on small columns — let parent scroll
                    "whitespace-nowrap",
                    isFilled ? "text-bri-ink" : "text-bri-muted"
                  )}
                >
                  {node.label}
                </span>
              </div>

              {/* Connector line — centred on the icon row (mt = half of h-9 = 18px) */}
              {!isLast ? (
                <span
                  className={cn(
                    "mt-[18px] h-px w-4 shrink-0 transition-colors duration-300",
                    lineActive ? "bg-bri-navy" : "bg-bri-line"
                  )}
                />
              ) : null}
            </li>
          );
        })}
      </ol>
    </section>
  );
}
