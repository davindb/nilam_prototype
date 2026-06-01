"use client";

import { cn } from "@/lib/cn";
import { GlassCard } from "@/components/common/GlassCard";
import type { PersonaConfig } from "@/types/flow";

interface PersonaSelectorProps {
  personas: PersonaConfig[];
  activeId?: string;
  onSelect: (id: string) => void;
}

/**
 * Opening-step persona grid: 4 selectable GlassCards, each showing the
 * persona label and small attribute chips (Payroll/Non-Payroll, Joint/Non-Joint).
 * Active card gets ring-2 ring-bri-navy bg-bri-bg highlight.
 */
export function PersonaSelector({ personas, activeId, onSelect }: PersonaSelectorProps) {
  return (
    <div className="flex flex-col gap-3">
      <p className="text-xs text-bri-muted">
        Pilih persona untuk menjalankan simulasi NILAM.
      </p>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {personas.map((p) => {
          const isActive = p.id === activeId;
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => onSelect(p.id)}
              className={cn(
                "rounded-card p-4 text-left transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bri-navy",
                "ring-1 shadow-soft",
                isActive
                  ? "bg-bri-bg ring-2 ring-bri-navy"
                  : "bg-nilam-glass ring-bri-line hover:ring-bri-blue hover:shadow-soft backdrop-blur-sm"
              )}
            >
              <span
                className={cn(
                  "block text-sm font-semibold",
                  isActive ? "text-bri-navy" : "text-bri-ink"
                )}
              >
                {p.shortLabel}
              </span>
              <span className="mt-1 block text-xs text-bri-muted leading-snug">
                {p.label}
              </span>
              <div className="mt-2 flex flex-wrap gap-1">
                <span
                  className={cn(
                    "rounded-pill px-2 py-0.5 text-[10px] font-medium",
                    isActive
                      ? "bg-bri-navy text-white"
                      : "bg-bri-bg text-bri-blue"
                  )}
                >
                  {p.isPayrollBRI ? "Payroll BRI" : "Non-Payroll"}
                </span>
                <span
                  className={cn(
                    "rounded-pill px-2 py-0.5 text-[10px] font-medium",
                    isActive
                      ? "bg-bri-sky/30 text-bri-navy"
                      : "bg-bri-bubble text-bri-muted"
                  )}
                >
                  {p.isJointIncome ? "Joint" : "Single"}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
