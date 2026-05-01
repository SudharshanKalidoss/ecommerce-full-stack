import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { AdminLayout } from "../components/admin/AdminLayout";
import { adminProductsApi } from "../lib/admin-products-api";
import { useToast } from "../hooks/use-toast";
import { ConfirmDialog } from "../components/ui/confirm-dialog";

const isAdminUser = (user) => String(user?.role || "").toUpperCase() === "ADMIN";

export default function AdminProducts() {
  const { user, logout, authReady } = useAuth();
  const { toast } = useToast();
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [reloadKey, setReloadKey] = useState(0);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const itemsPerPage = 10;
  const adminLoggedIn = isAdminUser(user);
  const pageStartIndex = (currentPage - 1) * itemsPerPage;
  const hasSearch = search.trim().length > 0 || appliedSearch.length > 0;

  const clearSearch = () => {
    setSearch("");
    setAppliedSearch("");
    setCurrentPage(1);
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await adminProductsApi.list({
          page: currentPage,
          limit: itemsPerPage,
          search: appliedSearch || undefined,
        });
        const list = data?.products || data?.items || [];
        setProducts(list);
        setTotalPages(Number(data?.totalPages || 1));
        setTotalItems(Number(data?.totalItems || list.length));
      } catch (error) {
        console.error("Failed to fetch admin products:", error);
        setProducts([]);
        setTotalPages(1);
        setTotalItems(0);
        toast({
          variant: "destructive",
          title: "Failed to load products",
          description: error.message || "Unable to fetch products.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [currentPage, appliedSearch, reloadKey]);

  if (!authReady) {
    return (
      <AdminLayout user={user} onLogout={logout}>
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-600 shadow-sm">
          Loading products...
        </div>
      </AdminLayout>
    );
  }

  if (!adminLoggedIn) {
    return <Navigate to="/admin" replace />;
  }

  const openDeleteDialog = (product) => {
    setProductToDelete(product);
    setDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    if (deletingId) return;
    setDeleteDialogOpen(false);
    setProductToDelete(null);
  };

  const confirmDelete = async () => {
    const productId = productToDelete?.id;
    if (!productId) return;

    try {
      setDeletingId(productId);
      await adminProductsApi.remove(productId);
      toast({
        variant: "success",
        title: "Product deleted",
        description: "The product has been removed.",
      });
      const nextPage = products.length === 1 && currentPage > 1 ? currentPage - 1 : currentPage;
      setCurrentPage(nextPage);
      if (nextPage === currentPage) setReloadKey((prev) => prev + 1);
      setDeleteDialogOpen(false);
      setProductToDelete(null);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Delete failed",
        description: error.message || "Unable to delete product.",
      });
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <AdminLayout user={user} onLogout={logout}>
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-xl font-semibold text-slate-950 sm:text-2xl">Products</h1>
            <p className="text-sm text-slate-600">Total: {totalItems}</p>
          </div>
          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setCurrentPage(1);
                setAppliedSearch(search.trim());
              }}
              className="flex w-full gap-2 sm:w-auto"
            >
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products..."
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-fuchsia-500 sm:w-64"
              />
              <button
                type="submit"
                className="rounded-xl bg-fuchsia-600 px-4 py-2 text-sm font-semibold text-white hover:bg-fuchsia-500"
              >
                Search
              </button>
              <button
                type="button"
                onClick={clearSearch}
                disabled={!hasSearch}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Clear
              </button>
            </form>
            <Link
              to="/admin/products/new"
              className="inline-flex items-center justify-center rounded-xl border border-fuchsia-200 bg-fuchsia-50 px-4 py-2 text-sm font-semibold text-fuchsia-700 hover:bg-fuchsia-100"
            >
              + Add Product
            </Link>
          </div>
        </div>

        <div className="mt-4 overflow-x-auto rounded-xl border border-slate-200">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-slate-50 text-left">
              <tr>
                <th className="px-3 py-3 font-semibold text-slate-700">S.No</th>
                <th className="px-3 py-3 font-semibold text-slate-700">Image</th>
                <th className="px-3 py-3 font-semibold text-slate-700">Title</th>
                <th className="px-3 py-3 font-semibold text-slate-700">Sale Price</th>
                <th className="px-3 py-3 font-semibold text-slate-700">Compare Price</th>
                <th className="px-3 py-3 font-semibold text-slate-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-3 py-8 text-center text-slate-500">
                    Loading products...
                  </td>
                </tr>
              ) : products.length > 0 ? (
                products.map((product, index) => (
                  <tr key={product.id} className="transition hover:bg-fuchsia-50/60">
                    <td className="px-3 py-3 text-slate-700">{pageStartIndex + index + 1}</td>
                    <td className="px-3 py-3">
                      {product.thumbnail ? (
                        <img
                          src={product.thumbnail}
                          alt={product.title}
                          className="h-12 w-12 rounded-lg border border-slate-200 object-cover"
                        />
                      ) : (
                        <div className="h-12 w-12 rounded-lg border border-slate-200 bg-slate-100" />
                      )}
                    </td>
                    <td className="px-3 py-3 font-medium text-slate-800">{product.title}</td>
                    <td className="px-3 py-3 text-slate-700">Rs. {product.salePrice}</td>
                    <td className="px-3 py-3 text-slate-500 line-through">Rs. {product.comparePrice}</td>
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-2">
                        <Link
                          to={`/admin/products/${product.id}/edit`}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50"
                          aria-label="Edit product"
                        >
                          <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden="true">
                            <path d="M4 20h4l10-10-4-4L4 16v4z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </Link>
                        <button
                          type="button"
                          onClick={() => openDeleteDialog(product)}
                          disabled={deletingId === product.id}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50 disabled:opacity-60"
                          aria-label="Delete product"
                        >
                          {deletingId === product.id ? (
                            <svg viewBox="0 0 24 24" className="h-4 w-4 animate-spin" aria-hidden="true">
                              <circle
                                cx="12"
                                cy="12"
                                r="9"
                                stroke="currentColor"
                                strokeWidth="2.5"
                                opacity="0.25"
                                fill="none"
                              />
                              <path
                                d="M21 12a9 9 0 0 0-9-9"
                                stroke="currentColor"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                                fill="none"
                                opacity="0.9"
                              />
                            </svg>
                          ) : (
                            <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden="true">
                              <path
                                d="M6 7h12M10 11v6M14 11v6M9 7l1-2h4l1 2M8 7l1 12h6l1-12"
                                stroke="currentColor"
                                strokeWidth="1.8"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-3 py-8 text-center text-slate-500">
                    No products found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex items-center justify-center gap-2">
          <button
            type="button"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-semibold text-slate-700 disabled:opacity-50"
          >
            Previous
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              type="button"
              onClick={() => setCurrentPage(page)}
              className={`h-9 w-9 rounded-lg text-sm font-semibold ${
                currentPage === page ? "bg-fuchsia-600 text-white" : "border border-slate-200 bg-white text-slate-700"
              }`}
            >
              {page}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-semibold text-slate-700 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>

      <ConfirmDialog
        open={deleteDialogOpen}
        title="Delete product?"
        description={
          productToDelete?.title
            ? `This will permanently delete “${productToDelete.title}”. This action cannot be undone.`
            : "This will permanently delete this product. This action cannot be undone."
        }
        confirmLabel="Delete"
        cancelLabel="Cancel"
        confirmVariant="danger"
        loading={Boolean(deletingId)}
        onCancel={closeDeleteDialog}
        onConfirm={confirmDelete}
      />
    </AdminLayout>
  );
}
