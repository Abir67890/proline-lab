"use client";
import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

/** Replaces the OS cursor with a small dot + a slow-following ring. */
export function CustomCursor() {
  const dot = useRef(null);
  const ring = useRef(null);
  const rx = useMotionValue(-100);
  const ry = useMotionValue(-100);
  const srx = useSpring(rx, { stiffness: 300, damping: 30 });
  const sry = useSpring(ry, { stiffness: 300, damping: 30 });
  const [down, setDown] = useState(false);
  const [hoveringLink, setHoveringLink] = useState(false);

  useEffect(() => {
    function move(e) {
      if (dot.current) {
        dot.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
      }
      rx.set(e.clientX);
      ry.set(e.clientY);
      const el = document.elementFromPoint(e.clientX, e.clientY);
      setHoveringLink(!!el?.closest("a, button, [data-cursor='hover']"));
    }
    function down_() { setDown(true); }
    function up_() { setDown(false); }
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerdown", down_);
    window.addEventListener("pointerup", up_);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerdown", down_);
      window.removeEventListener("pointerup", up_);
    };
  }, [rx, ry]);

  return (
    <>
      <div ref={dot} className="custom-cursor-dot" />
      <motion.div
        ref={ring}
        className="custom-cursor-ring"
        style={{
          translateX: srx,
          translateY: sry,
          scale: down ? 0.7 : hoveringLink ? 1.8 : 1,
        }}
      />
      <style jsx global>{`
        @media (hover: hover) {
          * { cursor: none; }
        }
        .custom-cursor-dot {
          position: fixed; top: 0; left: 0; width: 6px; height: 6px;
          margin: -3px; border-radius: 50%; background: #fff;
          pointer-events: none; z-index: 9999;
        }
        .custom-cursor-ring {
          position: fixed; top: 0; left: 0; width: 34px; height: 34px;
          margin: -17px; border-radius: 50%; border: 1.5px solid rgba(255,255,255,.6);
          pointer-events: none; z-index: 9998; mix-blend-mode: difference;
        }
        @media (hover: none) {
          .custom-cursor-dot, .custom-cursor-ring { display: none; }
          * { cursor: auto !important; }
        }
      `}</style>
    </>
  );
}

/** Trailing dots behind the cursor (canvas, GPU-cheap). */
export function CursorTrail({ count = 14, color = "255,255,255" }) {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let raf;
    const pts = Array.from({ length: count }, () => ({ x: -100, y: -100 }));
    let mx = -100, my = -100;
    function resize() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
    function move(e) { mx = e.clientX; my = e.clientY; }
    function tick() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let x = mx, y = my;
      pts.forEach((p, i) => {
        p.x += (x - p.x) * 0.35;
        p.y += (y - p.y) * 0.35;
        x = p.x; y = p.y;
        const r = (count - i) / count * 4;
        ctx.beginPath();
        ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${color},${(count - i) / count * 0.5})`;
        ctx.fill();
      });
      raf = requestAnimationFrame(tick);
    }
    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", move);
    tick();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", move);
    };
  }, [count, color]);
  return <canvas ref={canvasRef} style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 9997 }} />;
}

/** Wrap any clickable element to get a Material-style ripple on click. */
export function useRipple() {
  return function onClick(e) {
    const target = e.currentTarget;
    const rect = target.getBoundingClientRect();
    const circle = document.createElement("span");
    const size = Math.max(rect.width, rect.height);
    circle.style.cssText = `
      position:absolute;border-radius:50%;pointer-events:none;
      width:${size}px;height:${size}px;
      left:${e.clientX - rect.left - size / 2}px;top:${e.clientY - rect.top - size / 2}px;
      background:rgba(255,255,255,.45);transform:scale(0);
      animation:ripple-anim .6s ease-out;
    `;
    target.style.position = target.style.position || "relative";
    target.style.overflow = "hidden";
    target.appendChild(circle);
    circle.addEventListener("animationend", () => circle.remove());
  };
}

export function RippleStyles() {
  return (
    <style jsx global>{`
      @keyframes ripple-anim {
        to { transform: scale(2.4); opacity: 0; }
      }
    `}</style>
  );
}
