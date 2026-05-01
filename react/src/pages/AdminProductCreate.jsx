import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { AdminLayout } from "../components/admin/AdminLayout";
import { adminProductFormApi } from "../lib/admin-product-form-api";
import { ProductForm } from "../components/admin/product-form/ProductForm";
import { useToast } from "../hooks/use-toast";

const isAdminUser = (user) => String(user?.role || "").toUpperCase() === "ADMIN";

export default function AdminProductCreate() {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const adminLoggedIn = isAdminUser(user);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        setInitialLoading(true);
        const data = await adminProductFormApi.getCategories();
        setCategories(data);
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Failed to load categories",
          description: error.message || "Unable to fetch categories.",
        });
      } finally {
        setInitialLoading(false);
      }
    };
    if (adminLoggedIn) loadCategories();
  }, [adminLoggedIn]);

  if (!adminLoggedIn) return <Navigate to="/admin" replace />;

  const handleCreate = async (payload) => {
    try {
      setLoading(true);
      await adminProductFormApi.create(payload);
      toast({
        variant: "success",
        title: "Product created",
        description: "New product has been added successfully.",
      });
      navigate("/admin/products");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Create failed",
        description: error.message || "Unable to create product.",
      });
    } finally {
      setLoading(false);
    }
  };



  


  return (
    <AdminLayout user={user} onLogout={logout}>
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
        <h1 className="text-xl font-semibold text-slate-950 sm:text-2xl">Create Product</h1>
        <p className="mt-1 text-sm text-slate-600">Add product details, image and variants.</p>
        <div className="mt-5">
          {initialLoading ? (
            <p className="text-sm text-slate-500">Loading form...</p>
          ) : (
            <ProductForm
              categories={categories}
              mode="create"
              submitLabel="Create Product"
              loading={loading}
              onSubmit={handleCreate}
            />
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
