import { useEffect, useState } from "react";

const DEFAULT_IMAGE_PLACEHOLDER =
  "data:image/svg+xml," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 240">
      <rect width="320" height="240" fill="#f1f5f9"/>
      <rect x="30" y="30" width="260" height="180" rx="14" fill="#e2e8f0"/>
      <path d="M110 105a16 16 0 1 0 0.1 0" fill="#94a3b8"/>
      <path d="M70 180l55-55 35 35 30-30 60 60H70z" fill="#94a3b8"/>
    </svg>`
  );

export function AppImage({ src, alt, fallbackSrc = DEFAULT_IMAGE_PLACEHOLDER, ...props }) {
  const [currentSrc, setCurrentSrc] = useState(src || fallbackSrc);

  useEffect(() => {
    setCurrentSrc(src || fallbackSrc);
  }, [src, fallbackSrc]);

  return (
    <img
      {...props}
      src={currentSrc}
      alt={alt}
      onError={() => {
        if (currentSrc !== fallbackSrc) {
          setCurrentSrc(fallbackSrc);
        }
      }}
    />
  );
}
