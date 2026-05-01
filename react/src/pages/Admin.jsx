import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { adminAuthApi } from "../lib/admin-auth-api";
import { adminDashboardApi } from "../lib/admin-dashboard-api";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { PasswordInput } from "../components/ui/password-input";
import { AdminLayout } from "../components/admin/AdminLayout";

const isAdminUser = (user) => String(user?.role || "").toUpperCase() === "ADMIN";

export default function Admin() {
  const { user, login, logout, authReady } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [generalError, setGeneralError] = useState("");
  const [counts, setCounts] = useState({ products: 0, users: 0 });
  const [countsLoading, setCountsLoading] = useState(false);
  const adminLoggedIn = isAdminUser(user);

  useEffect(() => {
    const fetchDashboardCounts = async () => {
      if (!adminLoggedIn) return;
      try {
        setCountsLoading(true);
        const data = await adminDashboardApi.getCounts();
        setCounts({
          products: Number(data?.products || 0),
          users: Number(data?.users || 0),
        });
      } catch (error) {
        console.error("Failed to fetch admin counts:", error);
        setCounts({ products: 0, users: 0 });
      } finally {
        setCountsLoading(false);
      }
    };

    fetchDashboardCounts();
  }, [adminLoggedIn]);

  const validate = () => {
    const err = {};
    if (!form.email.trim()) err.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) err.email = "Invalid email address";
    if (!form.password) err.password = "Password is required";
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGeneralError("");
    if (!validate()) return;

    try {
      setLoading(true);
      const data = await adminAuthApi.login(form);
      const nextUser = data.user || null;
      if (!isAdminUser(nextUser)) {
        setGeneralError("Only ADMIN users can access this page.");
        return;
      }
      login(data.accessToken, nextUser);
    } catch (error) {
      setGeneralError(error.message || "Admin login failed.");
    } finally {
      setLoading(false);
    }
  };

  if (!authReady) {
    return (
      <main className="min-h-screen bg-slate-100 px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-3xl rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-600 shadow-sm">
          Loading admin dashboard...
        </div>
      </main>
    );
  }

  if (adminLoggedIn) {
    return (
      <AdminLayout user={user} onLogout={logout}>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <h1 className="text-xl font-semibold text-slate-950 sm:text-2xl">Welcome, Admin</h1>
          <p className="mt-2 text-sm text-slate-600">
            Dashboard summary
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <Link
              to="/admin/products"
              className="rounded-xl border border-slate-200 bg-slate-50 p-4 transition hover:border-fuchsia-300 hover:bg-fuchsia-50/60"
            >
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Products</p>
              <p className="mt-2 text-2xl font-semibold text-slate-900">
                {countsLoading ? "..." : counts.products}
              </p>
            </Link>
            <Link
              to="/admin/users"
              className="rounded-xl border border-slate-200 bg-slate-50 p-4 transition hover:border-fuchsia-300 hover:bg-fuchsia-50/60"
            >
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Users</p>
              <p className="mt-2 text-2xl font-semibold text-slate-900">
                {countsLoading ? "..." : counts.users}
              </p>
            </Link>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-rose-100 via-pink-100 to-purple-100 px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-3xl rounded-[2rem] border border-slate-200/80 bg-white p-6 shadow-2xl shadow-[0_35px_80px_-35px_rgba(15,23,42,0.25)] sm:p-8">
          <div className="grid gap-8">
            <div className="text-center">
              <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
                Admin control login
              </h1>
              <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-slate-600">
                Sign in with your admin account to manage products, categories, and orders.
              </p>
            </div>

            <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50/95 p-7 shadow-lg shadow-slate-200/40">
              <div className="mb-2">
                <p className="text-sm uppercase tracking-[0.32em] text-slate-500">Secure admin login</p>
                <p className="mt-1 text-sm text-slate-600">Only ADMIN users can access this control area.</p>
              </div>

              {generalError && (
                <div className="rounded-3xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
                  {generalError}
                </div>
              )}

              <form onSubmit={handleSubmit} className="mt-5 space-y-5">
                <Input
                  label="Admin email"
                  type="email"
                  placeholder="admin@example.com"
                  value={form.email}
                  error={errors.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
                <PasswordInput
                  label="Admin password"
                  placeholder="Enter your admin password"
                  value={form.password}
                  error={errors.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                />
                <Button type="submit" disabled={loading} className="mt-1 bg-fuchsia-600 hover:bg-fuchsia-500">
                  {loading ? "Signing in..." : "Sign in as Admin"}
                </Button>
              </form>
            </div>
          </div>
        </div>
    </main>
  );
}
