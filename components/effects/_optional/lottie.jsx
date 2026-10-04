"use client";
// Requires: lottie-react
// npm install lottie-react
import Lottie from "lottie-react";

/**
 * Drop-in Lottie player.
 * `animationData` = the imported JSON export from an After Effects/Bodymovin file.
 * Usage: import loaderAnim from "@/public/lottie/loader.json"; <LottiePlayer animationData={loaderAnim} />
 */
export function LottiePlayer({ animationData, loop = true, autoplay = true, className = "", style = {} }) {
  if (!animationData) return null;
  return (
    <Lottie
      animationData={animationData}
      loop={loop}
      autoplay={autoplay}
      className={className}
      style={{ width: "100%", height: "100%", ...style }}
    />
  );
}
