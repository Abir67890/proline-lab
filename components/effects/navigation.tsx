"use client";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

/** Hides the header on scroll-down, reveals it again on scroll-up. */
export function useHideOnScroll() {
  const [hidden, setHidden] = useState(false);
  const lastY = useRef(0);
  useEffect(() => {
    function onScroll() {
      const y = window.scrollY;
      setHidden(y > lastY.current && y > 120);
      lastY.current = y;
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return hidden;
}

/** Animated hamburger icon that morphs into an X. */
export function MorphingHamburger({ open, onClick, className = "" }) {
  return (
    <button className={`ham-btn ${className}`} onClick={onClick} aria-label="Menu" aria-expanded={open}>
      <span className={`bar b1 ${open ? "open" : ""}`} />
      <span className={`bar b2 ${open ? "open" : ""}`} />
      <span className={`bar b3 ${open ? "open" : ""}`} />
      <style jsx>{`
        .ham-btn { width: 32px; height: 24px; position: relative; background: none; border: none; cursor: pointer; }
        .bar { position: absolute; left: 0; width: 100%; height: 2px; background: currentColor; transition: transform .35s ease, opacity .25s ease; }
        .b1 { top: 0; } .b2 { top: 11px; } .b3 { top: 22px; }
        .b1.open { transform: translateY(11px) rotate(45deg); }
        .b2.open { opacity: 0; }
        .b3.open { transform: translateY(-11px) rotate(-45deg); }
      `}</style>
    </button>
  );
}

/** Underline indicator that slides beneath the active nav link. */
export function ActiveSectionIndicator({ sectionIds, containerRef }) {
  const [active, setActive] = useState(sectionIds[0]);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => { if (e.isIntersecting) setActive(e.target.id); });
      },
      { rootMargin: "-45% 0px -45% 0px" }
    );
    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [sectionIds]);

  useEffect(() => {
    if (!containerRef?.current) return;
    const link = containerRef.current.querySelector(`a[href="#${active}"]`);
    const indicator = containerRef.current.querySelector("#nav-indicator");
    if (link && indicator) {
      indicator.style.width = link.offsetWidth + "px";
      indicator.style.left = link.offsetLeft + "px";
    }
  }, [active, containerRef]);

  return active;
}

/** Thin bar across the very top showing overall scroll progress. */
export function ScrollProgressBar({ color = "#D98E04" }) {
  const { scrollYProgress } = useScrollFallback();
  return (
    <motion.div
      style={{
        position: "fixed", top: 0, left: 0, right: 0, height: 3, transformOrigin: "0% 50%",
        background: color, zIndex: 9999, scaleX: scrollYProgress,
      }}
    />
  );
}

// Avoids importing useScroll at module scope twice across files; local minimal hook.
function useScrollFallback() {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    function onScroll() {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? window.scrollY / max : 0);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return { scrollYProgress: progress };
}
