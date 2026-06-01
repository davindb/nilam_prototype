"use client";

import type { ReactNode } from "react";
import { Upload, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/cn";

interface UploadCardProps {
  title: string;
  hint: string;
  icon?: ReactNode;
  uploaded: boolean;
  fileName?: string;
  onPick: () => void;
}

/**
 * Dashed dropzone card that transitions into a confirmed-upload row.
 *
 * !uploaded: dashed border, upload icon, title + hint, tappable.
 * uploaded:  solid bri-bg background with a green check + filename.
 */
export function UploadCard({ title, hint, icon, uploaded, fileName, onPick }: UploadCardProps) {
  if (uploaded) {
    return (
      <div
        className={cn(
          "flex items-center gap-3 rounded-card bg-bri-bg px-4 py-3.5",
          "ring-1 ring-bri-navy/20"
        )}
      >
        <CheckCircle2 size={22} className="shrink-0 text-nilam-ok" strokeWidth={2} />
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-bri-navy">{title}</p>
          {fileName && (
            <p className="truncate text-xs text-bri-muted">{fileName}</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={onPick}
      className={cn(
        "flex w-full flex-col items-center gap-2 rounded-card border-2 border-dashed border-bri-line bg-white p-4",
        "text-center transition hover:border-bri-blue hover:bg-bri-bg/50 active:scale-[0.99]"
      )}
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-bri-bg text-bri-navy">
        {icon ?? <Upload size={20} strokeWidth={2} />}
      </div>
      <p className="text-sm font-medium text-bri-navy">{title}</p>
      <p className="text-xs text-bri-muted">{hint}</p>
    </button>
  );
}
