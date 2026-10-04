"use client";

/**
 * backgrounds.jsx — fonds animés additifs
 * NoiseGrain, AuroraBackground, LightRays
 * Purs CSS/SVG, zéro dépendance, GPU-friendly (transform/opacity only).
 */

export function NoiseGrain({ opacity = 0.035 }) {
  return (
    <svg
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        width: "100%",
        height: "100%",
        zIndex: 3,
        pointerEvents: "none",
        opacity,
        mixBlendMode: "overlay",
      }}
    >
      <filter id="proline-noise">
        <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" stitchTiles="stitch" />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <rect width="100%" height="100%" filter="url(#proline-noise)" />
    </svg>
  );
}

export function AuroraBackground({ className = "" }) {
  return (
    <div
      className={`proline-aurora ${className}`}
      aria-hidden="true"
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        zIndex: 0,
        pointerEvents: "none",
      }}
    >
      <div className="proline-aurora-blob a" />
      <div className="proline-aurora-blob b" />
      <div className="proline-aurora-blob c" />
      <style jsx>{`
        .proline-aurora-blob {
          position: absolute;
          width: 60vw;
          height: 60vw;
          max-width: 820px;
          max-height: 820px;
          border-radius: 50%;
          filter: blur(90px);
          opacity: 0.38;
          will-change: transform;
        }
        .a {
          top: -18%;
          left: -10%;
          background: radial-gradient(circle, var(--color-blue), transparent 70%);
          animation: auroraDrift1 22s ease-in-out infinite;
        }
        .b {
          top: 10%;
          right: -14%;
          background: radial-gradient(circle, var(--color-green-light), transparent 70%);
          animation: auroraDrift2 26s ease-in-out infinite;
        }
        .c {
          bottom: -22%;
          left: 28%;
          background: radial-gradient(circle, var(--spotlight-warm, #e3ad5c), transparent 72%);
          opacity: 0.22;
          animation: auroraDrift3 30s ease-in-out infinite;
        }
        @keyframes auroraDrift1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(6%, 8%) scale(1.12); }
        }
        @keyframes auroraDrift2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-8%, 6%) scale(1.08); }
        }
        @keyframes auroraDrift3 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(4%, -6%) scale(1.15); }
        }
        @media (prefers-reduced-motion: reduce) {
          .proline-aurora-blob { animation: none; }
        }
      `}</style>
    </div>
  );
}

export function LightRays({ className = "" }) {
  return (
    <div
      className={`proline-rays ${className}`}
      aria-hidden="true"
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        zIndex: 0,
        pointerEvents: "none",
      }}
    >
      <div className="proline-rays-fan" />
      <style jsx>{`
        .proline-rays-fan {
          position: absolute;
          top: -30%;
          left: 50%;
          width: 160%;
          height: 160%;
          transform: translateX(-50%);
          background: conic-gradient(
            from 90deg at 50% 0%,
            transparent 0deg,
            color-mix(in srgb, var(--color-blue) 14%, transparent) 4deg,
            transparent 8deg,
            transparent 22deg,
            color-mix(in srgb, var(--color-green-light) 10%, transparent) 26deg,
            transparent 30deg,
            transparent 48deg,
            color-mix(in srgb, var(--color-blue) 12%, transparent) 52deg,
            transparent 56deg
          );
          opacity: 0.55;
          animation: raysSway 18s ease-in-out infinite;
          mix-blend-mode: soft-light;
        }
        @keyframes raysSway {
          0%, 100% { transform: translateX(-50%) rotate(0deg); }
          50% { transform: translateX(-50%) rotate(2.5deg); }
        }
        @media (prefers-reduced-motion: reduce) {
          .proline-rays-fan { animation: none; }
        }
      `}</style>
    </div>
  );
}
