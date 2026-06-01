import { cn } from "@/lib/cn";
import type { ReactNode } from "react";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
}

/**
 * Lightweight glass-morphism card using the nilam-glass gradient,
 * card border-radius, backdrop-blur, a subtle ring, and soft shadow.
 */
export function GlassCard({ children, className }: GlassCardProps) {
  return (
    <div
      className={cn(
        "rounded-card bg-nilam-glass backdrop-blur-sm ring-1 ring-bri-line shadow-soft",
        className
      )}
    >
      {children}
    </div>
  );
}
