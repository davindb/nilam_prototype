import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

interface PhoneFrameProps {
  children: ReactNode;
  className?: string;
}

/**
 * A device-style frame that hosts the NILAM loan flow UI.
 *
 * Fixed at roughly a phone aspect ratio (~400 x 760), with a rounded white
 * body, a deep drop shadow, and a slim top strip carrying three light-blue
 * window-control shapes at the top-right — mirroring the SOFIA PhoneFrame.
 */
export function PhoneFrame({ children, className }: PhoneFrameProps) {
  return (
    <div
      className={cn(
        "flex h-[760px] w-[400px] max-w-full flex-col overflow-hidden rounded-[32px] bg-white shadow-phone",
        className
      )}
    >
      {/* Window-control strip */}
      <div className="flex h-7 shrink-0 items-center justify-end gap-1.5 px-5">
        <span className="h-2.5 w-2.5 rounded-[3px] bg-bri-sky/70" />
        <span className="h-2.5 w-2.5 rounded-full bg-bri-sky/50" />
        <span
          className="h-0 w-0 border-x-[5px] border-t-[7px] border-x-transparent border-t-bri-sky/60"
          aria-hidden
        />
      </div>
      {children}
    </div>
  );
}
