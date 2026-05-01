const iconBaseClass = "h-4 w-4";

export function SocialPlatformIcon({ platform, className = iconBaseClass }) {
  const key = String(platform || "").toLowerCase();

  if (key === "facebook") {
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
        <path d="M13.5 21v-7.2h2.4l.4-2.8h-2.8V9.2c0-.8.2-1.4 1.4-1.4h1.5V5.3c-.3 0-1.2-.1-2.2-.1-2.2 0-3.7 1.3-3.7 3.9v2.1H8v2.8h2.5V21h3z" />
      </svg>
    );
  }

  if (key === "instagram") {
    return (
      <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
        <rect x="4" y="4" width="16" height="16" rx="4" stroke="currentColor" strokeWidth="1.8" />
        <circle cx="12" cy="12" r="3.5" stroke="currentColor" strokeWidth="1.8" />
        <circle cx="17.2" cy="6.8" r="1" fill="currentColor" />
      </svg>
    );
  }

  if (key === "twitter" || key === "x") {
    return (
      <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
        <path d="M5 5l14 14M19 5L5 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    );
  }

  if (key === "youtube") {
    return (
      <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
        <rect x="3.5" y="6.5" width="17" height="11" rx="3" stroke="currentColor" strokeWidth="1.8" />
        <path d="M10 9.5v5l4-2.5-4-2.5z" fill="currentColor" />
      </svg>
    );
  }

  if (key === "linkedin") {
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
        <path d="M6.5 8.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zM5.2 9.5h2.6V18H5.2V9.5zM10 9.5h2.5v1.2h.1c.4-.7 1.3-1.4 2.8-1.4 3 0 3.6 2 3.6 4.6V18h-2.6v-3.8c0-.9 0-2.1-1.3-2.1s-1.5 1-1.5 2V18H10V9.5z" />
      </svg>
    );
  }

  return (
    <span className={`${className} inline-flex items-center justify-center text-[10px] font-bold uppercase`}>
      {key.slice(0, 2) || "--"}
    </span>
  );
}
