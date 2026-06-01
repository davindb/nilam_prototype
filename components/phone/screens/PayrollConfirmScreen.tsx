import { motion } from "framer-motion";
import { ShieldCheck } from "lucide-react";
import { PhoneStatusBar } from "@/components/phone/PhoneStatusBar";
import { PrimaryButton } from "@/components/phone/ui/PrimaryButton";

interface PayrollConfirmScreenProps {
  onConfirm: () => void;
}

/**
 * Payroll BRI detected confirmation screen.
 * Informs the user that BRI internal payroll data will be used
 * for income assessment — no document upload required.
 */
export function PayrollConfirmScreen({ onConfirm }: PayrollConfirmScreenProps) {
  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <PhoneStatusBar />

      <div className="flex flex-1 flex-col gap-6 px-5 py-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h2 className="text-xl font-bold text-bri-navy">Konfirmasi Data</h2>
          <p className="mt-1 text-sm text-bri-muted">
            Kami mendeteksi data payroll BRI Anda.
          </p>
        </motion.div>

        {/* Info card */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.08 }}
          className="rounded-card bg-bri-bg p-5 ring-1 ring-bri-navy/15 shadow-soft"
        >
          {/* Badge */}
          <div className="mb-4 flex items-center gap-2">
            <ShieldCheck size={18} className="shrink-0 text-bri-navy" strokeWidth={2} />
            <span className="text-sm font-bold text-bri-navy">Payroll BRI Terdeteksi</span>
          </div>

          <p className="text-sm leading-relaxed text-bri-ink">
            Kami mendeteksi Anda nasabah payroll BRI. Data payroll &amp; internal akan
            digunakan untuk asesmen penghasilan — tanpa perlu unggah dokumen.
          </p>

          <div className="mt-4 flex items-start gap-2 rounded-bubble bg-white/80 p-3 ring-1 ring-bri-line">
            <span className="mt-0.5 text-nilam-ok text-base leading-none">✓</span>
            <p className="text-xs text-bri-muted">
              Data Anda diproses secara aman dan terenkripsi sesuai kebijakan privasi BRI.
            </p>
          </div>
        </motion.div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.18 }}
        >
          <PrimaryButton onClick={onConfirm}>
            Konfirmasi &amp; Lanjutkan
          </PrimaryButton>
        </motion.div>
      </div>
    </div>
  );
}
