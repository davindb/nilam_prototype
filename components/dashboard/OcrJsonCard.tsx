"use client";

import { cn } from "@/lib/cn";
import type { NodeStatus } from "@/types/orchestration";
import type { OcrSlipResult, OcrMutasiResult } from "@/types/engines";

interface OcrJsonCardProps {
  ocrStatus: NodeStatus;
  slip: OcrSlipResult;
  mutasi: OcrMutasiResult;
}

/** Syntax-colored JSON token types */
type TokenType = "key" | "number" | "punctuation" | "whitespace";

interface Token {
  type: TokenType;
  text: string;
}

/** Very lightweight JSON tokenizer — handles keys, numbers, and punctuation. */
function tokenize(value: unknown, indent = 0): Token[] {
  const tokens: Token[] = [];
  const pad = "  ".repeat(indent);
  const padInner = "  ".repeat(indent + 1);

  if (typeof value === "number") {
    tokens.push({ type: "number", text: String(value) });
  } else if (typeof value === "object" && value !== null) {
    tokens.push({ type: "punctuation", text: "{" });
    const entries = Object.entries(value as Record<string, unknown>);
    entries.forEach(([k, v], idx) => {
      tokens.push({ type: "whitespace", text: "\n" + padInner });
      tokens.push({ type: "key", text: `"${k}"` });
      tokens.push({ type: "punctuation", text: ": " });
      tokens.push(...tokenize(v, indent + 1));
      if (idx < entries.length - 1) {
        tokens.push({ type: "punctuation", text: "," });
      }
    });
    tokens.push({ type: "whitespace", text: "\n" + pad });
    tokens.push({ type: "punctuation", text: "}" });
  }

  return tokens;
}

/** Renders a syntax-colored JSON block. */
function JsonBlock({
  title,
  data,
}: {
  title: string;
  data: unknown;
}) {
  const tokens = tokenize(data);

  return (
    <div className="flex flex-1 flex-col min-w-0 min-h-0">
      <span className="mb-1 block text-[9px] font-semibold text-bri-ink">
        {title}
      </span>
      <div className="flex-1 min-h-0 overflow-y-auto scroll-thin rounded-lg bg-bri-bg/60 px-2 py-1.5">
        <pre className="text-[9px] leading-[1.25] font-mono whitespace-pre-wrap break-words">
          {tokens.map((token, i) => (
            <span
              key={i}
              className={cn(
                token.type === "key" && "text-bri-blue font-medium",
                token.type === "number" && "text-emerald-600",
                token.type === "punctuation" && "text-bri-muted",
                token.type === "whitespace" && "text-transparent select-none"
              )}
            >
              {token.text}
            </span>
          ))}
        </pre>
      </div>
    </div>
  );
}

/**
 * OcrJsonCard — renders pretty-printed, syntax-colored JSON for Slip Gaji
 * and Mutasi Rekening side-by-side (or stacked when narrow).
 *
 * Content is hidden (shows "Menunggu OCR…") when ocrStatus === "idle".
 */
export function OcrJsonCard({ ocrStatus, slip, mutasi }: OcrJsonCardProps) {
  const isDone = ocrStatus === "success";

  return (
    <div className="flex flex-1 flex-col rounded-xl border border-bri-line bg-white p-2 shadow-soft min-h-0">
      {/* Section label */}
      <span className="mb-1.5 block shrink-0 text-[9px] font-semibold uppercase tracking-[0.12em] text-bri-muted">
        OCR Result (JSON)
      </span>

      {isDone ? (
        <div className="flex flex-1 gap-2 min-h-0">
          <JsonBlock title="Slip Gaji" data={slip} />
          <JsonBlock title="Mutasi Rekening" data={mutasi} />
        </div>
      ) : (
        <div className="flex flex-1 items-center justify-center">
          <span className="text-[10px] text-bri-muted/40 italic">Menunggu hasil ekstraksi…</span>
        </div>
      )}
    </div>
  );
}
