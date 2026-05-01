import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { authApi } from "../lib/auth-api";
import { useAuth } from "../context/AuthContext";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { PasswordInput } from "../components/ui/password-input";
import { Header } from "../components/Header";
import { useToast } from "../hooks/use-toast";

export default function Register() {
  const { isLoggedIn } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const err = {};
    if (!form.firstName.trim()) err.firstName = "First name is required";
    if (!form.lastName.trim()) err.lastName = "Last name is required";
    if (!form.phone.trim()) err.phone = "Phone is required";
    else if (!/^[0-9+\-\s()]{8,15}$/.test(form.phone.trim())) err.phone = "Invalid phone number";
    if (!form.email.trim()) err.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) err.email = "Invalid email address";
    if (!form.password) err.password = "Password is required";
    else if (form.password.length < 6) err.password = "Password must be at least 6 characters";
    if (!form.confirmPassword) err.confirmPassword = "Confirm password is required";
    else if (form.confirmPassword !== form.password) err.confirmPassword = "Passwords do not match";
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setLoading(true);
      await authApi.register({
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        email: form.email,
        phoneNumber: form.phone.trim(),
        password: form.password,
      });
      toast({
        variant: "success",
        title: "Registration successful",
        description: "Your account has been created. Please sign in.",
      });
      navigate("/login");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Registration failed",
        description: error.message || "Please try again.",
      });
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
        <div className="mx-auto w-full max-w-3xl rounded-[2rem] border border-slate-200/80 bg-white shadow-2xl p-6 sm:p-8">
        <div className="space-y-6 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-rose-500">Create account</p>
          <h1 className="text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">Join the style club</h1>
          <p className="mx-auto max-w-2xl text-sm leading-6 text-slate-600">
            Register now to save favourites, track orders, and enjoy a faster checkout experience.
          </p>
        </div>

        <div className="mt-8 rounded-[1.5rem] border border-slate-200 bg-slate-50/95 p-7 shadow-lg shadow-slate-200/40">
          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="First name"
              type="text"
              placeholder="Your first name"
              value={form.firstName}
              error={errors.firstName}
              onChange={(e) => setForm({ ...form, firstName: e.target.value })}
            />
            <Input
              label="Last name"
              type="text"
              placeholder="Your last name"
              value={form.lastName}
              error={errors.lastName}
              onChange={(e) => setForm({ ...form, lastName: e.target.value })}
            />
            <Input
              label="Phone number"
              type="tel"
              placeholder="Enter your phone number"
              value={form.phone}
              error={errors.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
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
              placeholder="Choose a secure password"
              value={form.password}
              error={errors.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              description="Use at least 6 characters for a safer account"
            />
            <PasswordInput
              label="Confirm password"
              placeholder="Re-enter your password"
              value={form.confirmPassword}
              error={errors.confirmPassword}
              onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
              description="Must match your password"
            />

            <Button type="submit" disabled={loading} className="mt-1 bg-fuchsia-600 hover:bg-fuchsia-500">
              {loading ? "Creating account..." : "Create account"}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-600">
            Already a member? <Link to="/login" className="font-semibold text-fuchsia-600 hover:text-fuchsia-500">Sign in</Link>
          </p>
        </div>
      </div>
    </main>
        </>

  );
}
