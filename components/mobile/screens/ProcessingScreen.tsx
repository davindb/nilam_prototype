"use client";

/**
 * Processing screen — shown while the orchestration pipeline is running.
 * Centered animated ring + "Memproses…" label.
 */
export function ProcessingScreen() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-3 px-4">
      {/* Animated spinner ring */}
      <div className="relative flex h-14 w-14 items-center justify-center">
        {/* Outer track */}
        <div className="absolute inset-0 rounded-full border-4 border-blue-100" />
        {/* Spinning arc */}
        <div
          className="absolute inset-0 animate-spin rounded-full border-4 border-transparent"
          style={{
            borderTopColor: "#2563EB",
            borderRightColor: "#4F46E5",
          }}
        />
        {/* Inner dot */}
        <div className="h-3 w-3 rounded-full bg-nx-blue opacity-70" />
      </div>

      <div className="text-center">
        <p className="text-sm font-semibold text-nx-ink">Memproses…</p>
        <p className="mt-0.5 text-[9px] text-nx-muted">Harap tunggu sebentar</p>
      </div>
    </div>
  );
}
