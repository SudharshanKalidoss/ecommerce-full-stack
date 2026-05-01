import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Header } from "../components/Header";
import { ProductCard } from "../components/product/ProductCard";
import { productApi } from "../lib/product-api";
import { categoryApi } from "../lib/category-api";
import { useCart } from "../context/CartContext";
import { useToast } from "../hooks/use-toast";
import { ConfirmDialog } from "../components/ui/confirm-dialog";

export default function CategoryProducts() {
  const { categoryId } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categoryName, setCategoryName] = useState("Category");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showSignInDialog, setShowSignInDialog] = useState(false);
  const itemsPerPage = 10;
  const { addToCart } = useCart();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    setCurrentPage(1);
  }, [categoryId]);

  useEffect(() => {
    const fetchCategoryDetails = async () => {
      try {
        const result = await categoryApi.getCategoryById(categoryId);
        const data = result?.data ?? result;
        if (data?.name) {
          setCategoryName(data.name);
          return;
        }
      } catch (err) {
        console.error("Failed to fetch category details:", err);
      }
      setCategoryName("Category");
    };

    if (categoryId) {
      fetchCategoryDetails();
    }
  }, [categoryId]);

  useEffect(() => {
    const fetchCategoryProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await productApi.list({
          categoryId,
          page: currentPage,
          limit: itemsPerPage,
        });
        if (result?.status === "SUCCESS" && result?.data) {
          setProducts(result.data.products || []);
          setTotalPages(result.data.totalPages || 1);
        } else {
          setProducts([]);
          setTotalPages(1);
        }
      } catch (err) {
        console.error("Failed to fetch category products:", err);
        setError("Failed to load category products");
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryProducts();
  }, [categoryId, currentPage]);

  const handleAddToCart = async (product, selectedVariant) => {
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
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          {error && (
            <div className="mb-6 rounded-lg border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
              {error}
            </div>
          )}

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <p className="text-slate-600">Loading products...</p>
            </div>
          ) : products.length > 0 ? (
            <div>
              <h2 className="mb-8 text-3xl font-bold tracking-tight text-slate-950">
                {categoryName} Products
              </h2>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={handleAddToCart}
                  />
                ))}
              </div>

              <div className="mt-12 flex flex-wrap items-center justify-center gap-3">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Previous
                </button>
                <div className="flex flex-wrap items-center justify-center gap-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`h-10 w-10 rounded-lg font-semibold transition ${
                        currentPage === page
                          ? "bg-fuchsia-600 text-white"
                          : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center py-12">
              <p className="text-slate-600">No products available for this category</p>
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
