"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/cn";
import type { PersonaConfig } from "@/types/flow";

interface PersonaSwitcherProps {
  persona: PersonaConfig;
  personas: PersonaConfig[];
  onSelect: (id: string) => void;
}

/**
 * Compact persona-chip shown after the flow starts. Displays the active
 * persona's shortLabel + a ChevronDown. Clicking toggles a small popover
 * listing all personas; selecting one calls onSelect (resets flow upstream).
 * Mirrors SOFIA's PersonaSwitcher pattern.
 */
export function PersonaSwitcher({ persona, personas, onSelect }: PersonaSwitcherProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  return (
    <div ref={ref} className="relative inline-block">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "inline-flex items-center gap-1.5 rounded-pill px-3 py-1.5",
          "bg-bri-bg ring-1 ring-bri-line text-xs font-semibold text-bri-navy",
          "transition-all hover:ring-bri-blue hover:shadow-soft"
        )}
      >
        {persona.shortLabel}
        <ChevronDown
          size={12}
          strokeWidth={2.5}
          className={cn("transition-transform duration-150", open && "rotate-180")}
        />
      </button>

      {open && (
        <div
          className={cn(
            "absolute left-0 top-full z-50 mt-1 min-w-[200px]",
            "rounded-bubble bg-white shadow-panel ring-1 ring-bri-line",
            "py-1"
          )}
        >
          {personas.map((p) => {
            const isActive = p.id === persona.id;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => {
                  onSelect(p.id);
                  setOpen(false);
                }}
                className={cn(
                  "flex w-full flex-col px-4 py-2.5 text-left transition-colors",
                  "hover:bg-bri-bg",
                  isActive && "bg-bri-bg"
                )}
              >
                <span
                  className={cn(
                    "text-xs font-semibold",
                    isActive ? "text-bri-navy" : "text-bri-ink"
                  )}
                >
                  {p.shortLabel}
                </span>
                <span className="text-[10px] text-bri-muted">{p.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
