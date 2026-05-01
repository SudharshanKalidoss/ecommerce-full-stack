import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { authApi } from "../lib/auth-api";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { PasswordInput } from "../components/ui/password-input";
import { Header } from "../components/Header";

export default function Login() {
  const { login, isLoggedIn } = useAuth();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const err = {};

    if (!form.email.trim()) {
      err.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      err.email = "Invalid email address";
    }

    if (!form.password) {
      err.password = "Password is required";
    } else if (form.password.length < 6) {
      err.password = "Password must be at least 6 characters";
    }

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setLoading(true);
      const data = await authApi.login(form);
      login(data.accessToken, data.user || null);
      alert("Login successful");
    } catch (error) {
      setErrors({ general: error.message || "Invalid credentials. Please check your email and password." });
    } finally {
      setLoading(false);
    }
  };

  if (isLoggedIn) {
    return <Navigate to="/" replace />;
  }

  return (
    <>
      <Header showCategories={false} />
      <main className="min-h-screen bg-gradient-to-br from-rose-100 via-pink-100 to-purple-100 px-4 py-10 sm:px-6 lg:px-8">
        <div className="relative mx-auto w-full max-w-3xl rounded-[2rem] border border-slate-200/80 bg-white p-6 shadow-2xl shadow-[0_35px_80px_-35px_rgba(15,23,42,0.25)] sm:p-8">
        <div className="grid gap-8">
          <div className="text-center">
            {/* <p className="text-sm font-semibold uppercase tracking-[0.35em] text-rose-500">Cloth shop login</p> */}
            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
              Welcome back to your style account
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-slate-600">
              Sign in to continue shopping, save favourites, and see your latest order updates.
            </p>
          </div>

          <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50/95 p-7 shadow-lg shadow-slate-200/40">
            <div className="mb-7 text-center">
              <p className="text-xs uppercase tracking-[0.24em] text-slate-500 sm:text-sm sm:tracking-[0.32em]">Secure login</p>
              <p className="mt-1 text-sm text-slate-600">Your account is protected so you can shop with confidence.</p>
            </div>

            {errors.general && (
              <div className="rounded-3xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
                {errors.general}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <Input
                label="Email address"
                type="email"
                placeholder="name@example.com"
                value={form.email}
                error={errors.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />

              <PasswordInput
                label="Password"
                placeholder="Enter your password"
                value={form.password}
                error={errors.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                description="Secure password required"
              />

       
              <Button type="submit" disabled={loading} className="mt-1 bg-fuchsia-600 hover:bg-fuchsia-500">
                {loading ? "Signing in..." : "Sign in"}
              </Button>
            </form>
            <p className="mt-5 text-center text-sm text-slate-600">
              No account?{" "}
              <Link to="/register" className="font-semibold text-fuchsia-600 hover:text-fuchsia-500">
                Register
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
    </>
  );
}
