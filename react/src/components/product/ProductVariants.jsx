export function ProductVariants({ variants, selectedVariant, onVariantSelect }) {
  if (!variants || variants.length === 0) {
    return null;
  }

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium text-slate-600">Size</p>
      <div className="flex gap-2 flex-wrap">
        {variants.map((variant) => (
          <button
            key={variant.id}
            onClick={() => onVariantSelect(variant)}
            className={`rounded-lg border-2 px-3 py-1.5 text-sm font-medium transition ${
              selectedVariant?.id === variant.id
                ? "border-fuchsia-600 bg-fuchsia-50 text-fuchsia-600"
                : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
            }`}
          >
            {variant.size}
          </button>
        ))}
      </div>
      {selectedVariant && (
        <p className="text-xs text-slate-500">
          Stock: <span className="font-semibold text-slate-700">{selectedVariant.stock}</span>
        </p>
      )}
    </div>
  );
}
