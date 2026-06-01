"use client";

import { useState } from "react";
import { Users, User } from "lucide-react";
import { cn } from "@/lib/cn";

interface JointIncomeScreenProps {
  isJoint: boolean;
  onProceed: () => void;
  onGoBack?: () => void;
  canGoBack?: boolean;
}

/**
 * Joint Income screen — two option cards.
 * The card matching `isJoint` triggers onProceed.
 * The non-matching card shows a gentle hint "Pilih sesuai persona".
 */
export function JointIncomeScreen({ isJoint, onProceed, onGoBack, canGoBack }: JointIncomeScreenProps) {
  const [shakeWrong, setShakeWrong] = useState(false);

  function handleWrongPick() {
    setShakeWrong(true);
    setTimeout(() => setShakeWrong(false), 500);
  }

  const cards = [
    {
      key: "joint",
      icon: <Users size={16} />,
      label: "Ya, Joint Income",
      desc: "Penghasilan digabungkan dengan pasangan",
      matchesPersona: isJoint,
    },
    {
      key: "single",
      icon: <User size={16} />,
      label: "Tidak, Penghasilan Sendiri",
      desc: "Penghasilan hanya dari nasabah",
      matchesPersona: !isJoint,
    },
  ];

  return (
    <div className="flex flex-1 flex-col px-4 py-3">
      {/* Title */}
      <div className="mb-3">
        <h2 className="text-sm font-bold text-nx-ink">Joint Income?</h2>
        <p className="mt-0.5 text-[10px] text-nx-muted">Pilih sesuai kondisi penghasilan Anda</p>
      </div>

      {/* Cards */}
      <div className="flex flex-1 flex-col gap-2">
        {cards.map((card) => (
          <button
            key={card.key}
            type="button"
            onClick={card.matchesPersona ? onProceed : handleWrongPick}
            className={cn(
              "flex w-full items-center gap-3 rounded-xl border-2 p-3 text-left transition-all active:scale-[0.98]",
              card.matchesPersona
                ? "border-nx-blue bg-blue-50 hover:bg-blue-100"
                : "border-gray-200 bg-white hover:border-gray-300",
              !card.matchesPersona && shakeWrong && "animate-[shake_0.4s_ease-in-out]"
            )}
          >
            <div
              className={cn(
                "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
                card.matchesPersona ? "bg-nx-blue text-white" : "bg-gray-100 text-gray-400"
              )}
            >
              {card.icon}
            </div>
            <div className="flex-1">
              <p
                className={cn(
                  "text-[11px] font-bold",
                  card.matchesPersona ? "text-nx-ink" : "text-gray-500"
                )}
              >
                {card.label}
              </p>
              <p className="text-[9px] text-nx-muted">{card.desc}</p>
            </div>
          </button>
        ))}
      </div>

      {/* Wrong-pick hint */}
      {shakeWrong && (
        <p className="mt-1 text-center text-[9px] text-amber-500">
          Pilih sesuai persona
        </p>
      )}

      {/* Back */}
      {canGoBack && (
        <button
          type="button"
          onClick={onGoBack}
          className="mt-3 text-center text-[10px] text-nx-muted transition-colors hover:text-nx-blue"
        >
          ← Kembali
        </button>
      )}
    </div>
  );
}
