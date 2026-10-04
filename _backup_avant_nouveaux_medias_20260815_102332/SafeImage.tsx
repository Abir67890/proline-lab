"use client";

interface SafeImageProps {
  src: string;
  fallback: string;
  alt?: string;
}

export default function SafeImage({ src, fallback, alt = "" }: SafeImageProps) {
  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      onError={(e) => {
        const img = e.currentTarget;
        if (img.src !== fallback) img.src = fallback;
      }}
    />
  );
}
