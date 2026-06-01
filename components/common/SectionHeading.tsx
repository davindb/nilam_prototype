import { cn } from "@/lib/cn";
import type { ReactNode } from "react";

interface SectionHeadingProps {
  children: ReactNode;
  className?: string;
}

/**
 * Shared 11px uppercase semibold heading used by every orchestration section
 * so the panel keeps one consistent visual rhythm. Mirrors SOFIA's SectionHeading.
 */
export function SectionHeading({ children, className }: SectionHeadingProps) {
  return (
    <h3
      className={cn(
        "text-[11px] font-semibold uppercase tracking-[0.14em] text-bri-muted",
        className
      )}
    >
      {children}
    </h3>
  );
}
