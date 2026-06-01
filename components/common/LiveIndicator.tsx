interface LiveIndicatorProps {
  label?: string;
}

/**
 * Tiny live-status indicator: emerald animate-ping ring + solid dot + label.
 * Mirrors SOFIA's LiveReasoningIndicator. Default label: "Live Reasoning".
 */
export function LiveIndicator({ label = "Live Reasoning" }: LiveIndicatorProps) {
  return (
    <div className="inline-flex items-center gap-2">
      <span className="relative inline-flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-60" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
      </span>
      <span className="text-xs text-bri-muted">{label}</span>
    </div>
  );
}
