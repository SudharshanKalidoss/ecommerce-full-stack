import { useState } from "react";
import { Link } from "react-router-dom";
import { ProductImage } from "./ProductImage";
import { ProductTitle } from "./ProductTitle";
import { ProductPrice } from "./ProductPrice";
import { ProductVariants } from "./ProductVariants";
import { ProductActions } from "./ProductActions";

export function ProductCard({ product, onAddToCart }) {
  const productPath = product?.slug ? `/product/${product.slug}` : "#";
  const [selectedVariant, setSelectedVariant] = useState(
    product.variants && product.variants.length > 0 ? product.variants[0] : null
  );

  const handleAddToCart = () => {
    onAddToCart?.(product, selectedVariant);
  };

  const handleVariantSelect = (variant) => {
    setSelectedVariant(variant);
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm hover:shadow-md transition">
      <Link to={productPath} className={`block ${!product?.slug ? "pointer-events-none opacity-70" : ""}`}>
        <ProductImage title={product.title} thumbnail={product.thumbnail} />
      </Link>
      
      <div className="mt-4 space-y-3">
        <Link to={productPath} className={`block ${!product?.slug ? "pointer-events-none opacity-70" : ""}`}>
          <ProductTitle title={product.title} />
        </Link>
        
        <ProductPrice
          salePrice={product.salePrice}
          comparePrice={product.comparePrice}
          selectedVariant={selectedVariant}
        />

        <ProductVariants
          variants={product.variants}
          selectedVariant={selectedVariant}
          onVariantSelect={handleVariantSelect}
        />

        <ProductActions
          onAddToCart={handleAddToCart}
        />
      </div>
    </div>
  );
}
