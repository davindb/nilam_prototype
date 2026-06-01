"use client";

import { motion } from "framer-motion";
import { SectionHeading } from "@/components/common/SectionHeading";
import type { OcrMutasiResult, OcrBucket } from "@/types/engines";

interface OcrExtractionProps {
  mutasi?: OcrMutasiResult;
}

const BUCKET_LABELS: { key: keyof OcrMutasiResult; label: string; color: string }[] = [
  { key: "Gaji", label: "Gaji Pokok", color: "text-bri-navy" },
  { key: "THR", label: "THR", color: "text-bri-blue" },
  { key: "Bonus", label: "Bonus", color: "text-nilam-run" },
  { key: "Insentif", label: "Insentif", color: "text-bri-sky" },
];

function formatRp(val: number): string {
  return "Rp " + val.toLocaleString("id-ID");
}

function BucketCard({ label, bucket, color }: { label: string; bucket: OcrBucket; color: string }) {
  return (
    <div className="flex flex-col gap-0.5 rounded-bubble bg-bri-bg px-3 py-2 ring-1 ring-bri-line">
      <span className={`text-[10px] font-semibold uppercase tracking-wide ${color}`}>
        {label}
      </span>
      <div className="flex items-baseline gap-2">
        <span className="text-xs font-bold text-bri-ink tabular-nums">
          {formatRp(bucket.sum)}
        </span>
        <span className="text-[10px] text-bri-muted">{bucket.count}x</span>
      </div>
      <span className="text-[10px] text-bri-muted tabular-nums">
        Min: {formatRp(bucket.min)}
      </span>
    </div>
  );
}

const CONTAINER_VARIANTS = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
};
const ITEM_VARIANTS = {
  hidden: { opacity: 0, y: 6 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.25, ease: "easeOut" } },
};

/**
 * Reveals the 4 OCR buckets (Gaji/THR/Bonus/Insentif) extracted from mutasi
 * in staggered fade-in cards. Only renders when `mutasi` is present.
 */
export function OcrExtraction({ mutasi }: OcrExtractionProps) {
  if (!mutasi) return null;

  return (
    <div className="flex flex-col gap-2">
      <SectionHeading>OCR — Field Terekstraksi</SectionHeading>
      <motion.div
        className="grid grid-cols-2 gap-2"
        variants={CONTAINER_VARIANTS}
        initial="hidden"
        animate="visible"
      >
        {BUCKET_LABELS.map(({ key, label, color }) => (
          <motion.div key={key} variants={ITEM_VARIANTS}>
            <BucketCard label={label} bucket={mutasi[key]} color={color} />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
