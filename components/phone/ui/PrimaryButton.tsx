"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

interface PrimaryButtonProps {
  children: ReactNode;
  onClick: () => void;
  disabled?: boolean;
  className?: string;
}

/**
 * Full-width primary CTA button for the NILAM phone flow.
 * Navy background, bubble radius, smooth press scale.
 */
export function PrimaryButton({ children, onClick, disabled, className }: PrimaryButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "w-full rounded-bubble bg-bri-navy py-3.5 text-base font-semibold text-white",
        "transition active:scale-[0.99]",
        "disabled:cursor-not-allowed disabled:opacity-40",
        className
      )}
    >
      {children}
    </button>
  );
}
