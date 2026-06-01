"use client";

import { motion, useReducedMotion } from "framer-motion";

interface ConfidenceMeterProps {
  /** Raw confidence value in the 0..1 range. */
  confidence: number;
  /** Optional override label. If omitted, derived from confidence value. */
  level?: string;
}

/** Derive a banded label from the confidence value. */
function deriveLevel(c: number): string {
  if (c >= 0.95) return "High";
  if (c >= 0.8) return "Medium";
  return "Low";
}

/**
 * Animated confidence bar: navy fill (Framer Motion width 0→pct),
 * tabular-nums percentage, and a chip showing the level band.
 * Mirrors SOFIA's ConfidenceMeter.
 */
export function ConfidenceMeter({ confidence, level }: ConfidenceMeterProps) {
  const shouldReduceMotion = useReducedMotion();
  const clamped = Math.max(0, Math.min(1, confidence));
  const pct = (clamped * 100).toFixed(1);
  const displayLevel = level ?? deriveLevel(clamped);

  return (
    <div className="inline-flex items-center gap-2">
      <div className="h-1.5 w-32 overflow-hidden rounded-pill bg-bri-bg sm:w-40">
        <motion.div
          className="h-full rounded-pill bg-bri-navy"
          initial={{ width: 0 }}
          animate={{ width: `${clamped * 100}%` }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.6, ease: "easeOut" }}
        />
      </div>
      <span className="text-sm font-bold text-bri-navy tabular-nums">
        {pct}%
      </span>
      <span className="rounded-pill bg-bri-bg px-2 py-0.5 text-xs text-bri-muted">
        {displayLevel}
      </span>
    </div>
  );
}
