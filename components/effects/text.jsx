"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";

/** Classic typewriter — types then optionally deletes/loops. */
export function Typewriter({ text, speed = 45, loop = false, className = "" }) {
  const [out, setOut] = useState("");
  useEffect(() => {
    let i = 0, deleting = false, timer;
    function tick() {
      if (!deleting) {
        i++;
        setOut(text.slice(0, i));
        if (i >= text.length) {
          if (!loop) return;
          timer = setTimeout(() => { deleting = true; tick(); }, 1200);
          return;
        }
      } else {
        i--;
        setOut(text.slice(0, i));
        if (i <= 0) deleting = false;
      }
      timer = setTimeout(tick, deleting ? speed / 2 : speed);
    }
    tick();
    return () => clearTimeout(timer);
  }, [text, speed, loop]);
  return (
    <span className={`typewriter ${className}`}>
      {out}
      <span className="tw-caret">|</span>
      <style jsx>{`
        .tw-caret { animation: tw-blink 1s steps(1) infinite; }
        @keyframes tw-blink { 50% { opacity: 0; } }
      `}</style>
    </span>
  );
}

/** Animated gradient text (CSS background-clip, no JS needed). */
export function GradientText({ children, className = "", colors = ["#D98E04", "#8B2942", "#0092C7"] }) {
  return (
    <span
      className={`gradient-text ${className}`}
      style={{
        backgroundImage: `linear-gradient(90deg, ${colors.join(",")}, ${colors[0]})`,
      }}
    >
      {children}
      <style jsx>{`
        .gradient-text {
          background-size: 300% 100%;
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          animation: grad-shift 6s ease infinite;
        }
        @keyframes grad-shift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </span>
  );
}

/** Glowing neon-style text. */
export function NeonText({ children, color = "#39ff14", className = "" }) {
  return (
    <span className={`neon-text ${className}`} style={{ color, ["--glow"]: color }}>
      {children}
      <style jsx>{`
        .neon-text {
          text-shadow:
            0 0 6px var(--glow),
            0 0 18px var(--glow),
            0 0 32px var(--glow);
        }
      `}</style>
    </span>
  );
}

/** Text set along a circular path, optionally spinning. */
export function CircularText({ text, radius = 80, spin = true, className = "" }) {
  const chars = useMemo(() => Array.from(text), [text]);
  const step = 360 / chars.length;
  return (
    <div className={`circular-text ${className}`} style={{ width: radius * 2, height: radius * 2, animation: spin ? "circ-spin 12s linear infinite" : undefined }}>
      {chars.map((c, i) => (
        <span key={i} style={{ transform: `rotate(${i * step}deg) translateY(-${radius}px)` }}>{c}</span>
      ))}
      <style jsx>{`
        .circular-text { position: relative; }
        .circular-text span {
          position: absolute; left: 50%; top: 50%;
          transform-origin: 0 0;
          font-size: 13px; letter-spacing: 1px;
        }
        @keyframes circ-spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}

/** Reveals text through an expanding clip-path mask. */
export function MaskReveal({ children, className = "", delay = 0 }) {
  return (
    <span className={`mask-reveal-wrap ${className}`}>
      <motion.span
        className="mask-reveal-inner"
        initial={{ clipPath: "inset(0 100% 0 0)" }}
        whileInView={{ clipPath: "inset(0 0% 0 0)" }}
        viewport={{ once: true }}
        transition={{ duration: 0.9, delay, ease: [0.77, 0, 0.18, 1] }}
      >
        {children}
      </motion.span>
    </span>
  );
}

/** Each character rises and falls in a wave as it enters view. */
export function CharWave({ text, className = "", delay = 0 }) {
  const chars = useMemo(() => Array.from(text), [text]);
  return (
    <span className={className}>
      {chars.map((c, i) => (
        <motion.span
          key={i}
          style={{ display: "inline-block" }}
          initial={{ y: 0 }}
          whileInView={{ y: [0, -10, 0] }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: delay + i * 0.04, ease: "easeInOut" }}
        >
          {c === " " ? "\u00A0" : c}
        </motion.span>
      ))}
    </span>
  );
}

/** Characters bounce in with a spring on scroll-into-view. */
export function CharBounce({ text, className = "", delay = 0 }) {
  const chars = useMemo(() => Array.from(text), [text]);
  return (
    <span className={className}>
      {chars.map((c, i) => (
        <motion.span
          key={i}
          style={{ display: "inline-block" }}
          initial={{ y: -30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 420, damping: 12, delay: delay + i * 0.03 }}
        >
          {c === " " ? "\u00A0" : c}
        </motion.span>
      ))}
    </span>
  );
}

/** Words slide in from alternating sides. */
export function SlidingWords({ text, className = "" }) {
  const words = useMemo(() => text.split(" "), [text]);
  return (
    <span className={className}>
      {words.map((w, i) => (
        <motion.span
          key={i}
          style={{ display: "inline-block", marginRight: "0.3em" }}
          initial={{ x: i % 2 === 0 ? -40 : 40, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
        >
          {w}
        </motion.span>
      ))}
    </span>
  );
}

/** Outlined "stroke drawing" text using -webkit-text-stroke + fill wipe. */
export function StrokeDrawText({ children, className = "", color = "#fff" }) {
  return (
    <span className={`stroke-text ${className}`} style={{ ["--stroke"]: color }}>
      {children}
      <style jsx>{`
        .stroke-text {
          color: transparent;
          -webkit-text-stroke: 1px var(--stroke);
          background-image: linear-gradient(var(--stroke), var(--stroke));
          background-repeat: no-repeat;
          background-size: 0% 100%;
          -webkit-background-clip: text;
          background-clip: text;
          transition: background-size 1.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .stroke-text:hover, .stroke-text.in-view {
          background-size: 100% 100%;
        }
      `}</style>
    </span>
  );
}

/** SVG path that "handwrites" itself in using stroke-dashoffset. */
export function SvgHandwriting({ d, viewBox = "0 0 300 100", className = "", duration = 2.4 }) {
  const ref = useRef(null);
  useEffect(() => {
    const path = ref.current;
    if (!path) return;
    const len = path.getTotalLength();
    path.style.strokeDasharray = len;
    path.style.strokeDashoffset = len;
  }, []);
  return (
    <svg viewBox={viewBox} className={className}>
      <motion.path
        ref={ref}
        d={d}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration, ease: "easeInOut" }}
      />
    </svg>
  );
}

/** Vertically rotating word list (like a flip clock), swaps every `interval`ms. */
export function RotatingText({ words, interval = 2200, className = "" }) {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((v) => (v + 1) % words.length), interval);
    return () => clearInterval(t);
  }, [words.length, interval]);
  return (
    <span className={`rotating-text ${className}`} style={{ display: "inline-block", overflow: "hidden", verticalAlign: "bottom" }}>
      <motion.span
        key={i}
        style={{ display: "inline-block" }}
        initial={{ y: "100%", opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: "-100%", opacity: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        {words[i]}
      </motion.span>
    </span>
  );
}

/** Splits by line (not letter/word) for large headline reveals. */
export function SplitLines({ lines, className = "", delay = 0 }) {
  return (
    <span className={className}>
      {lines.map((line, i) => (
        <span key={i} style={{ display: "block", overflow: "hidden" }}>
          <motion.span
            style={{ display: "block" }}
            initial={{ y: "100%" }}
            whileInView={{ y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: delay + i * 0.12, ease: [0.16, 1, 0.3, 1] }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </span>
  );
}
