"use client";
import { useRef } from "react";

/** Soft neumorphic card (light-on-light embossed look). */
export function NeumorphCard({ children, className = "", bg = "#e9ecef" }) {
  return (
    <div className={`neumorph-card ${className}`} style={{ background: bg }}>
      {children}
      <style jsx>{`
        .neumorph-card {
          border-radius: 24px; padding: 28px;
          box-shadow: 8px 8px 16px rgba(0,0,0,.15), -8px -8px 16px rgba(255,255,255,.5);
          transition: box-shadow .3s ease;
        }
        .neumorph-card:hover {
          box-shadow: 4px 4px 10px rgba(0,0,0,.18), -4px -4px 10px rgba(255,255,255,.6);
        }
      `}</style>
    </div>
  );
}

/** Card whose border is "traced" by a moving gradient dash on hover. */
export function BorderTraceCard({ children, className = "" }) {
  return (
    <div className={`trace-card ${className}`}>
      <div className="trace-line" />
      <div className="trace-content">{children}</div>
      <style jsx>{`
        .trace-card { position: relative; border-radius: 20px; overflow: hidden; }
        .trace-line {
          position: absolute; inset: 0; border-radius: inherit; padding: 2px;
          background: conic-gradient(from 0deg, transparent 0%, #fff 8%, transparent 16%);
          -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
          -webkit-mask-composite: xor; mask-composite: exclude;
          opacity: 0; transition: opacity .3s ease; animation: trace-spin 3s linear infinite;
        }
        .trace-card:hover .trace-line { opacity: 1; }
        .trace-content { position: relative; z-index: 1; }
        @keyframes trace-spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}

/** Card with a soft glow that follows the mouse pointer. */
export function MouseGlowCard({ children, className = "", glow = "rgba(255,255,255,.25)" }) {
  const ref = useRef(null);
  function onMove(e) {
    const r = ref.current.getBoundingClientRect();
    ref.current.style.setProperty("--gx", `${e.clientX - r.left}px`);
    ref.current.style.setProperty("--gy", `${e.clientY - r.top}px`);
  }
  return (
    <div ref={ref} className={`glow-card ${className}`} onMouseMove={onMove} style={{ ["--glow-color"]: glow }}>
      {children}
      <style jsx>{`
        .glow-card { position: relative; border-radius: 20px; overflow: hidden; }
        .glow-card::before {
          content: ""; position: absolute; inset: 0; opacity: 0; transition: opacity .3s ease;
          background: radial-gradient(220px circle at var(--gx,50%) var(--gy,50%), var(--glow-color), transparent 70%);
          pointer-events: none;
        }
        .glow-card:hover::before { opacity: 1; }
      `}</style>
    </div>
  );
}

/** Ripple-hover card: soft circular bloom expands from cursor entry point. */
export function RippleHoverCard({ children, className = "" }) {
  return (
    <div className={`ripple-hover-card ${className}`}>
      {children}
      <style jsx>{`
        .ripple-hover-card { position: relative; border-radius: 20px; overflow: hidden; }
        .ripple-hover-card::after {
          content: ""; position: absolute; inset: 0; border-radius: 50%; margin: auto;
          width: 0; height: 0; background: rgba(255,255,255,.12);
          transition: width .5s ease, height .5s ease; pointer-events: none;
        }
        .ripple-hover-card:hover::after { width: 220%; height: 220%; }
      `}</style>
    </div>
  );
}
