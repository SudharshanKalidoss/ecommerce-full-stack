export function ProductActions({ onAddToCart }) {
  return (
    <div className="flex">
      <button
        onClick={onAddToCart}
        className="w-full rounded-xl bg-fuchsia-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-fuchsia-500"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className="inline h-4 w-4 mr-2"
          aria-hidden="true"
        >
          <path
            d="M6 6h15l-1.5 9h-12L4 6z"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path d="M6 6l-2-2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          <circle cx="9" cy="20" r="1" fill="currentColor" />
          <circle cx="19" cy="20" r="1" fill="currentColor" />
        </svg>
        Add to Cart
      </button>
    </div>
  );
}
