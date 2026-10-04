"use client";

import { useState } from "react";
import { Check, ChevronDown, CheckCircle2 } from "lucide-react";

/**
 * micro.jsx — micro-interactions additives
 * AnimatedCheckbox, FloatingLabelInput, ToastStack, AccordionItem
 */

export function AnimatedCheckbox({ checked, onChange, className = "" }) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`proline-checkbox ${checked ? "is-checked" : ""} ${className}`}
      style={{
        width: 20,
        height: 20,
        flex: "0 0 auto",
        borderRadius: 6,
        border: `1.5px solid ${checked ? "var(--color-blue)" : "color-mix(in srgb, var(--color-ink) 30%, transparent)"}`,
        background: checked ? "var(--color-blue)" : "transparent",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        transition: "all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)",
      }}
    >
      <span
        style={{
          display: "inline-flex",
          transform: checked ? "scale(1)" : "scale(0)",
          transition: "transform 0.22s cubic-bezier(0.34, 1.56, 0.64, 1)",
          color: "#fff",
        }}
      >
        <Check size={13} strokeWidth={3} />
      </span>
    </button>
  );
}

export function FloatingLabelInput({ label, value, onChange, type = "text", className = "" }) {
  const [focused, setFocused] = useState(false);
  const active = focused || value.length > 0;

  return (
    <div className={`proline-floating-input ${className}`} style={{ position: "relative", width: "100%" }}>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          width: "100%",
          padding: "16px 14px 6px",
          borderRadius: 12,
          border: `1.5px solid ${focused ? "var(--color-blue)" : "color-mix(in srgb, var(--color-ink) 20%, transparent)"}`,
          background: "color-mix(in srgb, var(--color-paper) 60%, transparent)",
          fontSize: 14,
          color: "var(--color-ink)",
          outline: "none",
          transition: "border-color 0.25s ease",
        }}
      />
      <label
        style={{
          position: "absolute",
          left: 14,
          top: active ? 6 : "50%",
          transform: active ? "translateY(0) scale(0.78)" : "translateY(-50%) scale(1)",
          transformOrigin: "left top",
          color: focused ? "var(--color-blue)" : "var(--color-ink-soft)",
          fontSize: 14,
          pointerEvents: "none",
          transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        {label}
      </label>
    </div>
  );
}

export function ToastStack({ toasts = [] }) {
  return (
    <div
      className="proline-toast-stack"
      style={{
        position: "fixed",
        bottom: 24,
        right: 24,
        zIndex: 1000,
        display: "flex",
        flexDirection: "column",
        gap: 10,
        pointerEvents: "none",
      }}
    >
      {toasts.map((t) => (
        <div
          key={t.id}
          className="proline-toast"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "12px 16px",
            borderRadius: 14,
            background: "var(--color-navy)",
            color: "#fff",
            fontSize: 13.5,
            fontWeight: 500,
            boxShadow: "0 16px 40px -14px rgba(11,39,69,.55)",
            animation: "prolineToastIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
            maxWidth: 320,
          }}
        >
          <CheckCircle2 size={18} color="var(--color-green-light)" style={{ flexShrink: 0 }} />
          <span>{t.text}</span>
        </div>
      ))}
      <style jsx global>{`
        @keyframes prolineToastIn {
          from { opacity: 0; transform: translateY(12px) scale(0.96); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
}

export function AccordionItem({ title, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div
      className={`proline-accordion-item ${open ? "is-open" : ""}`}
      style={{
        borderRadius: 16,
        border: "1px solid color-mix(in srgb, var(--color-ink) 12%, transparent)",
        overflow: "hidden",
        background: "color-mix(in srgb, var(--color-paper) 70%, transparent)",
      }}
    >
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
          padding: "16px 18px",
          background: "transparent",
          border: "none",
          cursor: "pointer",
          textAlign: "left",
          fontSize: 15.5,
          fontWeight: 600,
          color: "var(--color-ink)",
        }}
      >
        <span>{title}</span>
        <span
          style={{
            display: "inline-flex",
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            color: "var(--color-blue)",
            flexShrink: 0,
          }}
        >
          <ChevronDown size={20} />
        </span>
      </button>
      <div
        style={{
          maxHeight: open ? 240 : 0,
          opacity: open ? 1 : 0,
          transition: "max-height 0.35s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.25s ease",
        }}
      >
        <div style={{ padding: "0 18px 18px", fontSize: 14, lineHeight: 1.6, color: "var(--color-ink-soft)" }}>
          {children}
        </div>
      </div>
    </div>
  );
}
