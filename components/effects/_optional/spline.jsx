"use client";
// Requires: @splinetool/react-spline @splinetool/runtime
// npm install @splinetool/react-spline @splinetool/runtime
import Spline from "@splinetool/react-spline";
import { Suspense } from "react";

/**
 * Embeds a Spline scene (exported public URL from spline.design).
 * scene="https://prod.spline.design/XXXXXXXX/scene.splinecode"
 */
export function SplineEmbed({ scene, className = "", fallback = null }) {
  if (!scene) return fallback;
  return (
    <Suspense fallback={fallback}>
      <Spline scene={scene} className={className} />
    </Suspense>
  );
}
