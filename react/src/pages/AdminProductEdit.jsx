import { useEffect, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { AdminLayout } from "../components/admin/AdminLayout";
import { adminProductFormApi } from "../lib/admin-product-form-api";
import { ProductForm } from "../components/admin/product-form/ProductForm";
import { useToast } from "../hooks/use-toast";

const isAdminUser = (user) => String(user?.role || "").toUpperCase() === "ADMIN";

export default function AdminProductEdit() {
  const { user, logout } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [categories, setCategories] = useState([]);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const adminLoggedIn = isAdminUser(user);

  useEffect(() => {
    const loadData = async () => {
      try {
        setInitialLoading(true);
        const [categoryData, productData] = await Promise.all([
          adminProductFormApi.getCategories(),
          adminProductFormApi.getProductById(id),
        ]);
        setCategories(categoryData);
        setProduct(productData);
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Failed to load product",
          description: error.message || "Unable to fetch product details.",
        });
      } finally {
        setInitialLoading(false);
      }
    };
    if (adminLoggedIn && id) loadData();
  }, [adminLoggedIn, id]);

  if (!adminLoggedIn) return <Navigate to="/admin" replace />;

  const handleUpdate = async (payload) => {
    try {
      setLoading(true);
      await adminProductFormApi.update(id, payload);
      toast({
        variant: "success",
        title: "Product updated",
        description: "Product has been updated successfully.",
      });
      navigate("/admin/products");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Update failed",
        description: error.message || "Unable to update product.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout user={user} onLogout={logout}>
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
        <h1 className="text-xl font-semibold text-slate-950 sm:text-2xl">Edit Product</h1>
        <p className="mt-1 text-sm text-slate-600">Update product details and variants.</p>
        <div className="mt-5">
          {initialLoading || !product ? (
            <p className="text-sm text-slate-500">Loading product...</p>
          ) : (
            <ProductForm
              initialProduct={product}
              categories={categories}
              mode="edit"
              submitLabel="Update Product"
              loading={loading}
              onSubmit={handleUpdate}
            />
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
