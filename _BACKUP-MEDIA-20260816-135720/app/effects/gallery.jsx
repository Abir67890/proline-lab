"use client";

import { useRef, useState, useCallback } from "react";
import { MoveHorizontal, Expand } from "lucide-react";

/**
 * gallery.jsx — effets de galerie additifs
 * MasonryGallery : grille en colonnes CSS, zoom au survol.
 * BeforeAfterSlider : comparateur avant/après par glisser (pointer events).
 */

export function MasonryGallery({ images = [], columns = 3, className = "" }) {
  return (
    <div
      className={`proline-masonry ${className}`}
      style={{
        columnCount: columns,
        columnGap: "1rem",
      }}
    >
      {images.map((img, i) => (
        <figure
          key={img.src + i}
          className="proline-masonry-item"
          style={{
            breakInside: "avoid",
            marginBottom: "1rem",
            position: "relative",
            borderRadius: 18,
            overflow: "hidden",
            cursor: "zoom-in",
            boxShadow: "0 10px 30px -14px color-mix(in srgb, var(--color-ink) 30%, transparent)",
          }}
        >
          <img
            src={img.src}
            alt={img.alt || ""}
            loading="lazy"
            style={{
              width: "100%",
              display: "block",
              transition: "transform .6s cubic-bezier(.16,1,.3,1)",
            }}
            className="proline-masonry-img"
          />
          <span className="proline-masonry-zoom-icon">
            <Expand size={16} strokeWidth={2} />
          </span>
          {img.caption && (
            <figcaption
              style={{
                position: "absolute",
                left: 12,
                bottom: 10,
                color: "#fff",
                fontSize: 12,
                fontWeight: 600,
                letterSpacing: ".02em",
                textShadow: "0 2px 8px rgba(0,0,0,.5)",
              }}
            >
              {img.caption}
            </figcaption>
          )}
          <style jsx>{`
            .proline-masonry-item:hover .proline-masonry-img {
              transform: scale(1.08);
            }
            .proline-masonry-zoom-icon {
              position: absolute;
              top: 10px;
              right: 10px;
              width: 30px;
              height: 30px;
              border-radius: 999px;
              display: flex;
              align-items: center;
              justify-content: center;
              background: rgba(11, 39, 69, 0.55);
              color: #fff;
              backdrop-filter: blur(4px);
              opacity: 0;
              transform: translateY(-4px);
              transition: all 0.3s ease;
            }
            .proline-masonry-item:hover .proline-masonry-zoom-icon {
              opacity: 1;
              transform: translateY(0);
            }
          `}</style>
        </figure>
      ))}
    </div>
  );
}

export function BeforeAfterSlider({ before, after, className = "" }) {
  const containerRef = useRef(null);
  const [pos, setPos] = useState(50);
  const [dragging, setDragging] = useState(false);

  const updateFromClientX = useCallback((clientX) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setPos(Math.min(100, Math.max(0, pct)));
  }, []);

  return (
    <div
      ref={containerRef}
      className={`proline-ba-slider ${className}`}
      onPointerDown={(e) => {
        setDragging(true);
        e.currentTarget.setPointerCapture(e.pointerId);
        updateFromClientX(e.clientX);
      }}
      onPointerMove={(e) => {
        if (dragging) updateFromClientX(e.clientX);
      }}
      onPointerUp={() => setDragging(false)}
      style={{
        position: "relative",
        width: "100%",
        aspectRatio: "16 / 9",
        borderRadius: 22,
        overflow: "hidden",
        userSelect: "none",
        cursor: "ew-resize",
        boxShadow: "0 24px 60px -24px color-mix(in srgb, var(--color-ink) 40%, transparent)",
      }}
    >
      <img src={after} alt="Après" draggable={false} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
      <div
        style={{
          position: "absolute",
          inset: 0,
          width: `${pos}%`,
          overflow: "hidden",
        }}
      >
        <img
          src={before}
          alt="Avant"
          draggable={false}
          style={{
            position: "absolute",
            inset: 0,
            height: "100%",
            width: containerRef.current ? containerRef.current.offsetWidth : "100%",
            objectFit: "cover",
          }}
        />
      </div>
      <div
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          left: `${pos}%`,
          width: 3,
          background: "#fff",
          transform: "translateX(-50%)",
          boxShadow: "0 0 0 4px rgba(255,255,255,.25)",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: `${pos}%`,
          transform: "translate(-50%, -50%)",
          width: 42,
          height: 42,
          borderRadius: "50%",
          background: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "var(--color-ink)",
          boxShadow: "0 8px 20px -6px rgba(0,0,0,.4)",
        }}
      >
        <MoveHorizontal size={20} strokeWidth={2.25} />
      </div>
      <span
        style={{
          position: "absolute",
          top: 12,
          left: 12,
          background: "rgba(11,39,69,.6)",
          color: "#fff",
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: ".08em",
          padding: "4px 10px",
          borderRadius: 999,
          textTransform: "uppercase",
        }}
      >
        Avant
      </span>
      <span
        style={{
          position: "absolute",
          top: 12,
          right: 12,
          background: "rgba(11,39,69,.6)",
          color: "#fff",
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: ".08em",
          padding: "4px 10px",
          borderRadius: 999,
          textTransform: "uppercase",
        }}
      >
        Après
      </span>
    </div>
  );
}
