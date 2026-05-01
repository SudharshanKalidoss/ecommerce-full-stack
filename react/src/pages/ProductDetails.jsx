import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Header } from "../components/Header";
import { productApi } from "../lib/product-api";
import { useCart } from "../context/CartContext";
import { useToast } from "../hooks/use-toast";
import { ConfirmDialog } from "../components/ui/confirm-dialog";

const decodeHtml = (html) => {
  if (!html) return "";
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  return doc.documentElement.textContent || "";
};

export default function ProductDetails() {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showSignInDialog, setShowSignInDialog] = useState(false);
  const { addToCart } = useCart();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError("");
        setNotFound(false);
        const result = await productApi.getBySlug(slug);
        const data = result?.data ?? result;
        if (!data?.id) {
          setProduct(null);
          setNotFound(true);
          return;
        }
        setProduct(data);
        const firstVariant = Array.isArray(data?.variants) && data.variants.length > 0 ? data.variants[0] : null;
        setSelectedVariant(firstVariant);
      } catch (err) {
        console.error("Failed to fetch product details:", err);
        if (err?.response?.status === 404) {
          setNotFound(true);
          setProduct(null);
        } else {
          setError(err.message || "Failed to load product.");
        }
      } finally {
        setLoading(false);
      }
    };

    if (slug) fetchProduct();
  }, [slug]);

  const displaySalePrice = selectedVariant?.salePrice ?? product?.salePrice;
  const displayComparePrice = selectedVariant?.comparePrice ?? product?.comparePrice;
  const discount =
    displayComparePrice && displaySalePrice
      ? Math.round(((Number(displayComparePrice) - Number(displaySalePrice)) / Number(displayComparePrice)) * 100)
      : 0;

  const descriptionHtml = useMemo(() => decodeHtml(product?.description || ""), [product?.description]);

  const handleAddToCart = async () => {
    if (!product) return;
    try {
      const result = await addToCart({
        productId: product.id,
        variantId: selectedVariant?.id ?? null,
        quantity: 1,
      });
      toast({
        variant: "success",
        title: "Cart updated",
        description: result?.updated ? "Quantity updated successfully." : "Product added to cart.",
      });
    } catch (err) {
      const message = err.message || "Failed to add item to cart";
      if (message.toLowerCase().includes("login")) {
        toast({
          variant: "destructive",
          title: "Sign in required",
          description: "Please sign in to add products to cart.",
        });
        setShowSignInDialog(true);
      } else {
        toast({
          variant: "destructive",
          title: "Unable to update cart",
          description: message,
        });
      }
    }
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-slate-50">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
          {loading ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-600 shadow-sm">
              Loading product...
            </div>
          ) : notFound ? (
            <div className="mx-auto max-w-xl rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
              <div className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-full bg-rose-50 text-rose-500">
                <svg viewBox="0 0 24 24" fill="none" className="h-7 w-7" aria-hidden="true">
                  <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
                  <path d="M9.2 9.2l5.6 5.6M14.8 9.2l-5.6 5.6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
              </div>
              <h1 className="mt-4 text-xl font-semibold text-slate-900">No Product Found</h1>
              <p className="mt-2 text-sm text-slate-600">
                We could not find a product for this link. It may have been removed or the URL is incorrect.
              </p>
              <Link
                to="/"
                className="mt-5 inline-flex items-center rounded-xl bg-fuchsia-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-fuchsia-500"
              >
                Back to Home
              </Link>
            </div>
          ) : error ? (
            <div className="rounded-2xl border border-rose-200 bg-rose-50 p-5 text-sm text-rose-700">{error}</div>
          ) : product ? (
            <div className="grid gap-8 lg:grid-cols-2">
              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                {product.thumbnail ? (
                  <img
                    src={product.thumbnail}
                    alt={product.title}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex min-h-[320px] items-center justify-center bg-slate-100 text-slate-400">
                    No image
                  </div>
                )}
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                <h1 className="text-2xl font-semibold text-slate-950 sm:text-3xl">{product.title}</h1>

                <div className="mt-3 flex flex-wrap items-center gap-3">
                  <span className="text-2xl font-bold text-fuchsia-600">Rs. {Number(displaySalePrice || 0).toFixed(2)}</span>
                  {displayComparePrice ? (
                    <span className="text-base text-slate-500 line-through">Rs. {Number(displayComparePrice).toFixed(2)}</span>
                  ) : null}
                  {discount > 0 ? (
                    <span className="rounded-full bg-rose-100 px-2 py-1 text-xs font-semibold text-rose-600">-{discount}%</span>
                  ) : null}
                </div>

                {product.shortDescription ? (
                  <p className="mt-4 text-sm leading-6 text-slate-600">{product.shortDescription}</p>
                ) : null}

                {Array.isArray(product.variants) && product.variants.length > 0 ? (
                  <div className="mt-5">
                    <p className="text-sm font-medium text-slate-700">Select Size</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {product.variants.map((variant) => (
                        <button
                          key={variant.id}
                          type="button"
                          onClick={() => setSelectedVariant(variant)}
                          className={`rounded-lg border-2 px-3 py-1.5 text-sm font-semibold transition ${
                            selectedVariant?.id === variant.id
                              ? "border-fuchsia-600 bg-fuchsia-50 text-fuchsia-700"
                              : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
                          }`}
                        >
                          {variant.size}
                        </button>
                      ))}
                    </div>
                    <p className="mt-2 text-xs text-slate-500">
                      Stock: <span className="font-semibold text-slate-700">{selectedVariant?.stock ?? product.stock ?? 0}</span>
                    </p>
                  </div>
                ) : (
                  <p className="mt-4 text-xs text-slate-500">
                    Stock: <span className="font-semibold text-slate-700">{product.stock ?? 0}</span>
                  </p>
                )}

                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="mt-6 inline-flex rounded-xl bg-fuchsia-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-fuchsia-500"
                >
                  Add to Cart
                </button>
              </div>

              <div className="lg:col-span-2 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                <h2 className="text-lg font-semibold text-slate-900">Description</h2>
                <div
                  className="prose prose-sm mt-4 max-w-none text-slate-700"
                  dangerouslySetInnerHTML={{ __html: descriptionHtml || "<p>No description available.</p>" }}
                />
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-600 shadow-sm">
              Product not found.
            </div>
          )}
        </div>
      </main>

      <ConfirmDialog
        open={showSignInDialog}
        title="Would you like to sign in?"
        description="You need to sign in before adding products to cart."
        confirmLabel="Sign In"
        confirmVariant="primary"
        onCancel={() => setShowSignInDialog(false)}
        onConfirm={() => {
          setShowSignInDialog(false);
          navigate("/login");
        }}
      />
    </>
  );
}
