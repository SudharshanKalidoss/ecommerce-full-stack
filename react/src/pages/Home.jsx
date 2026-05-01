import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "../components/Header";
import { ProductCard } from "../components/product/ProductCard";
import { productApi } from "../lib/product-api";
import { Button } from "../components/ui/button";
import { useCart } from "../context/CartContext";
import { useToast } from "../hooks/use-toast";
import { ConfirmDialog } from "../components/ui/confirm-dialog";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showSignInDialog, setShowSignInDialog] = useState(false);
  const itemsPerPage = 10;
  const { addToCart } = useCart();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const result = await productApi.list({
          page: currentPage,
          limit: itemsPerPage,
        });
        if (result.status === "SUCCESS" && result.data) {
          setProducts(result.data.products || []);
          setTotalPages(result.data.totalPages || 1);
        }
      } catch (err) {
        console.error("Failed to fetch products:", err);
        setError("Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [currentPage]);

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

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
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
                All Products
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

              {/* Pagination */}
              <div className="mt-12 flex flex-wrap items-center justify-center gap-3">
                <Button
                  variant="outline"
                  onClick={handlePreviousPage}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <div className="flex flex-wrap items-center justify-center gap-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(page)}
                      className={`h-10 w-10 ${
                        currentPage === page ? "bg-fuchsia-600 hover:bg-fuchsia-500" : ""
                      }`}
                    >
                      {page}
                    </Button>
                  ))}
                </div>
                <Button
                  variant="outline"
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center py-12">
              <p className="text-slate-600">No products available</p>
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
