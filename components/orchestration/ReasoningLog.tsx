"use client";

import { SectionHeading } from "@/components/common/SectionHeading";
import type { OrchestrationEvent } from "@/types/orchestration";

interface ReasoningLogProps {
  events: OrchestrationEvent[];
}

function formatTime(ts: number): string {
  const d = new Date(ts);
  return d.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
}

/**
 * Scrollable log (newest-first) of events that carry a reasoning string.
 * Monospace-ish text-bri-muted rows with tiny timestamp + label prefix.
 * Shows "Menunggu dokumen…" when empty.
 */
export function ReasoningLog({ events }: ReasoningLogProps) {
  const withReasoning = [...events]
    .filter((e) => !!e.reasoning)
    .reverse(); // newest first

  return (
    <div className="flex flex-col gap-2">
      <SectionHeading>Reasoning Log</SectionHeading>
      <div className="scroll-thin max-h-36 overflow-y-auto rounded-bubble bg-bri-bubble px-3 py-2.5 ring-1 ring-bri-line">
        {withReasoning.length === 0 ? (
          <p className="text-xs text-bri-muted italic">Menunggu dokumen…</p>
        ) : (
          <ul className="flex flex-col gap-2">
            {withReasoning.map((e, i) => (
              <li key={`${e.leg}-${e.nodeId}-${e.ts}-${i}`} className="flex gap-2">
                <span className="shrink-0 font-mono text-[10px] tabular-nums text-bri-muted/70">
                  {formatTime(e.ts)}
                </span>
                <div className="min-w-0 flex-1">
                  <span className="mr-1 text-[10px] font-semibold text-bri-blue">
                    [{e.label}]
                  </span>
                  <span className="text-[11px] leading-snug text-bri-muted">
                    {e.reasoning}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
