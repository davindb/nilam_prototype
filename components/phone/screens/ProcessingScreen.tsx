import { motion } from "framer-motion";
import { PhoneStatusBar } from "@/components/phone/PhoneStatusBar";

/**
 * Processing / pipeline-running screen.
 *
 * Shows a premium animated state while the NILAM orchestrator runs OCR,
 * fraud screening, SLIK retrieval, and income extraction in the background.
 *
 * The hook auto-advances to 'submitted' once the pipeline completes — this
 * screen has no user-facing controls (no back button, no CTA).
 *
 * Note: Because the pipeline runs synchronously under the hood (all async
 * delays in the orchestrator are simulated with setTimeout), the screen
 * flashes briefly before the hook dispatches goTo('submitted'). In a real
 * integration you'd await an actual async call; the visual flash is expected
 * in prototype mode and acceptable for demo purposes.
 */
export function ProcessingScreen() {
  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <PhoneStatusBar />

      <div className="flex flex-1 flex-col items-center justify-center gap-8 px-5 py-8 text-center">
        {/* Animated ring + badge */}
        <div className="relative flex items-center justify-center">
          {/* Outer glow ring */}
          <div className="absolute h-28 w-28 animate-glow-pulse rounded-full" />

          {/* Spinning arc */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "linear" }}
            className="h-24 w-24 rounded-full border-4 border-bri-bg border-t-bri-navy"
          />

          {/* Center monogram */}
          <div className="absolute flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-bri-navy to-bri-blue shadow-glow">
            <span className="text-2xl font-extrabold text-white">N</span>
          </div>
        </div>

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="space-y-2"
        >
          <h2 className="text-xl font-bold text-bri-navy">Memproses Aplikasi…</h2>
          <p className="text-sm leading-relaxed text-bri-muted">
            NILAM sedang menjalankan OCR, fraud screening,
            <br />
            SLIK, dan ekstraksi penghasilan.
          </p>
        </motion.div>

        {/* Pipeline step indicators */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.25 }}
          className="flex flex-col gap-2 w-full max-w-[260px]"
        >
          {[
            "Analisis dokumen (OCR)…",
            "Fraud screening…",
            "Permintaan SLIK…",
            "Ekstraksi penghasilan…",
          ].map((label, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.3 + i * 0.08 }}
              className="flex items-center gap-2 rounded-bubble bg-bri-bg px-3 py-2"
            >
              {/* Shimmer bar */}
              <div className="relative h-1.5 w-1.5 shrink-0 overflow-hidden rounded-full bg-bri-sky">
                <div className="absolute inset-0 animate-glow-pulse rounded-full bg-bri-sky" />
              </div>
              <p className="text-xs text-bri-muted">{label}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
