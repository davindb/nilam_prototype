"use client";

import { Camera, UserCheck } from "lucide-react";
import { cn } from "@/lib/cn";

interface SelfieCaptureProps {
  captured: boolean;
  onCapture: () => void;
}

/**
 * Framed camera box for liveness selfie capture.
 *
 * !captured: dashed frame + camera icon + instruction text, tappable.
 * captured:  solid bri-bg frame with a user-check icon + "Terverifikasi".
 */
export function SelfieCapture({ captured, onCapture }: SelfieCaptureProps) {
  if (captured) {
    return (
      <div
        className={cn(
          "flex aspect-square items-center justify-center rounded-card bg-bri-bg",
          "ring-1 ring-bri-navy/20"
        )}
      >
        <div className="flex flex-col items-center gap-2 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-nilam-ok/10">
            <UserCheck size={28} className="text-nilam-ok" strokeWidth={2} />
          </div>
          <p className="text-sm font-semibold text-nilam-ok">Terverifikasi</p>
          <p className="text-xs text-bri-muted">Liveness selfie berhasil</p>
        </div>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={onCapture}
      className={cn(
        "flex aspect-square w-full flex-col items-center justify-center gap-3 rounded-card",
        "border-2 border-dashed border-bri-line bg-white text-center",
        "transition hover:border-bri-blue hover:bg-bri-bg/50 active:scale-[0.99]"
      )}
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-bri-bg">
        <Camera size={28} strokeWidth={1.8} className="text-bri-navy" />
      </div>
      <div>
        <p className="text-sm font-semibold text-bri-navy">Ambil Selfie</p>
        <p className="mx-4 text-xs text-bri-muted leading-relaxed">
          Sambil memegang KTP pasangan
        </p>
      </div>
    </button>
  );
}
