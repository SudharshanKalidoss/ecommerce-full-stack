import { useEffect, useRef } from "react";
import { Input } from "../../ui/input";

const sizeOptions = ["S", "M", "L", "XL"];

export function ProductVariantsField({ variants, onVariantsChange }) {
  const selectedSizes = new Set(variants.map((variant) => variant.size));
  const variantCacheRef = useRef(new Map());

  useEffect(() => {
    // Keep cache in sync with latest values (useful for edit form)
    variants.forEach((variant) => {
      variantCacheRef.current.set(variant.size, { ...variant });
    });
  }, [variants]);

  const toggleSize = (size) => {
    const exists = selectedSizes.has(size);
    if (exists) {
      const current = variants.find((variant) => variant.size === size);
      if (current) variantCacheRef.current.set(size, { ...current });
      onVariantsChange(variants.filter((variant) => variant.size !== size));
      return;
    }

    const cached = variantCacheRef.current.get(size);
    const next = [
      ...variants,
      cached || {
        size,
        salePrice: "",
        comparePrice: "",
        stock: "",
      },
    ];
    // keep consistent order S, M, L, XL
    next.sort((a, b) => sizeOptions.indexOf(a.size) - sizeOptions.indexOf(b.size));
    onVariantsChange(next);
  };

  const handleVariantChange = (size, field, value) => {
    onVariantsChange(
      variants.map((variant) => (variant.size === size ? { ...variant, [field]: value } : variant))
    );
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <p className="text-sm font-semibold text-slate-900">Variants</p>
      <p className="mt-1 text-xs text-slate-500">Optional. If you choose a size, its fields must be filled.</p>

      <div className="mt-3 grid gap-2 text-left">
        <label className="text-sm font-medium text-slate-900">Choose Sizes (S, M, L, XL)</label>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {sizeOptions.map((size) => {
            const checked = selectedSizes.has(size);
            return (
              <button
                key={size}
                type="button"
                onClick={() => toggleSize(size)}
                className={`flex items-center justify-between rounded-2xl border px-4 py-3 text-left text-sm font-semibold transition ${
                  checked
                    ? "border-fuchsia-200 bg-fuchsia-50 text-fuchsia-700"
                    : "border-slate-200 bg-white text-slate-800 hover:bg-slate-50"
                }`}
                aria-pressed={checked}
              >
                <span>Size {size}</span>
                <span
                  className={`inline-flex h-5 w-5 items-center justify-center rounded-md border ${
                    checked ? "border-fuchsia-600 bg-fuchsia-600 text-white" : "border-slate-300 bg-white text-transparent"
                  }`}
                  aria-hidden="true"
                >
                  <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
                    <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {variants.length > 0 && (
        <div className="mt-4 space-y-3">
          {variants.map((variant) => (
            <div key={variant.size} className="rounded-xl border border-slate-200 bg-white p-3">
              <p className="mb-2 text-sm font-semibold text-slate-900">Size {variant.size}</p>
              <div className="grid gap-3 sm:grid-cols-3">
                <Input
                  placeholder="Sale Price"
                  type="number"
                  value={variant.salePrice}
                  onChange={(e) => handleVariantChange(variant.size, "salePrice", e.target.value)}
                />
                <Input
                  placeholder="Compare Price"
                  type="number"
                  value={variant.comparePrice}
                  onChange={(e) => handleVariantChange(variant.size, "comparePrice", e.target.value)}
                />
                <Input
                  placeholder="Stock"
                  type="number"
                  value={variant.stock}
                  onChange={(e) => handleVariantChange(variant.size, "stock", e.target.value)}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
