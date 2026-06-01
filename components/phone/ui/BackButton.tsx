"use client";

import { ChevronLeft } from "lucide-react";

interface BackButtonProps {
  onClick: () => void;
}

/**
 * A slim back navigation control.
 * Renders a ChevronLeft icon + "Kembali" label.
 * The parent screen/page decides when to show this.
 */
export function BackButton({ onClick }: BackButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-1 text-sm text-bri-muted transition-colors hover:text-bri-navy"
    >
      <ChevronLeft size={18} strokeWidth={2} />
      <span>Kembali</span>
    </button>
  );
}
