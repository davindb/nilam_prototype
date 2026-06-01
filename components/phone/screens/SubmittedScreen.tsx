import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { PhoneStatusBar } from "@/components/phone/PhoneStatusBar";

interface SubmittedScreenProps {
  onRestart: () => void;
}

/**
 * Success / submission confirmation screen.
 *
 * Shows a spring-animated green check, confirmation copy, a faux application
 * ID, and a subtle text link to restart the flow.
 */
export function SubmittedScreen({ onRestart }: SubmittedScreenProps) {
  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <PhoneStatusBar />

      <div className="flex flex-1 flex-col items-center justify-center gap-8 px-5 py-8 text-center">
        {/* Animated check */}
        <motion.div
          initial={{ opacity: 0, scale: 0.4 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 18, delay: 0.05 }}
          className="flex h-24 w-24 items-center justify-center rounded-full bg-nilam-ok/10"
        >
          <CheckCircle2 size={52} className="text-nilam-ok" strokeWidth={1.8} />
        </motion.div>

        {/* Copy */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.2 }}
          className="space-y-2"
        >
          <h2 className="text-2xl font-bold text-bri-navy">Aplikasi Terkirim</h2>
          <p className="text-sm text-bri-muted">
            Application submitted. Waiting for analyst review.
          </p>
          <p className="text-sm leading-relaxed text-bri-muted">
            Aplikasi Anda sedang menunggu review analis.
          </p>
        </motion.div>

        {/* Faux application ID */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.32 }}
          className="rounded-card bg-bri-bg px-6 py-4 ring-1 ring-bri-navy/15"
        >
          <p className="text-xs font-medium uppercase tracking-wider text-bri-muted">
            ID Aplikasi
          </p>
          <p className="mt-1 font-mono text-base font-bold tracking-widest text-bri-navy">
            NILAM-2026-0000123
          </p>
        </motion.div>

        {/* Restart link */}
        <motion.button
          type="button"
          onClick={onRestart}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.45 }}
          className="text-sm text-bri-muted underline-offset-2 hover:text-bri-navy hover:underline transition-colors"
        >
          Mulai aplikasi baru
        </motion.button>
      </div>
    </div>
  );
}
