"use client";

import { motion } from "framer-motion";
import { CheckCircle2, XCircle } from "lucide-react";
import { SectionHeading } from "@/components/common/SectionHeading";
import { ConfidenceMeter } from "./ConfidenceMeter";
import type { FraudResult } from "@/types/engines";

interface FraudChecksProps {
  result?: FraudResult;
  title: string;
}

const ITEM_VARIANTS = {
  hidden: { opacity: 0, x: -6 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.22, ease: "easeOut" } },
};

/**
 * Lists each fraud check with a pass/fail icon, check name, and score.
 * Renders an overall ConfidenceMeter at the bottom.
 */
export function FraudChecks({ result, title }: FraudChecksProps) {
  if (!result) return null;

  return (
    <div className="flex flex-col gap-2">
      <SectionHeading>{title}</SectionHeading>
      <motion.div
        className="flex flex-col gap-1"
        initial="hidden"
        animate="visible"
        variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.06 } } }}
      >
        {result.checks.map((check) => (
          <motion.div
            key={check.name}
            variants={ITEM_VARIANTS}
            className="flex items-center gap-2"
          >
            {check.passed ? (
              <CheckCircle2 size={13} strokeWidth={2} className="shrink-0 text-nilam-ok" />
            ) : (
              <XCircle size={13} strokeWidth={2} className="shrink-0 text-red-500" />
            )}
            <span className="min-w-0 flex-1 truncate text-xs text-bri-ink">{check.name}</span>
            <span className="shrink-0 text-[10px] font-mono tabular-nums text-bri-muted">
              {(check.score * 100).toFixed(0)}
            </span>
          </motion.div>
        ))}
      </motion.div>
      <div className="mt-1">
        <ConfidenceMeter confidence={result.confidence} />
      </div>
    </div>
  );
}
