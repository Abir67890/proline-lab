"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

/** Loader that counts 0→100% while assets load, then fades out. */
export function PercentageLoader({ onDone, duration = 1800, label = "PROLINE LAB" }) {
  const [pct, setPct] = useState(0);
  useEffect(() => {
    const start = performance.now();
    let raf;
    function tick(now) {
      const t = Math.min(1, (now - start) / duration);
      setPct(Math.round(t * 100));
      if (t < 1) raf = requestAnimationFrame(tick);
      else setTimeout(() => onDone?.(), 250);
    }
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [duration, onDone]);

  return (
    <motion.div
      style={{
        position: "fixed", inset: 0, zIndex: 10000, background: "#0A1D1A",
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "#fff",
      }}
      exit={{ opacity: 0, transition: { duration: 0.5 } }}
    >
      <div style={{ fontSize: 14, letterSpacing: 4, marginBottom: 18 }}>{label}</div>
      <div style={{ fontSize: 64, fontWeight: 700, fontVariantNumeric: "tabular-nums" }}>{pct}%</div>
      <div style={{ width: 200, height: 2, background: "rgba(255,255,255,.15)", marginTop: 20 }}>
        <div style={{ width: `${pct}%`, height: "100%", background: "#D98E04", transition: "width .1s linear" }} />
      </div>
    </motion.div>
  );
}

/** Loader whose shape morphs between circle/square/triangle-ish blobs while waiting. */
export function MorphingLoader({ color = "#D98E04" }) {
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 10000, background: "#0A1D1A", display: "grid", placeItems: "center" }}>
      <motion.div
        style={{ width: 64, height: 64, background: color }}
        animate={{
          borderRadius: ["10% 10% 10% 10%", "50% 50% 50% 50%", "50% 10% 50% 10%", "10% 10% 10% 10%"],
          rotate: [0, 90, 180, 360],
        }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}
