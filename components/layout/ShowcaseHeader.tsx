import { cn } from "@/lib/cn";

interface ShowcaseHeaderProps {
  className?: string;
}

/**
 * Top banner of the NILAM showcase page.
 *
 * Presents the "NILAM" wordmark and the expanded
 * "New Intelligent Loan Application Management" subtitle in restrained,
 * executive BRI-navy branding — mirroring the SOFIA ShowcaseHeader structure.
 */
export function ShowcaseHeader({ className }: ShowcaseHeaderProps) {
  return (
    <header className={cn("flex flex-col items-center text-center", className)}>
      <h1 className="text-2xl font-bold tracking-[0.18em] text-bri-navy">
        NILAM
      </h1>
      <p className="mt-1 text-xs font-medium uppercase tracking-[0.22em] text-bri-muted">
        New Intelligent Loan Application Management
      </p>
    </header>
  );
}
