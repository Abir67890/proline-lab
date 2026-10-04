"use client";
import { useState } from "react";
import { motion } from "framer-motion";

/** Liquid/blob hover fill using an SVG goo filter. */
export function LiquidButton({ children, className = "", onClick }) {
  return (
    <button className={`liquid-btn ${className}`} onClick={onClick}>
      <svg width="0" height="0"><filter id="goo"><feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur" /><feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -8" /></filter></svg>
      <span className="liquid-fill" />
      <span className="liquid-label">{children}</span>
      <style jsx>{`
        .liquid-btn {
          position: relative; padding: 14px 28px; border: none; border-radius: 999px;
          background: transparent; color: #fff; overflow: hidden; cursor: pointer;
          border: 1px solid rgba(255,255,255,.3);
        }
        .liquid-fill {
          position: absolute; left: 50%; bottom: -20%; width: 20px; height: 20px;
          background: #2E9E5B; border-radius: 50%; transform: translateX(-50%);
          filter: url(#goo); transition: width .5s ease, height .5s ease, bottom .5s ease;
          z-index: 0;
        }
        .liquid-btn:hover .liquid-fill { width: 220%; height: 220%; bottom: -60%; }
        .liquid-label { position: relative; z-index: 1; }
      `}</style>
    </button>
  );
}

/** Button that morphs its border-radius and icon slides in on hover. */
export function IconSlideButton({ children, icon, className = "", onClick }) {
  return (
    <button className={`iconslide-btn ${className}`} onClick={onClick}>
      <span>{children}</span>
      <span className="icon-wrap">{icon}</span>
      <style jsx>{`
        .iconslide-btn {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 14px 22px; border-radius: 999px; border: none; cursor: pointer;
          background: #0A1D1A; color: #fff; transition: border-radius .35s ease;
        }
        .icon-wrap { display: inline-flex; transform: translateX(-6px); opacity: 0; transition: transform .35s ease, opacity .35s ease; }
        .iconslide-btn:hover .icon-wrap { transform: translateX(0); opacity: 1; }
        .iconslide-btn:hover { border-radius: 8px; }
      `}</style>
    </button>
  );
}

/** Submit button that morphs into a spinner, then a checkmark, on click. */
export function LoadingMorphButton({ children, onAction, className = "" }) {
  const [state, setState] = useState("idle"); // idle | loading | done

  async function handleClick() {
    if (state !== "idle") return;
    setState("loading");
    try {
      if (onAction) await onAction();
      setState("done");
      setTimeout(() => setState("idle"), 1600);
    } catch {
      setState("idle");
    }
  }

  return (
    <motion.button
      className={`morph-btn ${className}`}
      onClick={handleClick}
      animate={{ width: state === "idle" ? 180 : 52, borderRadius: state === "idle" ? 999 : 999 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
    >
      {state === "idle" && children}
      {state === "loading" && <span className="spinner" />}
      {state === "done" && <span>✓</span>}
      <style jsx>{`
        .morph-btn {
          height: 52px; border: none; cursor: pointer; background: #2E9E5B; color: #fff;
          display: flex; align-items: center; justify-content: center; overflow: hidden;
        }
        .spinner {
          width: 18px; height: 18px; border-radius: 50%;
          border: 2px solid rgba(255,255,255,.35); border-top-color: #fff;
          animation: spin 0.7s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </motion.button>
  );
}
