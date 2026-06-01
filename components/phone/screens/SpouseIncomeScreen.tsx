"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { UploadCard } from "@/components/phone/ui/UploadCard";
import { PrimaryButton } from "@/components/phone/ui/PrimaryButton";

interface SpouseIncomeScreenProps {
  uploads: Record<string, boolean>;
  onUpload: (key: string) => void;
  onProceed: () => void;
  proceedLabel: string;
}

/**
 * Spouse income document upload screen (non-payroll spouse).
 * Requires Slip Gaji Pasangan + Mutasi Pasangan 12 Bulan before advancing.
 * Validation loading ~1.6s before calling onProceed.
 */
export function SpouseIncomeScreen({
  uploads,
  onUpload,
  onProceed,
  proceedLabel,
}: SpouseIncomeScreenProps) {
  const [validating, setValidating] = useState(false);

  const allUploaded = !!uploads["spouse_slip"] && !!uploads["spouse_mutasi"];

  function handleProceed() {
    if (validating) return;
    setValidating(true);
    setTimeout(() => {
      setValidating(false);
      onProceed();
    }, 1600);
  }

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <div className="flex flex-1 flex-col gap-5 px-5 py-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h2 className="text-xl font-bold text-bri-navy">Unggah Dokumen Pasangan</h2>
          <p className="mt-1 text-sm text-bri-muted">
            Unggah dokumen penghasilan pasangan untuk asesmen joint income.
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
            title="Slip Gaji Pasangan"
            hint="Slip gaji bulan terakhir pasangan"
            uploaded={!!uploads["spouse_slip"]}
            fileName="slip_gaji_pasangan.pdf"
            onPick={() => !validating && onUpload("spouse_slip")}
          />
          <UploadCard
            title="Mutasi Pasangan 12 Bulan"
            hint="Rekening koran 12 bulan terakhir pasangan"
            uploaded={!!uploads["spouse_mutasi"]}
            fileName="mutasi_pasangan_12bln.pdf"
            onPick={() => !validating && onUpload("spouse_mutasi")}
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
                  Unggah semua dokumen pasangan untuk melanjutkan
                </p>
              )}
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
}
