export function ProductPrice({ salePrice, comparePrice, selectedVariant }) {
  // Use variant price if variant is selected, otherwise use product price
  const displaySalePrice = selectedVariant?.salePrice || salePrice;
  const displayComparePrice = selectedVariant?.comparePrice || comparePrice;

  const discount = displayComparePrice && displaySalePrice
    ? Math.round(((displayComparePrice - displaySalePrice) / displayComparePrice) * 100)
    : 0;

  return (
    <div className="flex items-center gap-3">
      <span className="text-2xl font-bold text-fuchsia-600">
        ₹{parseFloat(displaySalePrice).toFixed(2)}
      </span>
      {displayComparePrice && (
        <>
          <span className="text-sm text-slate-500 line-through">
            ₹{parseFloat(displayComparePrice).toFixed(2)}
          </span>
          {discount > 0 && (
            <span className="rounded-full bg-rose-100 px-2 py-1 text-xs font-semibold text-rose-600">
              -{discount}%
            </span>
          )}
        </>
      )}
    </div>
  );
}
