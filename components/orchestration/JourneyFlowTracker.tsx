"use client";

import {
  Home,
  ListChecks,
  BadgeCheck,
  FileUp,
  Users,
  Cpu,
  CheckCircle2,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/cn";
import { SectionHeading } from "@/components/common/SectionHeading";
import type { FlowStep } from "@/types/flow";

interface StepRow {
  id: FlowStep;
  label: string;
  icon: LucideIcon;
}

const STEP_ROWS: StepRow[] = [
  { id: "opening", label: "Mulai", icon: Home },
  { id: "income_type", label: "Tipe Income", icon: ListChecks },
  { id: "payroll_confirm", label: "Konfirmasi", icon: BadgeCheck },
  { id: "document_upload", label: "Unggah Dok.", icon: FileUp },
  { id: "joint_documents", label: "Dok. Pasangan", icon: Users },
  { id: "processing", label: "Proses", icon: Cpu },
  { id: "submitted", label: "Selesai", icon: CheckCircle2 },
];

interface JourneyFlowTrackerProps {
  steps: FlowStep[];
  currentStep: FlowStep;
}

/**
 * Horizontal stepper showing only the steps present in the persona's flow.
 * Current step: filled bg-bri-navy circle + emerald animate-pulse dot.
 * Past steps: filled navy circle (no pulse).
 * Future steps: outline ring-1 ring-bri-line circle.
 * Connectors go navy when both endpoint steps are past/current.
 * Mirrors SOFIA's HorizontalFlowStateTracker visual rhythm.
 */
export function JourneyFlowTracker({ steps, currentStep }: JourneyFlowTrackerProps) {
  // Only render rows that are part of this persona's flow
  const rows = STEP_ROWS.filter((r) => steps.includes(r.id));
  const currentIndex = rows.findIndex((r) => r.id === currentStep);

  return (
    <section className="flex flex-col gap-3">
      <SectionHeading>Alur Pengajuan Nasabah</SectionHeading>
      <ol className="flex items-start overflow-x-auto scroll-thin pb-1">
        {rows.map((step, i) => {
          const isCurrent = i === currentIndex;
          const isPast = i < currentIndex;
          const isFilled = isPast || isCurrent;
          const isLast = i === rows.length - 1;
          const nextDone = i + 1 < rows.length && i + 1 <= currentIndex;
          const lineActive = (isPast || isCurrent) && nextDone;

          const Icon = step.icon;

          return (
            <li key={step.id} className="flex min-w-0 flex-1 items-start">
              {/* Step column */}
              <div className="flex min-w-0 flex-1 flex-col items-center px-1">
                <div className="relative">
                  <span
                    className={cn(
                      "flex h-7 w-7 shrink-0 items-center justify-center rounded-full transition-colors duration-300",
                      isCurrent && "bg-bri-navy text-white ring-4 ring-bri-sky/30",
                      !isCurrent && isFilled && "bg-bri-navy text-white",
                      !isFilled && "ring-1 ring-bri-line bg-white text-bri-muted"
                    )}
                  >
                    <Icon size={13} strokeWidth={2.25} />
                  </span>
                </div>

                {/* Pulse dot — only under the current step */}
                <span className="mt-1 h-2 w-2">
                  {isCurrent ? (
                    <span className="block h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
                  ) : null}
                </span>

                <span
                  className={cn(
                    "mt-1 text-center text-[10px] font-semibold leading-tight whitespace-nowrap",
                    isFilled ? "text-bri-ink" : "text-bri-muted"
                  )}
                >
                  {step.label}
                </span>
              </div>

              {/* Connector line */}
              {!isLast ? (
                <span
                  className={cn(
                    "mt-[13px] h-px w-5 shrink-0 transition-colors duration-300",
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
