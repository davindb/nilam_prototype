"use client";

import { CheckCircle2, RefreshCw } from "lucide-react";

interface AnalystDecisionScreenProps {
  onRestart: () => void;
}

/**
 * Analyst Decision / completion screen.
 * Premium feel: green check, confirmation copy, faux case ID, restart link.
 */
export function AnalystDecisionScreen({ onRestart }: AnalystDecisionScreenProps) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-3 px-5 py-4">
      {/* Success icon */}
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-100">
        <CheckCircle2 size={32} className="text-nx-ok" strokeWidth={1.8} />
      </div>

      {/* Copy */}
      <div className="text-center">
        <p className="text-sm font-bold text-nx-ink">Pengajuan Terkirim</p>
        <p className="mt-1 text-[10px] leading-relaxed text-nx-muted">
          Menunggu keputusan Credit Analyst.
        </p>
      </div>

      {/* Case ID badge */}
      <div className="rounded-xl border border-nx-line bg-nx-bg px-4 py-2 text-center">
        <p className="text-[8px] text-nx-muted">Nomor Pengajuan</p>
        <p className="mt-0.5 font-mono text-[11px] font-semibold text-nx-blue">
          NILAM-2026-0000123
        </p>
      </div>

      {/* Restart */}
      <button
        type="button"
        onClick={onRestart}
        className="mt-1 flex items-center gap-1.5 text-[10px] text-nx-muted transition-colors hover:text-nx-blue"
      >
        <RefreshCw size={11} />
        Mulai aplikasi baru
      </button>
    </div>
  );
}
