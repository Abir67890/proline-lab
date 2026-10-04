"use client";
// Requires: matter-js
// npm install matter-js
import { useEffect, useRef } from "react";
import Matter from "matter-js";

/** A field of physics-driven bubbles the user can push around with the pointer. */
export function MatterBubbles({ count = 24, colors = ["#2E9E5B", "#0092C7", "#D98E04", "#8B2942"], className = "" }) {
  const sceneRef = useRef(null);

  useEffect(() => {
    const { Engine, Render, Runner, Bodies, Composite, Mouse, MouseConstraint, World } = Matter;
    const el = sceneRef.current;
    const w = el.clientWidth, h = el.clientHeight;

    const engine = Engine.create();
    engine.gravity.y = 0.15;

    const render = Render.create({
      element: el,
      engine,
      options: { width: w, height: h, background: "transparent", wireframes: false },
    });

    const walls = [
      Bodies.rectangle(w / 2, -10, w, 20, { isStatic: true }),
      Bodies.rectangle(w / 2, h + 10, w, 20, { isStatic: true }),
      Bodies.rectangle(-10, h / 2, 20, h, { isStatic: true }),
      Bodies.rectangle(w + 10, h / 2, 20, h, { isStatic: true }),
    ];

    const bubbles = Array.from({ length: count }, () => {
      const r = Math.random() * 18 + 8;
      return Bodies.circle(Math.random() * w, Math.random() * h, r, {
        restitution: 0.9,
        friction: 0.02,
        render: { fillStyle: colors[Math.floor(Math.random() * colors.length)], opacity: 0.5 },
      });
    });

    const mouse = Mouse.create(render.canvas);
    const mouseConstraint = MouseConstraint.create(engine, { mouse, constraint: { stiffness: 0.15, render: { visible: false } } });

    World.add(engine.world, [...walls, ...bubbles, mouseConstraint]);
    render.mouse = mouse;

    const runner = Runner.create();
    Runner.run(runner, engine);
    Render.run(render);

    return () => {
      Render.stop(render);
      Runner.stop(runner);
      World.clear(engine.world);
      Engine.clear(engine);
      render.canvas.remove();
      render.textures = {};
    };
  }, [count, colors]);

  return <div ref={sceneRef} className={className} style={{ position: "absolute", inset: 0, pointerEvents: "auto" }} />;
}
