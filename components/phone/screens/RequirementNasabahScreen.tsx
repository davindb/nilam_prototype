"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Loader2 } from "lucide-react";
import { GlassCard } from "@/components/common/GlassCard";
import { UploadCard } from "@/components/phone/ui/UploadCard";
import { PrimaryButton } from "@/components/phone/ui/PrimaryButton";

interface RequirementNasabahScreenProps {
  isPayroll: boolean;
  uploads: Record<string, boolean>;
  onUpload: (key: string) => void;
  onProceed: () => void;
  proceedLabel: string;
}

/**
 * Requirement screen for nasabah.
 * - isPayroll=true: shows payroll confirmation card + short loading (~1.2s) before advancing.
 * - isPayroll=false: shows upload cards for Slip Gaji + Mutasi, validation loading (~1.6s) before advancing.
 */
export function RequirementNasabahScreen({
  isPayroll,
  uploads,
  onUpload,
  onProceed,
  proceedLabel,
}: RequirementNasabahScreenProps) {
  const [validating, setValidating] = useState(false);

  const allUploaded = !!uploads["slip_gaji"] && !!uploads["mutasi"];

  function handleProceed() {
    if (validating) return;
    setValidating(true);
    const delay = isPayroll ? 1200 : 1600;
    setTimeout(() => {
      setValidating(false);
      onProceed();
    }, delay);
  }

  if (isPayroll) {
    return (
      <div className="flex flex-1 flex-col overflow-hidden">
        <div className="flex flex-1 flex-col gap-6 px-5 py-4">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="text-xl font-bold text-bri-navy">Konfirmasi Data</h2>
            <p className="mt-1 text-sm text-bri-muted">Kami mendeteksi data payroll BRI Anda.</p>
          </motion.div>

          {/* Payroll confirmation card */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.08 }}
          >
            <GlassCard className="px-5 py-5">
              <div className="mb-4 flex items-center gap-2">
                <ShieldCheck size={18} className="shrink-0 text-bri-navy" strokeWidth={2} />
                <span className="text-sm font-bold text-bri-navy">Payroll BRI Terdeteksi</span>
              </div>
              <p className="text-sm leading-relaxed text-bri-ink">
                Data Payroll BRI Anda terdeteksi dan akan digunakan untuk asesmen penghasilan —
                tanpa perlu unggah dokumen.
              </p>
              <div className="mt-4 flex items-start gap-2 rounded-bubble bg-white/80 p-3 ring-1 ring-bri-line">
                <span className="mt-0.5 text-nilam-ok text-base leading-none">✓</span>
                <p className="text-xs text-bri-muted">
                  Data Anda diproses secara aman dan terenkripsi sesuai kebijakan privasi BRI.
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
                <p className="text-xs text-bri-muted">Mengambil data payroll…</p>
              </div>
            ) : (
              <PrimaryButton onClick={handleProceed}>{proceedLabel}</PrimaryButton>
            )}
          </motion.div>
        </div>
      </div>
    );
  }

  // Non-payroll: upload documents
  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <div className="flex flex-1 flex-col gap-5 px-5 py-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h2 className="text-xl font-bold text-bri-navy">Unggah Dokumen</h2>
          <p className="mt-1 text-sm text-bri-muted">
            Unggah dokumen berikut untuk verifikasi penghasilan Anda.
          </p>
        </motion.div>

        {/* Upload cards */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.08 }}
          className="space-y-3"
        >
          <UploadCard
            title="Slip Gaji"
            hint="Format PDF atau JPG, maks. 5 MB"
            uploaded={!!uploads["slip_gaji"]}
            fileName="slip_gaji.pdf"
            onPick={() => !validating && onUpload("slip_gaji")}
          />
          <UploadCard
            title="Mutasi Rekening 12 Bulan"
            hint="Rekening koran 12 bulan terakhir"
            uploaded={!!uploads["mutasi"]}
            fileName="mutasi_12bln.pdf"
            onPick={() => !validating && onUpload("mutasi")}
          />
        </motion.div>

        <div className="flex-1" />

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.14 }}
        >
          {validating ? (
            <div className="flex flex-col items-center gap-2 py-3">
              <Loader2 size={22} className="animate-spin text-bri-navy" />
              <p className="text-xs text-bri-muted">
                Memvalidasi slip gaji &amp; mutasi 12 bulan…
              </p>
            </div>
          ) : (
            <>
              <PrimaryButton onClick={handleProceed} disabled={!allUploaded}>
                {proceedLabel}
              </PrimaryButton>
              {!allUploaded && (
                <p className="mt-2 text-center text-xs text-bri-muted">
                  Unggah semua dokumen untuk melanjutkan
                </p>
              )}
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
}
