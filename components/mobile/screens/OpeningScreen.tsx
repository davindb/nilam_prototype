"use client";

import { cn } from "@/lib/cn";

interface OpeningScreenProps {
  personaSelected: boolean;
  onStart: () => void;
}

/**
 * Opening screen — centered NILAM logo + brand mark + tagline + "Mulai" button.
 * Compact: fits within ~300px screen height with no scroll.
 */
export function OpeningScreen({ personaSelected, onStart }: OpeningScreenProps) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 px-5 py-4">
      {/* Logo mark */}
      <div
        className="flex h-14 w-14 items-center justify-center rounded-2xl shadow-md"
        style={{
          background: "linear-gradient(135deg, #2563EB 0%, #4F46E5 100%)",
        }}
        aria-hidden="true"
      >
        <svg
          width="28"
          height="28"
          viewBox="0 0 18 18"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M9 1.5L15.5 5.25V12.75L9 16.5L2.5 12.75V5.25L9 1.5Z"
            stroke="white"
            strokeWidth="1.4"
            strokeLinejoin="round"
          />
          <line x1="9" y1="5" x2="9" y2="13" stroke="white" strokeWidth="1.2" strokeLinecap="round" />
          <line x1="5" y1="7" x2="13" y2="11" stroke="white" strokeWidth="1.2" strokeLinecap="round" />
          <line x1="13" y1="7" x2="5" y2="11" stroke="white" strokeWidth="1.2" strokeLinecap="round" />
          <circle cx="9" cy="9" r="1.2" fill="white" />
        </svg>
      </div>

      {/* Wordmark */}
      <div className="text-center">
        <p className="text-xl font-bold tracking-widest text-nx-ink">NILAM</p>
        <p className="mt-0.5 text-[10px] text-nx-muted">New Intelligent Loan Application</p>
      </div>

      {/* Tagline */}
      <p className="text-center text-[10px] leading-relaxed text-nx-muted">
        Ajukan kredit dengan mudah &amp; cepat.
      </p>

      {/* Mulai button */}
      <div className="w-full">
        <button
          type="button"
          onClick={personaSelected ? onStart : undefined}
          disabled={!personaSelected}
          className={cn(
            "w-full rounded-full py-2.5 text-sm font-semibold text-white transition-all",
            personaSelected
              ? "cursor-pointer hover:opacity-90 active:scale-[0.98]"
              : "cursor-not-allowed opacity-50"
          )}
          style={{
            background: personaSelected
              ? "linear-gradient(90deg, #2563EB 0%, #4F46E5 100%)"
              : "linear-gradient(90deg, #94A3B8 0%, #94A3B8 100%)",
          }}
        >
          Mulai
        </button>
        {!personaSelected && (
          <p className="mt-1.5 text-center text-[9px] text-nx-muted">
            Pilih persona terlebih dahulu
          </p>
        )}
      </div>
    </div>
  );
}
