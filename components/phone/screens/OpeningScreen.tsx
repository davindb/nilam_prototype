import { motion } from "framer-motion";
import { PhoneStatusBar } from "@/components/phone/PhoneStatusBar";
import { PrimaryButton } from "@/components/phone/ui/PrimaryButton";

interface OpeningScreenProps {
  personaSelected: boolean;
  onStart: () => void;
}

/**
 * NILAM opening / splash screen.
 * Shows the NILAM wordmark, a gradient monogram, subtitle, and a CTA.
 * The CTA is disabled if no persona has been selected from the panel.
 */
export function OpeningScreen({ personaSelected, onStart }: OpeningScreenProps) {
  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <PhoneStatusBar />

      <div className="flex flex-1 flex-col items-center justify-center gap-8 px-5 py-8 text-center">
        {/* Monogram / glyph */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-bri-navy to-bri-blue shadow-glow"
        >
          <span className="text-4xl font-extrabold tracking-tighter text-white">N</span>
        </motion.div>

        {/* Wordmark + subtitle */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="space-y-1"
        >
          <h1 className="text-3xl font-extrabold tracking-tight text-bri-navy">NILAM</h1>
          <p className="text-sm font-medium text-bri-blue">
            New Intelligent Loan Application Management
          </p>
        </motion.div>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.18 }}
          className="max-w-[280px] text-sm leading-relaxed text-bri-muted"
        >
          Onboarding pinjaman cerdas dengan asesmen penghasilan otomatis — cepat, aman, dan terverifikasi.
        </motion.p>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.26 }}
          className="w-full"
        >
          <PrimaryButton onClick={onStart} disabled={!personaSelected}>
            Mulai
          </PrimaryButton>
          {!personaSelected && (
            <p className="mt-3 text-xs text-bri-muted">
              Pilih persona di panel kanan untuk memulai
            </p>
          )}
        </motion.div>
      </div>
    </div>
  );
}
