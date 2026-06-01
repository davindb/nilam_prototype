"use client";

import { useState, useEffect } from "react";
import { animate } from "framer-motion";

/**
 * Animates from the previous value to a new `value` whenever `value` changes.
 * Returns the current animated number (rounded integer).
 *
 * Uses Framer Motion's `animate()` under the hood so it integrates naturally
 * with the rest of the NILAM animation system.
 *
 * @param value   Target number to animate toward.
 * @param durationMs  Animation duration in milliseconds (default 400).
 */
export function useCountUp(value: number, durationMs = 400): number {
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    // Kick off Framer Motion's value animation from the current display value.
    const controls = animate(display, value, {
      duration: durationMs / 1000,
      ease: "easeOut",
      onUpdate: (latest) => {
        setDisplay(Math.round(latest));
      },
    });

    return () => {
      controls.stop();
    };
    // `display` is intentionally omitted — we only retarget when `value` changes.
    // Including display would cause infinite loops.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, durationMs]);

  return display;
}
