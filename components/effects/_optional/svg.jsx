"use client";
import { motion } from "framer-motion";

/** Draws any SVG path progressively (used for logos, icons, underlines). */
export function PathDraw({ d, viewBox = "0 0 100 100", stroke = "#fff", strokeWidth = 2, duration = 1.6, className = "" }) {
  return (
    <svg viewBox={viewBox} className={className}>
      <motion.path
        d={d}
        fill="none"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }}
        whileInView={{ pathLength: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration, ease: "easeInOut" }}
      />
    </svg>
  );
}

/** Morphs between two path shapes on hover/toggle (free equivalent of MorphSVG). */
export function MorphIcon({ pathA, pathB, viewBox = "0 0 100 100", active, className = "" }) {
  return (
    <svg viewBox={viewBox} className={className}>
      <motion.path
        fill="currentColor"
        animate={{ d: active ? pathB : pathA }}
        transition={{ duration: 0.5, ease: [0.65, 0, 0.35, 1] }}
      />
    </svg>
  );
}

/** A line that "traces" along a path in a loop — good for connecting diagrams. */
export function LineTrace({ d, viewBox = "0 0 200 60", color = "#D98E04", className = "" }) {
  return (
    <svg viewBox={viewBox} className={className}>
      <path d={d} fill="none" stroke="rgba(255,255,255,.15)" strokeWidth={2} />
      <motion.path
        d={d}
        fill="none"
        stroke={color}
        strokeWidth={3}
        strokeLinecap="round"
        strokeDasharray="20 380"
        animate={{ strokeDashoffset: [400, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
      />
    </svg>
  );
}
