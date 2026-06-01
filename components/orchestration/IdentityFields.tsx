"use client";

import { motion } from "framer-motion";
import { SectionHeading } from "@/components/common/SectionHeading";
import type { IdentityResult } from "@/types/engines";

interface IdentityFieldsProps {
  identity?: IdentityResult;
}

const ITEM_VARIANTS = {
  hidden: { opacity: 0, x: -5 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.22, ease: "easeOut" } },
};

/**
 * Reveals extracted KTP identity fields in staggered row reveal.
 * Only renders when `identity` is present (success event output).
 */
export function IdentityFields({ identity }: IdentityFieldsProps) {
  if (!identity) return null;

  const rows = [
    { label: "NIK", value: identity.NIK },
    { label: "Nama", value: identity.Nama },
    { label: "Gender", value: identity.Gender === "L" ? "Laki-laki" : "Perempuan" },
    { label: "Tgl. Lahir", value: identity.TanggalLahir },
    { label: "Payroll BRI", value: identity.isPayrollBRI ? "Ya" : "Tidak" },
  ];

  return (
    <div className="flex flex-col gap-2">
      <SectionHeading>Identitas KTP Pasangan</SectionHeading>
      <motion.div
        className="flex flex-col gap-1"
        initial="hidden"
        animate="visible"
        variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.07 } } }}
      >
        {rows.map((row) => (
          <motion.div
            key={row.label}
            variants={ITEM_VARIANTS}
            className="flex items-center justify-between gap-4 py-1 border-b border-bri-line last:border-0"
          >
            <span className="text-[11px] text-bri-muted">{row.label}</span>
            <span className="text-xs font-semibold text-bri-ink tabular-nums">
              {row.value}
            </span>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
