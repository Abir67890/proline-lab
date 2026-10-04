"use client";

import { useEffect, useRef, useState } from "react";

/**
 * stats.jsx — effets numériques additifs
 * NumberRoll : compteur "odomètre" déclenché à l'entrée en viewport.
 * CircularProgress : anneau de progression circulaire animé (SVG).
 */

function useInView(ref, threshold = 0.4) {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold }
    );
    io.observe(node);
    return () => io.disconnect();
  }, [ref, threshold]);
  return inView;
}

export function NumberRoll({ value, duration = 1400, className = "" }) {
  const ref = useRef(null);
  const inView = useInView(ref);
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let raf;
    const start = performance.now();
    const from = 0;
    const to = value;
    function tick(now) {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(Math.round(from + (to - from) * eased));
      if (t < 1) raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, value, duration]);

  return (
    <span ref={ref} className={`proline-number-roll ${className}`}>
      {display.toLocaleString("fr-FR")}
    </span>
  );
}

export function CircularProgress({ percent = 0, size = 96, stroke = 8, color = "var(--color-blue)", className = "" }) {
  const ref = useRef(null);
  const inView = useInView(ref);
  const [animated, setAnimated] = useState(0);
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;

  useEffect(() => {
    if (!inView) return;
    let raf;
    const start = performance.now();
    const duration = 1200;
    function tick(now) {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setAnimated(percent * eased);
      if (t < 1) raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, percent]);

  const offset = circumference - (animated / 100) * circumference;

  return (
    <div
      ref={ref}
      className={`proline-circular-progress ${className}`}
      style={{ width: size, height: size, position: "relative", display: "inline-flex", alignItems: "center", justifyContent: "center" }}
    >
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="color-mix(in srgb, var(--color-ink) 12%, transparent)"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 0.1s linear" }}
        />
      </svg>
      <span
        style={{
          position: "absolute",
          fontWeight: 700,
          fontSize: size * 0.22,
          color: "var(--color-ink)",
        }}
      >
        {Math.round(animated)}%
      </span>
    </div>
  );
}
