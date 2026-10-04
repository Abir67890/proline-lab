"use client";

import { useState } from "react";

interface SafeImageProps {
  src: string;
  fallback: string;
  alt?: string;
  className?: string;
  loading?: "lazy" | "eager";
}

export default function SafeImage({
  src,
  fallback,
  alt = "",
  className = "",
  loading = "lazy",
}: SafeImageProps) {
  const [currentSrc, setCurrentSrc] = useState(src);
  const [failed, setFailed] = useState(false);

  return (
    <img
      src={currentSrc}
      alt={alt}
      loading={loading}
      className={className}
      onError={() => {
        if (!failed && currentSrc !== fallback) {
          setFailed(true);
          setCurrentSrc(fallback);
        }
      }}
    />
  );
}
