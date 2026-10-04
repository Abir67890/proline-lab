"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function AnimatedCheckbox({ checked, onChange, className = "" }) {
  return (
    <button
      className={`aw-checkbox ${className}`}
      onClick={() => onChange?.(!checked)}
      aria-pressed={checked}
      style={{
        width: 22, height: 22, borderRadius: 6, border: "2px solid #2E9E5B",
        background: checked ? "#2E9E5B" : "transparent", display: "grid", placeItems: "center",
        transition: "background .25s ease",
      }}
    >
      <motion.svg width="12" height="10" viewBox="0 0 12 10">
        <motion.path
          d="M1 5L4.5 8.5L11 1" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          initial={{ pathLength: 0 }} animate={{ pathLength: checked ? 1 : 0 }} transition={{ duration: 0.25 }}
        />
      </motion.svg>
    </button>
  );
}

export function AnimatedToggle({ on, onChange, className = "" }) {
  return (
    <button
      className={`aw-toggle ${className}`}
      onClick={() => onChange?.(!on)}
      style={{
        width: 46, height: 26, borderRadius: 999, border: "none", cursor: "pointer",
        background: on ? "#2E9E5B" : "rgba(255,255,255,.2)", position: "relative", transition: "background .25s ease",
      }}
    >
      <motion.span
        style={{ position: "absolute", top: 3, width: 20, height: 20, borderRadius: "50%", background: "#fff" }}
        animate={{ left: on ? 23 : 3 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      />
    </button>
  );
}

/** Input wrapper whose underline grows and label floats on focus. */
export function FloatingLabelInput({ label, value, onChange, type = "text", className = "" }) {
  const [focused, setFocused] = useState(false);
  const active = focused || !!value;
  return (
    <div className={`fl-input ${className}`} style={{ position: "relative", paddingTop: 18 }}>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{ width: "100%", background: "transparent", border: "none", borderBottom: "1px solid rgba(255,255,255,.3)", color: "#fff", padding: "8px 0", outline: "none" }}
      />
      <motion.label
        style={{ position: "absolute", left: 0, pointerEvents: "none", color: "rgba(255,255,255,.6)" }}
        animate={{ top: active ? 0 : 26, fontSize: active ? 12 : 16 }}
        transition={{ duration: 0.2 }}
      >
        {label}
      </motion.label>
      <motion.div
        style={{ position: "absolute", bottom: 0, left: 0, height: 2, background: "#D98E04" }}
        animate={{ width: focused ? "100%" : "0%" }}
        transition={{ duration: 0.3 }}
      />
    </div>
  );
}

export function SuccessCheck({ show }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.svg width="48" height="48" viewBox="0 0 48 48" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
          <motion.circle cx="24" cy="24" r="22" fill="none" stroke="#2E9E5B" strokeWidth="3"
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.5 }} />
          <motion.path d="M14 24l7 7 13-13" fill="none" stroke="#2E9E5B" strokeWidth="3" strokeLinecap="round"
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.4, delay: 0.4 }} />
        </motion.svg>
      )}
    </AnimatePresence>
  );
}

/** Wrap any element; call `.shake()` via the returned trigger to nudge it side-to-side (form errors). */
export function useErrorShake() {
  const [key, setKey] = useState(0);
  return { shakeKey: key, trigger: () => setKey((k) => k + 1) };
}
export function ErrorShakeWrap({ children, shakeKey }) {
  return (
    <motion.div key={shakeKey} animate={shakeKey ? { x: [0, -8, 8, -6, 6, 0] } : {}} transition={{ duration: 0.4 }}>
      {children}
    </motion.div>
  );
}

/** Toast stack — push { id, text } objects into `toasts` from parent state. */
export function ToastStack({ toasts, className = "" }) {
  return (
    <div className={`toast-stack ${className}`} style={{ position: "fixed", bottom: 24, right: 24, display: "flex", flexDirection: "column", gap: 10, zIndex: 9999 }}>
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, x: 60 }}
            style={{ background: "#0A1D1A", color: "#fff", padding: "12px 18px", borderRadius: 10, boxShadow: "0 10px 30px rgba(0,0,0,.3)" }}
          >
            {t.text}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

/** Accordion item with height auto-animation. */
export function AccordionItem({ title, children, defaultOpen = false, className = "" }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className={`accordion-item ${className}`} style={{ borderBottom: "1px solid rgba(255,255,255,.12)" }}>
      <button
        onClick={() => setOpen((o) => !o)}
        style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 0", background: "none", border: "none", color: "inherit", cursor: "pointer" }}
      >
        <span>{title}</span>
        <motion.span animate={{ rotate: open ? 45 : 0 }} transition={{ duration: 0.25 }}>+</motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            style={{ overflow: "hidden" }}
          >
            <div style={{ paddingBottom: 16 }}>{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
