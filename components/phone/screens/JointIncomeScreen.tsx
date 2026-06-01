"use client";

import { useState } from "react";
import { motion, useAnimationControls } from "framer-motion";
import { Users, User } from "lucide-react";
import { cn } from "@/lib/cn";

interface JointIncomeScreenProps {
  /** Whether the currently selected persona is joint income. */
  isJoint: boolean;
  /** Called when the user taps the option that matches isJoint. */
  onProceed: () => void;
}

/**
 * Joint income choice screen.
 * Both options are always visible and tappable.
 * Tapping the MATCHING option proceeds; tapping the wrong option shakes it
 * + shows a transient muted hint — never disables it.
 */
export function JointIncomeScreen({ isJoint, onProceed }: JointIncomeScreenProps) {
  const [hint, setHint] = useState(false);
  const wrongControls = useAnimationControls();

  function handleWrongTap() {
    // Gentle horizontal shake
    wrongControls.start({
      x: [0, -6, 6, -4, 4, -2, 2, 0],
      transition: { duration: 0.42, ease: "easeInOut" },
    });
    // Show hint briefly
    setHint(true);
    setTimeout(() => setHint(false), 2800);
  }

  const jointFirst = isJoint;

  function renderOption(optionIsJoint: boolean, delay: number) {
    const isMatch = optionIsJoint === isJoint;
    const label = optionIsJoint ? "Ya, Joint Income" : "Tidak, Penghasilan Sendiri";
    const sublabel = optionIsJoint
      ? "Penghasilan pasangan turut diasesmen"
      : "Hanya penghasilan nasabah yang diasesmen";
    const Icon = optionIsJoint ? Users : User;

    if (isMatch) {
      return (
        <motion.button
          key={label}
          type="button"
          onClick={onProceed}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay }}
          className={cn(
            "flex items-center gap-4 rounded-card bg-white p-4 text-left w-full",
            "ring-2 ring-bri-navy shadow-soft transition hover:shadow-panel active:scale-[0.99]"
          )}
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-bri-navy">
            <Icon size={18} strokeWidth={2} className="text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-bri-navy">{label}</p>
            <p className="text-xs text-bri-muted">{sublabel}</p>
          </div>
          <span className="shrink-0 rounded-pill bg-bri-navy px-2.5 py-1 text-xs font-medium text-white">
            Pilih
          </span>
        </motion.button>
      );
    }

    return (
      <motion.button
        key={label}
        type="button"
        onClick={handleWrongTap}
        animate={wrongControls}
        initial={{ opacity: 0, y: 10 }}
        transition={{ duration: 0.3, delay }}
        className={cn(
          "flex items-center gap-4 rounded-card bg-white p-4 text-left w-full",
          "ring-1 ring-bri-line shadow-soft transition hover:ring-bri-blue active:scale-[0.99]"
        )}
      >
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-bri-bg">
          <Icon size={18} strokeWidth={2} className="text-bri-muted" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-bri-ink">{label}</p>
          <p className="text-xs text-bri-muted">{sublabel}</p>
        </div>
      </motion.button>
    );
  }

  // Render matching option first based on persona, then the non-matching one
  const first = jointFirst ? true : false;
  const second = !first;

  return (
    <div className="flex flex-1 flex-col overflow-y-auto scroll-thin">
      <div className="flex flex-col gap-5 px-5 py-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h2 className="text-xl font-bold text-bri-navy">Pengajuan Joint Income?</h2>
          <p className="mt-1 text-sm text-bri-muted">
            Pilih apakah penghasilan pasangan turut disertakan dalam asesmen.
          </p>
        </motion.div>

        <div className="flex flex-col gap-3">
          {renderOption(first, 0.08)}
          {renderOption(second, 0.14)}
        </div>

        {/* Transient muted hint when wrong option is tapped */}
        <motion.div
          initial={false}
          animate={{ opacity: hint ? 1 : 0, height: hint ? "auto" : 0 }}
          transition={{ duration: 0.2 }}
          className="overflow-hidden"
        >
          <p className="text-center text-xs text-bri-muted italic">
            Untuk simulasi ini, pilih sesuai persona yang dipilih.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
