"use client";
import { useEffect, useRef } from "react";

/** Slow-moving aurora-style gradient blobs, pure CSS. */
export function AuroraBackground({ className = "" }) {
  return (
    <div className={`aurora-bg ${className}`} aria-hidden="true">
      <span className="a1" /><span className="a2" /><span className="a3" />
      <style jsx>{`
        .aurora-bg { position: absolute; inset: 0; overflow: hidden; filter: blur(60px); opacity: .55; pointer-events: none; }
        .aurora-bg span { position: absolute; width: 60%; height: 60%; border-radius: 50%; mix-blend-mode: screen; animation: aurora-move 18s ease-in-out infinite; }
        .a1 { background: #2E9E5B; top: -10%; left: -10%; }
        .a2 { background: #0092C7; top: 20%; right: -15%; animation-duration: 22s; animation-delay: -4s; }
        .a3 { background: #D98E04; bottom: -20%; left: 20%; animation-duration: 26s; animation-delay: -9s; }
        @keyframes aurora-move {
          0%, 100% { transform: translate(0,0) scale(1); }
          33% { transform: translate(8%, -6%) scale(1.15); }
          66% { transform: translate(-6%, 8%) scale(0.9); }
        }
      `}</style>
    </div>
  );
}

/** Animated mesh-gradient background (CSS conic/radial layers). */
export function MeshGradient({ className = "" }) {
  return (
    <div className={`mesh-bg ${className}`} aria-hidden="true">
      <style jsx>{`
        .mesh-bg {
          position: absolute; inset: 0; pointer-events: none;
          background:
            radial-gradient(at 20% 20%, rgba(46,158,91,.35) 0, transparent 50%),
            radial-gradient(at 80% 10%, rgba(0,146,199,.3) 0, transparent 50%),
            radial-gradient(at 50% 80%, rgba(217,142,4,.3) 0, transparent 50%),
            radial-gradient(at 90% 90%, rgba(139,41,66,.3) 0, transparent 50%);
          background-size: 200% 200%;
          animation: mesh-drift 20s ease-in-out infinite;
        }
        @keyframes mesh-drift {
          0%, 100% { background-position: 0% 0%; }
          50% { background-position: 100% 100%; }
        }
      `}</style>
    </div>
  );
}

/** Film-grain / noise overlay (canvas, regenerated each frame at low fps for texture). */
export function NoiseGrain({ opacity = 0.05, className = "" }) {
  const ref = useRef(null);
  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas.getContext("2d");
    const w = 128, h = 128;
    canvas.width = w; canvas.height = h;
    let raf, frame = 0;
    function draw() {
      frame++;
      if (frame % 3 === 0) {
        const imgData = ctx.createImageData(w, h);
        for (let i = 0; i < imgData.data.length; i += 4) {
          const v = Math.random() * 255;
          imgData.data[i] = imgData.data[i + 1] = imgData.data[i + 2] = v;
          imgData.data[i + 3] = 255;
        }
        ctx.putImageData(imgData, 0, 0);
      }
      raf = requestAnimationFrame(draw);
    }
    draw();
    return () => cancelAnimationFrame(raf);
  }, []);
  return (
    <canvas
      ref={ref}
      className={className}
      aria-hidden="true"
      style={{
        position: "absolute", inset: 0, width: "100%", height: "100%",
        opacity, mixBlendMode: "overlay", pointerEvents: "none", imageRendering: "pixelated",
      }}
    />
  );
}

/** Diagonal animated light rays (CSS conic-gradient sweep). */
export function LightRays({ className = "" }) {
  return (
    <div className={`rays-bg ${className}`} aria-hidden="true">
      <style jsx>{`
        .rays-bg {
          position: absolute; inset: -20%; pointer-events: none; opacity: .35; mix-blend-mode: screen;
          background: conic-gradient(from 0deg at 50% 0%,
            transparent 0deg, rgba(255,255,255,.5) 4deg, transparent 8deg,
            transparent 40deg, rgba(255,255,255,.35) 44deg, transparent 48deg,
            transparent 100deg, rgba(255,255,255,.4) 104deg, transparent 108deg);
          animation: rays-spin 30s linear infinite;
        }
        @keyframes rays-spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}

/** A soft lens-flare disc that drifts across a section. */
export function LensFlare({ className = "" }) {
  return (
    <div className={`flare ${className}`} aria-hidden="true">
      <style jsx>{`
        .flare {
          position: absolute; width: 240px; height: 240px; border-radius: 50%;
          top: 8%; left: 12%; pointer-events: none; mix-blend-mode: screen;
          background: radial-gradient(circle, rgba(255,255,255,.9) 0%, rgba(255,255,255,.15) 35%, transparent 70%);
          animation: flare-drift 14s ease-in-out infinite;
        }
        @keyframes flare-drift {
          0%, 100% { transform: translate(0,0) scale(1); opacity: .8; }
          50% { transform: translate(30%, 40%) scale(1.3); opacity: .4; }
        }
      `}</style>
    </div>
  );
}

/** Animated grid-line background, subtle perspective drift. */
export function GridBackground({ className = "" }) {
  return (
    <div className={`grid-bg ${className}`} aria-hidden="true">
      <style jsx>{`
        .grid-bg {
          position: absolute; inset: 0; pointer-events: none; opacity: .18;
          background-image:
            linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px);
          background-size: 48px 48px;
          animation: grid-pan 16s linear infinite;
        }
        @keyframes grid-pan { to { background-position: 48px 48px; } }
      `}</style>
    </div>
  );
}

/**
 * Generic lightweight canvas particle field. `mode` selects the physics:
 * "stars" | "rain" | "snow" | "dust" | "bubbles" | "smoke"
 */
export function ParticleField({ mode = "dust", count = 80, className = "" }) {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let raf, w, h, dpr = Math.min(window.devicePixelRatio || 1, 2);
    let particles = [];

    function make() {
      return Array.from({ length: count }, () => {
        switch (mode) {
          case "rain":
            return { x: Math.random() * w, y: Math.random() * h, len: Math.random() * 14 + 8, vy: Math.random() * 6 + 8, vx: -2 };
          case "snow":
            return { x: Math.random() * w, y: Math.random() * h, r: Math.random() * 2.5 + 1, vy: Math.random() * 1 + 0.4, vx: Math.sin(Math.random() * Math.PI), drift: Math.random() * 0.02 };
          case "bubbles":
            return { x: Math.random() * w, y: h + Math.random() * h, r: Math.random() * 6 + 2, vy: -(Math.random() * 0.8 + 0.3), sway: Math.random() * 0.02 };
          case "smoke":
            return { x: Math.random() * w, y: h * (0.6 + Math.random() * 0.4), r: Math.random() * 40 + 20, vy: -(Math.random() * 0.4 + 0.15), o: Math.random() * 0.12 };
          case "stars":
          default:
            return { x: Math.random() * w, y: Math.random() * h, r: Math.random() * 1.4 + 0.3, tw: Math.random() * Math.PI * 2 };
        }
      });
    }

    function resize() {
      const rect = canvas.parentElement.getBoundingClientRect();
      w = rect.width; h = rect.height;
      canvas.width = w * dpr; canvas.height = h * dpr;
      canvas.style.width = w + "px"; canvas.style.height = h + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      particles = make();
    }

    function tick() {
      ctx.clearRect(0, 0, w, h);
      particles.forEach((p) => {
        if (mode === "rain") {
          p.x += p.vx; p.y += p.vy;
          if (p.y > h) { p.y = -20; p.x = Math.random() * w; }
          ctx.strokeStyle = "rgba(180,210,255,.4)";
          ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(p.x + p.vx * 2, p.y + p.len); ctx.stroke();
        } else if (mode === "snow") {
          p.x += Math.sin(p.tw = (p.tw || 0) + p.drift) * 0.6; p.y += p.vy;
          if (p.y > h) { p.y = -10; p.x = Math.random() * w; }
          ctx.fillStyle = "rgba(255,255,255,.85)";
          ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill();
        } else if (mode === "bubbles") {
          p.x += Math.sin(p.y * p.sway) * 0.5; p.y += p.vy;
          if (p.y < -20) { p.y = h + 10; p.x = Math.random() * w; }
          ctx.strokeStyle = "rgba(255,255,255,.35)";
          ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.stroke();
        } else if (mode === "smoke") {
          p.y += p.vy; p.r += 0.05;
          if (p.y < -60) { p.y = h + 40; p.r = Math.random() * 40 + 20; }
          const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r);
          grad.addColorStop(0, `rgba(255,255,255,${p.o})`);
          grad.addColorStop(1, "rgba(255,255,255,0)");
          ctx.fillStyle = grad;
          ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill();
        } else {
          p.tw += 0.02;
          const o = 0.4 + Math.sin(p.tw) * 0.4;
          ctx.fillStyle = `rgba(255,255,255,${o})`;
          ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill();
        }
      });
      raf = requestAnimationFrame(tick);
    }

    resize();
    tick();
    window.addEventListener("resize", resize);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, [mode, count]);

  return <canvas ref={canvasRef} className={className} aria-hidden="true" style={{ position: "absolute", inset: 0, pointerEvents: "none" }} />;
}

/** Slowly morphing blob shape via animated CSS border-radius. */
export function MorphingBlob({ color = "#2E9E5B", size = 400, className = "" }) {
  return (
    <div className={`morph-blob ${className}`} style={{ width: size, height: size, background: color }} aria-hidden="true">
      <style jsx>{`
        .morph-blob {
          border-radius: 60% 40% 55% 45% / 50% 60% 40% 50%;
          filter: blur(40px); opacity: .45; position: absolute;
          animation: blob-morph 12s ease-in-out infinite;
        }
        @keyframes blob-morph {
          0%, 100% { border-radius: 60% 40% 55% 45% / 50% 60% 40% 50%; }
          50% { border-radius: 40% 60% 45% 55% / 55% 45% 60% 40%; }
        }
      `}</style>
    </div>
  );
}
