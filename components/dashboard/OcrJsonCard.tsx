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
    <div className="flex flex-1 flex-col min-w-0">
      <span className="mb-1 block text-[9px] font-semibold text-nx-ink">
        {title}
      </span>
      <div className="flex-1 overflow-auto rounded-lg bg-gray-50 px-2 py-1.5">
        <pre className="text-[9px] leading-relaxed font-mono whitespace-pre-wrap break-words">
          {tokens.map((token, i) => (
            <span
              key={i}
              className={cn(
                token.type === "key" && "text-nx-blue font-medium",
                token.type === "number" && "text-nx-ok",
                token.type === "punctuation" && "text-gray-500",
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
  const isIdle = ocrStatus === "idle";

  return (
    <div className="flex flex-1 flex-col rounded-xl border border-nx-line bg-white p-2 shadow-sm">
      {/* Section label */}
      <span className="mb-2 block text-[9px] font-bold uppercase tracking-widest text-nx-muted">
        OCR Result (JSON)
      </span>

      {isIdle ? (
        <div className="flex flex-1 items-center justify-center">
          <span className="text-[10px] text-gray-300 italic">Menunggu OCR…</span>
        </div>
      ) : (
        <div className="flex flex-1 gap-2 min-h-0">
          <JsonBlock title="Slip Gaji" data={slip} />
          <JsonBlock title="Mutasi Rekening" data={mutasi} />
        </div>
      )}
    </div>
  );
}
