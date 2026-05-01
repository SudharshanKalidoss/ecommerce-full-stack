import { useEffect, useState } from "react";
import { Header } from "../components/Header";
import { contactApi } from "../lib/contact-api";
import { SocialPlatformIcon } from "../components/ui/social-platform-icon";
import { AppImage } from "../components/ui/app-image";

export default function Contact() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [contact, setContact] = useState(null);

  useEffect(() => {
    const fetchContact = async () => {
      try {
        setLoading(true);
        setError("");
        const data = await contactApi.get();
        setContact(data || null);
      } catch (err) {
        setError(err.message || "Unable to load contact details.");
      } finally {
        setLoading(false);
      }
    };

    fetchContact();
  }, []);

  const profiles = Array.isArray(contact?.socialProfiles) ? contact.socialProfiles : [];

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
        <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-fuchsia-600">Get in touch</p>
                <h1 className="mt-2 text-3xl font-semibold text-slate-950 sm:text-4xl">Contact Information</h1>
                <p className="mt-2 text-sm text-slate-600">Reach out to us for support, orders and business inquiries.</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                {contact?.logo ? (
                  <AppImage src={contact.logo} alt="Brand logo" className="h-16 w-16 rounded-xl object-cover" />
                ) : (
                  <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-white text-sm font-semibold text-slate-500">
                    LOGO
                  </div>
                )}
              </div>
            </div>

            {loading ? (
              <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-8 text-center text-slate-600">
                Loading contact details...
              </div>
            ) : error ? (
              <div className="mt-8 rounded-2xl border border-rose-200 bg-rose-50 p-5 text-sm text-rose-700">{error}</div>
            ) : (
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Primary Contact</p>
                  <p className="mt-2 text-lg font-semibold text-slate-900">{contact?.primaryContact || "Not available"}</p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Primary Email</p>
                  {contact?.primaryEmail ? (
                    <a
                      href={`mailto:${contact.primaryEmail}`}
                      className="mt-2 inline-block text-lg font-semibold text-fuchsia-700 hover:text-fuchsia-600"
                    >
                      {contact.primaryEmail}
                    </a>
                  ) : (
                    <p className="mt-2 text-lg font-semibold text-slate-900">Not available</p>
                  )}
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 sm:col-span-2">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Address</p>
                  <p className="mt-2 whitespace-pre-line text-base text-slate-800">{contact?.address || "Address not available"}</p>
                </div>
              </div>
            )}

            {!loading && !error && (
              <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Social Profiles</p>
                {profiles.length > 0 ? (
                  <div className="mt-3 flex flex-wrap gap-3">
                    {profiles.map((item, index) => (
                      <a
                        key={`${item.platform}-${index}`}
                        href={item.url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-fuchsia-300 hover:text-fuchsia-700"
                      >
                        <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-fuchsia-100 text-[11px] uppercase text-fuchsia-700">
                          <SocialPlatformIcon platform={item.platform} />
                        </span>
                        {item.platform || "Profile"}
                      </a>
                    ))}
                  </div>
                ) : (
                  <p className="mt-2 text-sm text-slate-600">No social profiles added yet.</p>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
