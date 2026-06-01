"use client";

import { RefreshCw } from "lucide-react";
import { cn } from "@/lib/cn";
import type { PersonaConfig } from "@/types/flow";

interface PersonaSelectorProps {
  personas: PersonaConfig[];
  activePersonaId: string | null;
  onSelect: (id: string) => void;
  onReset: () => void;
}

/**
 * PersonaSelector — narrow left strip of the "Behind The Scene" dashboard.
 *
 * Renders 4 persona rows (numbered badge 1–4) + a "Reset Flow" button.
 * Active persona gets a filled blue badge and a blue ring/tint background.
 * Matches reference strips in r1_pipeline.png and r2_ocr.png.
 */
export function PersonaSelector({
  personas,
  activePersonaId,
  onSelect,
  onReset,
}: PersonaSelectorProps) {
  return (
    <div className="flex w-[180px] shrink-0 flex-col rounded-xl border border-nx-line bg-white shadow-sm">
      {/* Section label */}
      <div className="px-2.5 pb-1 pt-2">
        <span className="text-[9px] font-bold uppercase tracking-widest text-nx-muted">
          Persona Selector
        </span>
      </div>

      {/* Persona list */}
      <div className="flex flex-1 flex-col gap-1 px-2 pb-2">
        {personas.map((persona, idx) => {
          const isActive = persona.id === activePersonaId;
          // Split label on "·" to get two lines, e.g. "Payroll BRI" / "Non Joint Income"
          const parts = persona.label.split("·").map((s) => s.trim());
          const line1 = parts[0] ?? persona.label;
          const line2 = parts[1] ?? "";

          return (
            <button
              key={persona.id}
              onClick={() => onSelect(persona.id)}
              className={cn(
                "flex items-center gap-1.5 rounded-lg px-1.5 py-1.5 text-left transition-colors",
                isActive
                  ? "bg-blue-50 ring-1 ring-nx-blue/30"
                  : "hover:bg-gray-50"
              )}
            >
              {/* Numbered badge */}
              <span
                className={cn(
                  "flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold",
                  isActive
                    ? "bg-nx-blue text-white"
                    : "bg-gray-200 text-nx-muted"
                )}
              >
                {idx + 1}
              </span>

              {/* Two-line label */}
              <span className="min-w-0 leading-tight">
                <span
                  className={cn(
                    "block truncate text-[10px] font-semibold",
                    isActive ? "text-nx-blue" : "text-nx-ink"
                  )}
                >
                  {line1}
                </span>
                {line2 && (
                  <span className="block truncate text-[9px] text-nx-muted">
                    {line2}
                  </span>
                )}
              </span>
            </button>
          );
        })}
      </div>

      {/* Reset Flow button */}
      <div className="border-t border-nx-line px-2 py-1.5">
        <button
          onClick={onReset}
          className="flex w-full items-center justify-center gap-1 rounded-lg py-1 text-[10px] font-medium text-nx-muted transition-colors hover:bg-gray-50 hover:text-nx-blue"
        >
          <RefreshCw size={10} />
          Reset Flow
        </button>
      </div>
    </div>
  );
}
