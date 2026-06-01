"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Loader2 } from "lucide-react";
import { GlassCard } from "@/components/common/GlassCard";
import { PrimaryButton } from "@/components/phone/ui/PrimaryButton";

interface SpouseConfirmScreenProps {
  onProceed: () => void;
  proceedLabel: string;
}

/**
 * Spouse payroll BRI confirmation screen.
 * Informs that the spouse's BRI payroll data will be used — no income upload needed.
 * Shows ~1.2s loading before advancing.
 */
export function SpouseConfirmScreen({ onProceed, proceedLabel }: SpouseConfirmScreenProps) {
  const [validating, setValidating] = useState(false);

  function handleProceed() {
    if (validating) return;
    setValidating(true);
    setTimeout(() => {
      setValidating(false);
      onProceed();
    }, 1200);
  }

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <div className="flex flex-1 flex-col gap-6 px-5 py-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h2 className="text-xl font-bold text-bri-navy">Konfirmasi Pasangan</h2>
          <p className="mt-1 text-sm text-bri-muted">
            Kami mendeteksi data payroll BRI pasangan Anda.
          </p>
        </motion.div>

        {/* Confirmation card */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.08 }}
        >
          <GlassCard className="px-5 py-5">
            <div className="mb-4 flex items-center gap-2">
              <ShieldCheck size={18} className="shrink-0 text-bri-sky" strokeWidth={2} />
              <span className="text-sm font-bold text-bri-navy">Payroll BRI Pasangan Terdeteksi</span>
            </div>
            <p className="text-sm leading-relaxed text-bri-ink">
              Pasangan terdeteksi sebagai nasabah Payroll BRI. Data payroll pasangan akan
              digunakan — tanpa perlu unggah slip gaji/mutasi.
            </p>
            <div className="mt-4 flex items-start gap-2 rounded-bubble bg-white/80 p-3 ring-1 ring-bri-line">
              <span className="mt-0.5 text-nilam-ok text-base leading-none">✓</span>
              <p className="text-xs text-bri-muted">
                Data diproses secara aman dan terenkripsi sesuai kebijakan privasi BRI.
              </p>
            </div>
          </GlassCard>
        </motion.div>

        <div className="flex-1" />

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.18 }}
        >
          {validating ? (
            <div className="flex flex-col items-center gap-2 py-3">
              <Loader2 size={22} className="animate-spin text-bri-navy" />
              <p className="text-xs text-bri-muted">Mengambil data payroll pasangan…</p>
            </div>
          ) : (
            <PrimaryButton onClick={handleProceed}>{proceedLabel}</PrimaryButton>
          )}
        </motion.div>
      </div>
    </div>
  );
}
