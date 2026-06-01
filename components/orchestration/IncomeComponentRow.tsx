"use client";

import { adjusted } from "@/engines/thp/thpEngine";
import { useCountUp } from "@/hooks/useCountUp";
import { formatRupiah } from "@/lib/formatRupiah";
import { cn } from "@/lib/cn";
import type { ComponentMode, IncomeComponent } from "@/types/income";

interface IncomeComponentRowProps {
  component: IncomeComponent;
  onMode: (mode: ComponentMode) => void;
  onWeight: (weight: number) => void;
}

/**
 * One income component row: label + avg/min toggle + weight slider + adjusted value.
 * Used inside CustomerCard — stacks vertically in the 760px panel.
 */
export function IncomeComponentRow({ component, onMode, onWeight }: IncomeComponentRowProps) {
  const adjustedValue = adjusted(component);
  const animatedValue = useCountUp(adjustedValue, 350);

  const base = component.mode === "avg" ? component.avg : component.min;

  return (
    <div className="flex flex-col gap-1.5 rounded-bubble bg-white/60 px-3 py-2.5 ring-1 ring-bri-line">
      {/* Row 1: label + avg/min toggle */}
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm font-semibold text-bri-ink">{component.key}</span>

        {/* Segmented avg | min toggle */}
        <div className="flex overflow-hidden rounded-pill bg-bri-bg ring-1 ring-bri-line">
          {(["avg", "min"] as ComponentMode[]).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => onMode(m)}
              className={cn(
                "px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide transition-colors",
                component.mode === m
                  ? "bg-bri-navy text-white"
                  : "text-bri-muted hover:text-bri-ink"
              )}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      {/* Row 2: slider + weight label + adjusted value */}
      <div className="flex items-center gap-2">
        <input
          type="range"
          min={0}
          max={1}
          step={0.05}
          value={component.weight}
          onChange={(e) => onWeight(parseFloat(e.target.value))}
          className="h-1 flex-1 cursor-pointer accent-bri-navy"
          aria-label={`Bobot ${component.key}`}
        />
        <span className="w-10 text-right font-mono text-xs tabular-nums text-bri-muted">
          ×{component.weight.toFixed(2)}
        </span>
      </div>

      {/* Row 3: adjusted value (prominent) + basis hint */}
      <div className="flex items-center justify-between gap-2">
        <span className="text-[10px] text-bri-muted">
          basis: {component.mode} {formatRupiah(base)}
        </span>
        <span className="font-bold tabular-nums text-bri-navy text-sm">
          {formatRupiah(animatedValue)}
        </span>
      </div>
    </div>
  );
}
