"use client";

import { TrendingUp, Lock } from "lucide-react";

interface IncomeTypeScreenProps {
  onPickFix: () => void;
  onGoBack?: () => void;
  canGoBack?: boolean;
}

/**
 * Income Type selection screen.
 * "Fix Income" card is selectable (blue ring, TrendingUp icon, "Tersedia" pill).
 * "Non Fix Income" is disabled (lock icon, "Segera hadir" pill).
 */
export function IncomeTypeScreen({ onPickFix, onGoBack, canGoBack }: IncomeTypeScreenProps) {
  return (
    <div className="flex flex-1 flex-col px-4 py-3">
      {/* Title */}
      <div className="mb-3">
        <h2 className="text-sm font-bold text-nx-ink">Pilih Tipe Penghasilan</h2>
        <p className="mt-0.5 text-[10px] text-nx-muted">Sesuai dengan profil Anda</p>
      </div>

      {/* Cards */}
      <div className="flex flex-1 flex-col gap-2">
        {/* Fix Income — active/selectable */}
        <button
          type="button"
          onClick={onPickFix}
          className="flex w-full cursor-pointer items-center gap-3 rounded-xl border-2 border-nx-blue bg-blue-50 p-3 transition-all hover:bg-blue-100 active:scale-[0.98]"
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-nx-blue text-white">
            <TrendingUp size={16} />
          </div>
          <div className="flex-1 text-left">
            <p className="text-[11px] font-bold text-nx-ink">Fix Income</p>
            <p className="text-[9px] text-nx-muted">Penghasilan tetap bulanan</p>
          </div>
          <span className="shrink-0 rounded-full bg-nx-blue px-2 py-0.5 text-[8px] font-semibold text-white">
            Tersedia
          </span>
        </button>

        {/* Non Fix Income — disabled */}
        <div className="flex w-full cursor-not-allowed items-center gap-3 rounded-xl border-2 border-gray-200 bg-gray-50 p-3 opacity-60">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gray-200 text-gray-400">
            <Lock size={16} />
          </div>
          <div className="flex-1 text-left">
            <p className="text-[11px] font-bold text-gray-400">Non Fix Income</p>
            <p className="text-[9px] text-gray-400">Penghasilan variabel</p>
          </div>
          <span className="shrink-0 rounded-full bg-gray-200 px-2 py-0.5 text-[8px] font-semibold text-gray-400">
            Segera hadir
          </span>
        </div>
      </div>

      {/* Back */}
      {canGoBack && (
        <button
          type="button"
          onClick={onGoBack}
          className="mt-3 text-center text-[10px] text-nx-muted transition-colors hover:text-nx-blue"
        >
          ← Kembali
        </button>
      )}
    </div>
  );
}
