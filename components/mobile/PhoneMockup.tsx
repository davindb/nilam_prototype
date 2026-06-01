import type { ReactNode } from "react";

interface PhoneMockupProps {
  children: ReactNode;
}

/**
 * iPhone-style bezel mockup — black rounded frame, dynamic-island notch,
 * white inner screen area. Fixed 272×440 px so it fits the 300px left column.
 */
export function PhoneMockup({ children }: PhoneMockupProps) {
  return (
    <div
      className="relative mx-auto shrink-0"
      style={{
        width: 272,
        height: 440,
        background: "linear-gradient(145deg, #1a1a1a 0%, #0d0d0d 100%)",
        borderRadius: "2.2rem",
        padding: "8px",
        boxShadow:
          "0 24px 60px rgba(0,0,0,0.45), 0 0 0 1px rgba(255,255,255,0.08) inset, 0 2px 4px rgba(255,255,255,0.12) inset",
      }}
    >
      {/* Side buttons (decorative) */}
      <div
        className="absolute"
        style={{
          left: -3,
          top: 76,
          width: 3,
          height: 28,
          background: "#2a2a2a",
          borderRadius: "3px 0 0 3px",
        }}
      />
      <div
        className="absolute"
        style={{
          left: -3,
          top: 112,
          width: 3,
          height: 44,
          background: "#2a2a2a",
          borderRadius: "3px 0 0 3px",
        }}
      />
      <div
        className="absolute"
        style={{
          left: -3,
          top: 164,
          width: 3,
          height: 44,
          background: "#2a2a2a",
          borderRadius: "3px 0 0 3px",
        }}
      />
      {/* Power button */}
      <div
        className="absolute"
        style={{
          right: -3,
          top: 116,
          width: 3,
          height: 56,
          background: "#2a2a2a",
          borderRadius: "0 3px 3px 0",
        }}
      />

      {/* Inner screen */}
      <div
        className="relative flex h-full w-full flex-col overflow-hidden bg-white"
        style={{ borderRadius: "1.9rem" }}
      >
        {/* Dynamic Island notch */}
        <div className="absolute left-1/2 top-[6px] z-10 -translate-x-1/2">
          <div
            style={{
              width: 88,
              height: 22,
              background: "#0d0d0d",
              borderRadius: 999,
            }}
          />
        </div>

        {/* Screen content — pushed below notch area */}
        <div className="flex h-full flex-col pt-[28px]">{children}</div>
      </div>
    </div>
  );
}
