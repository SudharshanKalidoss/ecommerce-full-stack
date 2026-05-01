import { useEffect, useMemo, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { AdminLayout } from "../components/admin/AdminLayout";
import { adminContactApi } from "../lib/admin-contact-api";
import { Input } from "../components/ui/input";
import { SocialPlatformIcon } from "../components/ui/social-platform-icon";
import { useToast } from "../hooks/use-toast";

const isAdminUser = (user) => String(user?.role || "").toUpperCase() === "ADMIN";
const SOCIAL_PLATFORMS = ["facebook", "instagram", "twitter", "youtube", "linkedin"];

export default function AdminContact() {
  const { user, logout, authReady } = useAuth();
  const { toast } = useToast();
  const [initialLoading, setInitialLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    primaryContact: "",
    primaryEmail: "",
    address: "",
    socialProfiles: SOCIAL_PLATFORMS.map((platform) => ({ platform, url: "" })),
    logoUrl: "",
    logoFile: null,
  });
  const adminLoggedIn = isAdminUser(user);

  useEffect(() => {
    const loadContact = async () => {
      try {
        setInitialLoading(true);
        const data = await adminContactApi.get();
        const incomingProfiles = Array.isArray(data?.socialProfiles) ? data.socialProfiles : [];
        const profileMap = new Map(
          incomingProfiles.map((item) => [String(item?.platform || "").toLowerCase(), item?.url || ""])
        );
        const profiles = SOCIAL_PLATFORMS.map((platform) => ({
          platform,
          url: profileMap.get(platform) || "",
        }));

        setForm((prev) => ({
          ...prev,
          primaryContact: data?.primaryContact || "",
          primaryEmail: data?.primaryEmail || "",
          address: data?.address || "",
          socialProfiles: profiles,
          logoUrl: data?.logo || "",
          logoFile: null,
        }));
      } catch (error) {
        setForm((prev) => ({
          ...prev,
          primaryContact: "",
          primaryEmail: "",
          address: "",
          socialProfiles: SOCIAL_PLATFORMS.map((platform) => ({ platform, url: "" })),
          logoUrl: "",
          logoFile: null,
        }));
        toast({
          variant: "destructive",
          title: "Unable to load contact details",
          description: error.message || "Please try again.",
        });
      } finally {
        setInitialLoading(false);
      }
    };

    if (adminLoggedIn) loadContact();
  }, [adminLoggedIn, toast]);

  const logoPreview = useMemo(() => {
    if (form.logoFile) return URL.createObjectURL(form.logoFile);
    return form.logoUrl || "";
  }, [form.logoFile, form.logoUrl]);

  const setField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const updateSocial = (index, field, value) => {
    setForm((prev) => ({
      ...prev,
      socialProfiles: prev.socialProfiles.map((entry, i) =>
        i === index ? { ...entry, [field]: value } : entry
      ),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const cleanProfiles = form.socialProfiles
        .map((item) => ({
          platform: String(item.platform || "").trim(),
          url: String(item.url || "").trim(),
        }))
        .filter((item) => item.platform && item.url);

      await adminContactApi.update({
        primaryContact: form.primaryContact.trim(),
        primaryEmail: form.primaryEmail.trim(),
        address: form.address.trim(),
        socialProfiles: cleanProfiles,
        logoFile: form.logoFile,
      });

      toast({
        variant: "success",
        title: "Contact details saved",
        description: "Admin contact information has been updated.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Save failed",
        description: error.message || "Unable to update contact details.",
      });
    } finally {
      setSaving(false);
    }
  };

  if (!authReady) {
    return (
      <AdminLayout user={user} onLogout={logout}>
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-600 shadow-sm">
          Loading contact settings...
        </div>
      </AdminLayout>
    );
  }

  if (!adminLoggedIn) {
    return <Navigate to="/admin" replace />;
  }

  return (
    <AdminLayout user={user} onLogout={logout}>
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
        <h1 className="text-xl font-semibold text-slate-950 sm:text-2xl">Contact Details</h1>
        <p className="mt-1 text-sm text-slate-600">Manage business contact information shown to users.</p>

        {initialLoading ? (
          <p className="mt-6 text-sm text-slate-500">Loading contact form...</p>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label="Primary Contact"
                value={form.primaryContact}
                onChange={(e) => setField("primaryContact", e.target.value)}
                placeholder="e.g. +91 90000 00000"
              />
              <Input
                label="Primary Email"
                type="email"
                value={form.primaryEmail}
                onChange={(e) => setField("primaryEmail", e.target.value)}
                placeholder="e.g. support@example.com"
              />
            </div>

            <div className="grid gap-2 text-left">
              <label className="text-sm font-medium text-slate-900">Address</label>
              <textarea
                value={form.address}
                onChange={(e) => setField("address", e.target.value)}
                className="min-h-24 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 shadow-sm transition focus:border-fuchsia-500 focus:outline-none focus:ring-2 focus:ring-fuchsia-100"
                placeholder="Enter address"
              />
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm font-semibold text-slate-900">Social Profiles</p>
              <p className="mt-1 text-xs text-slate-500">Predefined social platforms. Add URL only where needed.</p>
              <div className="mt-3 space-y-3">
                {form.socialProfiles.map((profile, index) => (
                  <div key={`${index}-${profile.platform}`} className="grid gap-2 sm:grid-cols-[180px_1fr]">
                    <div className="flex h-12 items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 text-sm font-semibold capitalize text-slate-800">
                      <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-fuchsia-100 text-fuchsia-700">
                        <SocialPlatformIcon platform={profile.platform} />
                      </span>
                      {profile.platform}
                    </div>
                    <Input
                      placeholder="https://..."
                      value={profile.url}
                      onChange={(e) => updateSocial(index, "url", e.target.value)}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-2 text-left">
              <label className="text-sm font-medium text-slate-900">Logo</label>
              <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:flex-row sm:items-center">
                {logoPreview ? (
                  <img
                    src={logoPreview}
                    alt="Contact logo preview"
                    className="h-16 w-16 rounded-xl border border-slate-200 object-cover"
                  />
                ) : (
                  <div className="flex h-16 w-16 items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white text-xs text-slate-500">
                    No logo
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setField("logoFile", e.target.files?.[0] || null)}
                  className="block w-full text-sm text-slate-700 file:mr-3 file:rounded-lg file:border-0 file:bg-fuchsia-600 file:px-3 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-fuchsia-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="inline-flex rounded-xl bg-fuchsia-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-fuchsia-500 disabled:opacity-60"
            >
              {saving ? "Saving..." : "Save Contact Details"}
            </button>
          </form>
        )}
      </div>
    </AdminLayout>
  );
}
