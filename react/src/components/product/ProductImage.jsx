export function ProductImage({ title, thumbnail }) {
  if (thumbnail) {
    return (
      <div className="relative w-full bg-slate-100 rounded-2xl h-64 flex items-center justify-center overflow-hidden">
        <img
          src={thumbnail}
          alt={title}
          loading="lazy"
          className="h-full w-full object-cover"
        />
      </div>
    );
  }

  return (
    <div className="relative w-full bg-slate-200 rounded-2xl h-64 flex items-center justify-center overflow-hidden">
      <svg
        viewBox="0 0 24 24"
        fill="none"
        className="h-20 w-20 text-slate-400"
        aria-hidden="true"
      >
        <path
          d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2z"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <path
          d="M9 9c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm9.5 6l-3.5-4.5-3 4-2-2.5-3.5 4.5"
          stroke="currentColor"
          strokeWidth="1.5"
        />
      </svg>
    </div>
  );
}
