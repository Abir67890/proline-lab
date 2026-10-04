"use client";
import { useRef, useState } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";

/** CSS-columns masonry grid with staggered fade-in. */
export function MasonryGallery({ images, columns = 3, className = "" }) {
  return (
    <div className={`masonry ${className}`} style={{ columnCount: columns, columnGap: 16 }}>
      {images.map((img, i) => (
        <motion.img
          key={img.src}
          src={img.src}
          alt={img.alt || ""}
          loading="lazy"
          style={{ width: "100%", marginBottom: 16, borderRadius: 14, breakInside: "avoid" }}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: (i % columns) * 0.08 }}
        />
      ))}
    </div>
  );
}

/** Drag-to-reveal before/after comparison slider. */
export function BeforeAfterSlider({ before, after, className = "" }) {
  const ref = useRef(null);
  const [pct, setPct] = useState(50);
  function onDrag(clientX) {
    const r = ref.current.getBoundingClientRect();
    const p = Math.min(100, Math.max(0, ((clientX - r.left) / r.width) * 100));
    setPct(p);
  }
  return (
    <div
      ref={ref}
      className={`ba-slider ${className}`}
      onMouseMove={(e) => e.buttons === 1 && onDrag(e.clientX)}
      onTouchMove={(e) => onDrag(e.touches[0].clientX)}
      style={{ position: "relative", overflow: "hidden", borderRadius: 18, userSelect: "none" }}
    >
      <img src={after} alt="Après" style={{ display: "block", width: "100%" }} draggable={false} />
      <div style={{ position: "absolute", inset: 0, width: `${pct}%`, overflow: "hidden" }}>
        <img src={before} alt="Avant" style={{ width: ref.current?.offsetWidth || "100%", display: "block" }} draggable={false} />
      </div>
      <div style={{ position: "absolute", top: 0, bottom: 0, left: `${pct}%`, width: 3, background: "#fff", transform: "translateX(-50%)", cursor: "ew-resize" }}
           onMouseDown={(e) => { e.preventDefault(); }}>
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 36, height: 36, borderRadius: "50%", background: "#fff", display: "grid", placeItems: "center", fontSize: 12 }}>⇔</div>
      </div>
    </div>
  );
}

/** Draggable stack of cards — drag the top card away to reveal the next. */
export function StackCards({ items, renderItem, className = "" }) {
  const [order, setOrder] = useState(items.map((_, i) => i));
  return (
    <div className={`stack-cards ${className}`} style={{ position: "relative", height: 360 }}>
      {order.map((idx, stackPos) => (
        <StackCard
          key={items[idx].id ?? idx}
          stackPos={order.length - 1 - stackPos}
          onSwiped={() => setOrder((o) => [...o.slice(1), o[0]])}
        >
          {renderItem(items[idx])}
        </StackCard>
      ))}
    </div>
  );
}

function StackCard({ children, stackPos, onSwiped }) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-12, 12]);
  const isTop = stackPos === 0;
  return (
    <motion.div
      drag={isTop ? "x" : false}
      style={{
        position: "absolute", inset: 0, x, rotate,
        zIndex: 100 - stackPos,
        scale: 1 - stackPos * 0.04,
        top: stackPos * 10,
      }}
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={(_, info) => { if (Math.abs(info.offset.x) > 120) onSwiped(); }}
      whileTap={{ cursor: "grabbing" }}
    >
      {children}
    </motion.div>
  );
}

/** Coverflow: center item large & flat, side items receded and angled. */
export function Coverflow({ images, className = "" }) {
  const [active, setActive] = useState(0);
  return (
    <div className={`coverflow ${className}`} style={{ display: "flex", justifyContent: "center", alignItems: "center", perspective: 1000, gap: -20 }}>
      {images.map((img, i) => {
        const offset = i - active;
        return (
          <motion.img
            key={img.src}
            src={img.src}
            alt={img.alt || ""}
            onClick={() => setActive(i)}
            style={{ width: 220, borderRadius: 14, cursor: "pointer", marginLeft: -30, boxShadow: "0 20px 40px rgba(0,0,0,.3)" }}
            animate={{
              rotateY: offset * -35,
              x: offset * 60,
              scale: offset === 0 ? 1.15 : 0.9,
              zIndex: 10 - Math.abs(offset),
              filter: offset === 0 ? "brightness(1)" : "brightness(.6)",
            }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          />
        );
      })}
    </div>
  );
}
