"use client";
// Requires: pixi.js
// npm install pixi.js
import { useEffect, useRef } from "react";
import * as PIXI from "pixi.js";

/** GPU particle field via PixiJS — use where you need far more particles than canvas2d can handle smoothly. */
export function PixiParticleField({ count = 400, color = 0xffffff, className = "" }) {
  const hostRef = useRef(null);

  useEffect(() => {
    const host = hostRef.current;
    const app = new PIXI.Application({
      resizeTo: host,
      backgroundAlpha: 0,
      antialias: true,
    });
    host.appendChild(app.view);

    const texture = PIXI.Texture.from(
      (() => {
        const c = document.createElement("canvas");
        c.width = c.height = 8;
        const ctx = c.getContext("2d");
        ctx.beginPath(); ctx.arc(4, 4, 4, 0, Math.PI * 2); ctx.fillStyle = "#fff"; ctx.fill();
        return c;
      })()
    );

    const particles = Array.from({ length: count }, () => {
      const sprite = new PIXI.Sprite(texture);
      sprite.tint = color;
      sprite.anchor.set(0.5);
      sprite.x = Math.random() * app.screen.width;
      sprite.y = Math.random() * app.screen.height;
      const scale = Math.random() * 0.35 + 0.08;
      sprite.scale.set(scale);
      sprite.alpha = Math.random() * 0.5 + 0.1;
      sprite.vy = -(Math.random() * 0.6 + 0.15);
      sprite.vx = (Math.random() - 0.5) * 0.2;
      app.stage.addChild(sprite);
      return sprite;
    });

    app.ticker.add(() => {
      particles.forEach((p) => {
        p.x += p.vx; p.y += p.vy;
        if (p.y < -10) { p.y = app.screen.height + 10; p.x = Math.random() * app.screen.width; }
      });
    });

    return () => {
      app.destroy(true, { children: true, texture: true, baseTexture: true });
    };
  }, [count, color]);

  return <div ref={hostRef} className={className} style={{ position: "absolute", inset: 0, pointerEvents: "none" }} />;
}
