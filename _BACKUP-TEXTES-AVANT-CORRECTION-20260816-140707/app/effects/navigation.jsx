"use client";

import { useEffect, useState } from "react";

/**
 * navigation.jsx — effets de navigation additifs
 * MorphingHamburger : icône burger → croix, pur CSS (3 barres animées).
 * ScrollProgressBar : barre fine en haut de page, largeur = progression du scroll.
 */

export function MorphingHamburger({ open, onClick, className = "" }) {
  return (
    <button
      type="button"
      aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
      aria-expanded={open}
      onClick={onClick}
      className={`proline-hamburger ${open ? "is-open" : ""} ${className}`}
      style={{
        width: 42,
        height: 42,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        background: "transparent",
        border: "1px solid color-mix(in srgb, var(--color-ink) 16%, transparent)",
        borderRadius: 12,
        cursor: "pointer",
      }}
    >
      <span className="proline-hamburger-bars">
        <i />
        <i />
        <i />
      </span>
      <style jsx>{`
        .proline-hamburger-bars {
          position: relative;
          width: 18px;
          height: 14px;
          display: inline-block;
        }
        .proline-hamburger-bars i {
          position: absolute;
          left: 0;
          width: 100%;
          height: 2px;
          border-radius: 2px;
          background: var(--color-ink);
          transition: transform 0.35s cubic-bezier(0.65, 0, 0.35, 1), opacity 0.25s ease, top 0.35s ease;
        }
        .proline-hamburger-bars i:nth-child(1) { top: 0; }
        .proline-hamburger-bars i:nth-child(2) { top: 6px; }
        .proline-hamburger-bars i:nth-child(3) { top: 12px; }
        .is-open .proline-hamburger-bars i:nth-child(1) {
          top: 6px;
          transform: rotate(45deg);
        }
        .is-open .proline-hamburger-bars i:nth-child(2) {
          opacity: 0;
          transform: translateX(-6px);
        }
        .is-open .proline-hamburger-bars i:nth-child(3) {
          top: 6px;
          transform: rotate(-45deg);
        }
      `}</style>
    </button>
  );
}

export function ScrollProgressBar({ color = "var(--color-blue)", className = "" }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    function onScroll() {
      const scrollTop = window.scrollY;
      const height = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(height > 0 ? (scrollTop / height) * 100 : 0);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div
      className={`proline-scroll-progress ${className}`}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        height: 3,
        width: "100%",
        zIndex: 999,
        pointerEvents: "none",
        background: "transparent",
      }}
    >
      <div
        style={{
          height: "100%",
          width: `${progress}%`,
          background: `linear-gradient(90deg, var(--color-blue), ${color})`,
          transition: "width 0.1s linear",
          boxShadow: `0 0 12px 0 color-mix(in srgb, ${color} 60%, transparent)`,
        }}
      />
    </div>
  );
}
