import { Check } from "lucide-react";
import { cn } from "@/lib/cn";
import type { FlowStep } from "@/types/flow";

interface FlowStepperProps {
  currentStep: FlowStep;
}

interface StepNode {
  number: number;
  label: string;
  sublabel?: string;
}

const NODES: StepNode[] = [
  { number: 1, label: "Opening" },
  { number: 2, label: "Income Type" },
  { number: 3, label: "Upload", sublabel: "Dokumen" },
  { number: 4, label: "Joint Income" },
  { number: 5, label: "Se..." }, // Analyst Decision — truncated to fit
];

// Map currentStep → which node index (0-based) is "active"
function getActiveIndex(step: FlowStep): number {
  switch (step) {
    case "opening":        return 0;
    case "income_type":    return 1;
    case "requirement":    return 2;
    case "processing":     return 2; // processing = still on requirement node (loading)
    case "joint_income":   return 3;
    case "analyst_decision": return 4;
    default:               return 0;
  }
}

/**
 * Horizontal flow stepper rendered BELOW the iPhone.
 * 5 numbered circles connected by dotted lines, with tiny labels underneath.
 *
 * Node states:
 *   done   = filled blue, white check icon (nodes before active)
 *   active = filled nx.blue, white number (bold)
 *   future = white bg, gray border, gray number
 */
export function FlowStepper({ currentStep }: FlowStepperProps) {
  const activeIdx = getActiveIndex(currentStep);

  return (
    <div className="flex shrink-0 items-start justify-center gap-0 pt-2">
      {NODES.map((node, i) => {
        const isDone   = i < activeIdx;
        const isActive = i === activeIdx;

        return (
          <div key={node.number} className="flex items-start">
            {/* Node + label */}
            <div className="flex flex-col items-center" style={{ minWidth: 40 }}>
              {/* Circle */}
              <div
                className={cn(
                  "flex h-7 w-7 items-center justify-center rounded-full text-[11px] font-bold transition-all",
                  isDone
                    ? "bg-nx-blue text-white"
                    : isActive
                    ? "bg-nx-blue text-white shadow-md"
                    : "border-2 border-gray-300 bg-white text-gray-400"
                )}
                style={
                  isActive
                    ? { boxShadow: "0 0 0 3px rgba(37,99,235,0.18)" }
                    : undefined
                }
              >
                {isDone ? (
                  <Check size={12} strokeWidth={3} />
                ) : (
                  <span>{node.number}</span>
                )}
              </div>

              {/* Label */}
              <div className="mt-0.5 text-center">
                <span
                  className={cn(
                    "block text-[8px] leading-tight",
                    isActive
                      ? "font-semibold text-nx-blue"
                      : isDone
                      ? "font-medium text-nx-blue"
                      : "text-gray-400"
                  )}
                  style={{ maxWidth: 40 }}
                >
                  {node.label}
                </span>
                {node.sublabel && (
                  <span
                    className={cn(
                      "block text-[8px] leading-tight",
                      isActive
                        ? "font-semibold text-nx-blue"
                        : isDone
                        ? "font-medium text-nx-blue"
                        : "text-gray-400"
                    )}
                  >
                    {node.sublabel}
                  </span>
                )}
              </div>
            </div>

            {/* Dotted connector (not after last node) */}
            {i < NODES.length - 1 && (
              <div
                className="mt-[13px] flex-1"
                style={{
                  width: 16,
                  height: 2,
                  borderTop: `2px dotted ${i < activeIdx ? "#2563EB" : "#D1D5DB"}`,
                  minWidth: 10,
                  maxWidth: 20,
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
