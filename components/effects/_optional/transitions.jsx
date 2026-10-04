"use client";
import { motion } from "framer-motion";

export const transitionVariants = {
  fade: { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } },
  blur: { initial: { opacity: 0, filter: "blur(16px)" }, animate: { opacity: 1, filter: "blur(0px)" }, exit: { opacity: 0, filter: "blur(16px)" } },
  scale: { initial: { opacity: 0, scale: 0.9 }, animate: { opacity: 1, scale: 1 }, exit: { opacity: 0, scale: 1.05 } },
  rotate: { initial: { opacity: 0, rotate: -4 }, animate: { opacity: 1, rotate: 0 }, exit: { opacity: 0, rotate: 4 } },
  flip: { initial: { opacity: 0, rotateX: 90 }, animate: { opacity: 1, rotateX: 0 }, exit: { opacity: 0, rotateX: -90 } },
};

/** Two panels slide apart like a curtain to reveal the next section. */
export function CurtainReveal({ onDone, color = "#0A1D1A" }) {
  return (
    <>
      <motion.div
        style={{ position: "fixed", inset: "0 50% 0 0", background: color, zIndex: 9999 }}
        initial={{ x: 0 }} animate={{ x: "-100%" }} transition={{ duration: 1, delay: 0.1, ease: [0.85, 0, 0.15, 1] }}
        onAnimationComplete={onDone}
      />
      <motion.div
        style={{ position: "fixed", inset: "0 0 0 50%", background: color, zIndex: 9999 }}
        initial={{ x: 0 }} animate={{ x: "100%" }} transition={{ duration: 1, delay: 0.1, ease: [0.85, 0, 0.15, 1] }}
      />
    </>
  );
}

/** Expanding circle wipe, centered on a given origin (defaults to viewport center). */
export function CircularReveal({ originX = "50%", originY = "50%", color = "#0A1D1A", onDone }) {
  return (
    <motion.div
      style={{
        position: "fixed", inset: 0, zIndex: 9999, background: color,
        clipPath: `circle(150% at ${originX} ${originY})`,
      }}
      initial={{ clipPath: `circle(150% at ${originX} ${originY})` }}
      animate={{ clipPath: `circle(0% at ${originX} ${originY})` }}
      transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
      onAnimationComplete={onDone}
    />
  );
}

/** Wobbly "liquid" wipe transition using an SVG turbulence filter. */
export function LiquidTransition({ onDone, color = "#0A1D1A" }) {
  return (
    <>
      <svg width="0" height="0">
        <filter id="liquid-filter">
          <feTurbulence type="fractalNoise" baseFrequency="0.01 0.04" numOctaves="2" seed="7" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="60" />
        </filter>
      </svg>
      <motion.div
        style={{ position: "fixed", inset: 0, zIndex: 9999, background: color, filter: "url(#liquid-filter)" }}
        initial={{ scaleY: 1 }}
        animate={{ scaleY: 0 }}
        transition={{ duration: 1, ease: [0.85, 0, 0.15, 1] }}
        onAnimationComplete={onDone}
      />
    </>
  );
}
