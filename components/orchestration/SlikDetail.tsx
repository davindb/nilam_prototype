"use client";

import { motion } from "framer-motion";
import { SectionHeading } from "@/components/common/SectionHeading";
import type { SlikResult } from "@/types/engines";

interface SlikDetailProps {
  result?: SlikResult;
}

function formatRp(val: number): string {
  return "Rp " + val.toLocaleString("id-ID");
}

const ITEM_VARIANTS = {
  hidden: { opacity: 0, y: 5 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.22, ease: "easeOut" } },
};

/**
 * Displays SLIK facilities (lender · type · installment), a highlighted
 * Total Angsuran row establishing lineage to the income card's Angsuran field,
 * and the reasoning string. Only renders when `result` is present.
 */
export function SlikDetail({ result }: SlikDetailProps) {
  if (!result) return null;

  return (
    <div className="flex flex-col gap-2">
      <SectionHeading>SLIK OJK — Fasilitas Kredit</SectionHeading>

      {result.facilities.length === 0 ? (
        <p className="text-xs text-bri-muted">Tidak ada fasilitas kredit ditemukan.</p>
      ) : (
        <motion.div
          className="flex flex-col gap-1"
          initial="hidden"
          animate="visible"
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.07 } } }}
        >
          {result.facilities.map((f, i) => (
            <motion.div
              key={`${f.lender}-${i}`}
              variants={ITEM_VARIANTS}
              className="flex items-center justify-between gap-2 rounded-bubble bg-bri-bg px-3 py-2 ring-1 ring-bri-line"
            >
              <div className="flex min-w-0 flex-1 flex-col">
                <span className="truncate text-xs font-semibold text-bri-ink">{f.lender}</span>
                <span className="text-[10px] text-bri-muted">{f.type}</span>
              </div>
              <span className="shrink-0 text-xs font-bold text-bri-navy tabular-nums">
                {formatRp(f.installment)}
              </span>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Total Angsuran — highlighted row establishing lineage */}
      <div className="flex items-center justify-between rounded-bubble border border-bri-navy/20 bg-bri-bg px-3 py-2.5">
        <div className="flex flex-col">
          <span className="text-xs font-bold text-bri-navy">Total Angsuran</span>
          <span className="text-[10px] leading-tight text-bri-muted">
            → menjadi nilai Angsuran pada kartu penghasilan
          </span>
        </div>
        <span className="text-sm font-extrabold text-bri-navy tabular-nums">
          {formatRp(result.totalAngsuran)}
        </span>
      </div>

      {/* Reasoning */}
      {result.reasoning && (
        <p className="text-[11px] leading-snug text-bri-muted">{result.reasoning}</p>
      )}
    </div>
  );
}
