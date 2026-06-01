"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { UploadCard } from "@/components/phone/ui/UploadCard";
import { SelfieCapture } from "@/components/phone/ui/SelfieCapture";
import { PrimaryButton } from "@/components/phone/ui/PrimaryButton";

interface SpouseIdentityScreenProps {
  uploads: Record<string, boolean>;
  onUpload: (key: string) => void;
  /** Called when the selfie is captured; caller should setUpload("selfie"). */
  onCapture: () => void;
  onProceed: () => void;
}

/**
 * Spouse identity verification: KTP Pasangan upload + liveness selfie.
 * Primary button enabled only when both ktp and selfie are present.
 * Validation loading ~1.6s before advancing.
 */
export function SpouseIdentityScreen({
  uploads,
  onUpload,
  onCapture,
  onProceed,
}: SpouseIdentityScreenProps) {
  const [validating, setValidating] = useState(false);

  const allReady = !!uploads["ktp"] && !!uploads["selfie"];

  function handleProceed() {
    if (validating) return;
    setValidating(true);
    setTimeout(() => {
      setValidating(false);
      onProceed();
    }, 1600);
  }

  return (
    <div className="flex flex-1 flex-col overflow-y-auto scroll-thin">
      <div className="flex flex-col gap-4 px-5 py-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h2 className="text-xl font-bold text-bri-navy">Verifikasi Identitas Pasangan</h2>
          <p className="mt-1 text-sm text-bri-muted">
            Unggah KTP pasangan dan ambil selfie liveness untuk verifikasi identitas.
          </p>
        </motion.div>

        {/* KTP Pasangan */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.06 }}
        >
          <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-bri-muted">
            KTP Pasangan
          </p>
          <UploadCard
            title="KTP Pasangan"
            hint="Foto KTP yang jelas dan tidak buram"
            uploaded={!!uploads["ktp"]}
            fileName="ktp_pasangan.jpg"
            onPick={() => !validating && onUpload("ktp")}
          />
        </motion.div>

        {/* Selfie liveness */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-bri-muted">
            Liveness Selfie
          </p>
          <SelfieCapture
            captured={!!uploads["selfie"]}
            onCapture={() => !validating && onCapture()}
          />
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.16 }}
          className="pt-2 pb-4"
        >
          {validating ? (
            <div className="flex flex-col items-center gap-2 py-3">
              <Loader2 size={22} className="animate-spin text-bri-navy" />
              <p className="text-xs text-bri-muted">Memvalidasi KTP &amp; selfie pasangan…</p>
            </div>
          ) : (
            <>
              <PrimaryButton onClick={handleProceed} disabled={!allReady}>
                Lanjutkan
              </PrimaryButton>
              {!allReady && (
                <p className="mt-2 text-center text-xs text-bri-muted">
                  Lengkapi KTP dan selfie pasangan untuk melanjutkan
                </p>
              )}
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
}
