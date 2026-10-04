"use client";
import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

/** Odometer-style rolling digits (each digit spins to its final value). */
export function NumberRoll({ value, className = "" }) {
  const digits = String(value).split("");
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  return (
    <span ref={ref} className={`number-roll ${className}`} style={{ display: "inline-flex" }}>
      {digits.map((d, i) => (
        <span key={i} style={{ overflow: "hidden", height: "1.2em", display: /\d/.test(d) ? "inline-block" : "inline" }}>
          {/\d/.test(d) ? (
            <motion.span
              style={{ display: "block" }}
              initial={{ y: "-90%" }}
              animate={inView ? { y: 0 } : {}}
              transition={{ duration: 0.9, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
            >
              {d}
            </motion.span>
          ) : d}
        </span>
      ))}
    </span>
  );
}

/** Circular SVG progress ring, animates its stroke on scroll-into-view. */
export function CircularProgress({ percent = 75, size = 120, stroke = 8, color = "#2E9E5B", className = "" }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const r = (size - stroke) / 2;
  const circumference = 2 * Math.PI * r;
  return (
    <div ref={ref} className={className} style={{ width: size, height: size, position: "relative" }}>
      <svg width={size} height={size}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,.15)" strokeWidth={stroke} />
        <motion.circle
          cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: inView ? circumference * (1 - percent / 100) : circumference }}
          transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", fontWeight: 600 }}>{percent}%</div>
    </div>
  );
}
