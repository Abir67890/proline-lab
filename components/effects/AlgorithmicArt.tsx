"use client";

import { useEffect, useRef } from "react";

export default function AlgorithmicArt() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrame = 0;
    let width = 0;
    let height = 0;

    const particles: {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
    }[] = [];

    const mouse = {
      x: -1000,
      y: -1000,
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();

      width = rect.width;
      height = rect.height;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = width * dpr;
      canvas.height = height * dpr;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      particles.length = 0;

      const count = Math.min(85, Math.max(35, Math.floor(width / 15)));

      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.35,
          vy: (Math.random() - 0.5) * 0.35,
          radius: Math.random() * 1.8 + 0.7,
        });
      }
    };

    const handleMouseMove = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();

      mouse.x = event.clientX - rect.left;
      mouse.y = event.clientY - rect.top;
    };

    const handleMouseLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // Background
      const gradient = ctx.createRadialGradient(
        width * 0.5,
        height * 0.4,
        0,
        width * 0.5,
        height * 0.4,
        Math.max(width, height)
      );

      gradient.addColorStop(0, "rgba(20, 116, 145, 0.16)");
      gradient.addColorStop(0.45, "rgba(53, 107, 82, 0.08)");
      gradient.addColorStop(1, "rgba(7, 59, 76, 0)");

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // Particles
      for (const particle of particles) {
        const dx = particle.x - mouse.x;
        const dy = particle.y - mouse.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 130 && distance > 0) {
          const force = (130 - distance) / 130;

          particle.vx += (dx / distance) * force * 0.018;
          particle.vy += (dy / distance) * force * 0.018;
        }

        particle.x += particle.vx;
        particle.y += particle.vy;

        particle.vx *= 0.995;
        particle.vy *= 0.995;

        if (particle.x < -20) particle.x = width + 20;
        if (particle.x > width + 20) particle.x = -20;
        if (particle.y < -20) particle.y = height + 20;
        if (particle.y > height + 20) particle.y = -20;

        ctx.beginPath();
        ctx.arc(
          particle.x,
          particle.y,
          particle.radius,
          0,
          Math.PI * 2
        );

        ctx.fillStyle = "rgba(110, 198, 255, 0.75)";
        ctx.fill();
      }

      // Connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i];
          const b = particles[j];

          const dx = a.x - b.x;
          const dy = a.y - b.y;

          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 115) {
            const opacity = (1 - distance / 115) * 0.25;

            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);

            ctx.strokeStyle = `rgba(110, 198, 255, ${opacity})`;
            ctx.lineWidth = 0.7;
            ctx.stroke();
          }
        }
      }

      // Organic waves
      for (let wave = 0; wave < 3; wave++) {
        ctx.beginPath();

        const baseY =
          height * (0.72 + wave * 0.08);

        for (let x = 0; x <= width; x += 8) {
          const y =
            baseY +
            Math.sin(x * 0.008 + performance.now() * 0.00035 + wave) *
              (12 + wave * 4) +
            Math.sin(x * 0.018 + wave) * 5;

          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }

        ctx.strokeStyle = `rgba(155, 112, 184, ${
          0.08 - wave * 0.015
        })`;

        ctx.lineWidth = 1;
        ctx.stroke();
      }

      animationFrame = requestAnimationFrame(draw);
    };

    resize();

    window.addEventListener("resize", resize);
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseleave", handleMouseLeave);

    animationFrame = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animationFrame);

      window.removeEventListener("resize", resize);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <section className="algorithmic-art">
      <canvas
        ref={canvasRef}
        className="algorithmic-art__canvas"
        aria-hidden="true"
      />

      <div className="algorithmic-art__glow" />

      <div className="algorithmic-art__content">
        <div className="algorithmic-art__eyebrow">
          PROLINE LAB · CLEAN SCIENCE
        </div>

        <h2>
          La science de la propreté,
          <span> mise en mouvement.</span>
        </h2>

        <p>
          Une visualisation générative inspirée des molécules, des fluides
          et de la précision industrielle pour représenter l'approche
          scientifique de PROLINE Lab.
        </p>

        <div className="algorithmic-art__tags">
          <span>Hygiène</span>
          <span>Performance</span>
          <span>Innovation</span>
          <span>Précision</span>
        </div>
      </div>
    </section>
  );
}