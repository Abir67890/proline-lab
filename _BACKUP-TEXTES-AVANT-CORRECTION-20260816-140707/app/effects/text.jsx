"use client";

/**
 * text.jsx — effets typographiques additifs
 * GradientText : dégradé animé, style "script" premium.
 */

export function GradientText({ children, colors = ["#4F8ED1", "#315F91", "#8AA8C4"], className = "" }) {
  const gradient = `linear-gradient(90deg, ${colors.join(", ")}, ${colors[0]})`;
  return (
    <span
      className={`proline-gradient-text ${className}`}
      style={{
        backgroundImage: gradient,
        backgroundSize: "300% auto",
        WebkitBackgroundClip: "text",
        backgroundClip: "text",
        color: "transparent",
        display: "inline-block",
        animation: "prolineGradientShift 6s ease-in-out infinite",
      }}
    >
      {children}
      <style jsx>{`
        @keyframes prolineGradientShift {
          0% { background-position: 0% center; }
          50% { background-position: 100% center; }
          100% { background-position: 0% center; }
        }
        @media (prefers-reduced-motion: reduce) {
          .proline-gradient-text { animation: none; }
        }
      `}</style>
    </span>
  );
}
