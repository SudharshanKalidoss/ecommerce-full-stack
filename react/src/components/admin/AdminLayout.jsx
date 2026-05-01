import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "../ui/button";

export function AdminLayout({ user, onLogout, children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white">
        <div className="flex h-14 items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSidebarOpen(true)}
              className="h-9 w-9 p-0 md:hidden"
              aria-label="Open admin sidebar"
            >
              <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
                <path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </Button>
            <p className="text-sm font-semibold text-slate-900 sm:text-base">Admin Dashboard</p>
          </div>
          <div className="flex items-center gap-3">
            <p className="text-xs text-slate-600">{user?.email || "Admin"}</p>
          </div>
        </div>
      </header>

      <div className="flex min-h-[calc(100vh-3.5rem)]">
        {sidebarOpen && (
          <button
            type="button"
            className="fixed inset-0 z-20 bg-slate-900/40 md:hidden"
            aria-label="Close sidebar overlay"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <aside
          className={`fixed left-0 top-0 z-30 flex h-full w-64 flex-col border-r border-slate-200 bg-white p-4 transition-transform md:sticky md:top-14 md:h-[calc(100vh-3.5rem)] md:translate-x-0 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="mb-4 flex items-center justify-between md:hidden">
            <p className="text-sm font-semibold text-slate-900">Admin Menu</p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSidebarOpen(false)}
              className="h-8 w-8 p-0"
              aria-label="Close admin sidebar"
            >
              <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden="true">
                <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </Button>
          </div>

          <nav className="space-y-1">
            <Link
              to="/admin"
              onClick={() => setSidebarOpen(false)}
              className={`block w-full rounded-lg px-3 py-2 text-left text-sm ${
                location.pathname === "/admin"
                  ? "bg-fuchsia-50 font-semibold text-fuchsia-700"
                  : "font-medium text-slate-700 hover:bg-slate-50"
              }`}
            >
              Overview
            </Link>
            <Link
              to="/admin/products"
              onClick={() => setSidebarOpen(false)}
              className={`block w-full rounded-lg px-3 py-2 text-left text-sm ${
                location.pathname.startsWith("/admin/products")
                  ? "bg-fuchsia-50 font-semibold text-fuchsia-700"
                  : "font-medium text-slate-700 hover:bg-slate-50"
              }`}
            >
              Products
            </Link>
            <Link
              to="/admin/users"
              onClick={() => setSidebarOpen(false)}
              className={`block w-full rounded-lg px-3 py-2 text-left text-sm ${
                location.pathname.startsWith("/admin/users")
                  ? "bg-fuchsia-50 font-semibold text-fuchsia-700"
                  : "font-medium text-slate-700 hover:bg-slate-50"
              }`}
            >
              Users
            </Link>
            <Link
              to="/admin/contact"
              onClick={() => setSidebarOpen(false)}
              className={`block w-full rounded-lg px-3 py-2 text-left text-sm ${
                location.pathname.startsWith("/admin/contact")
                  ? "bg-fuchsia-50 font-semibold text-fuchsia-700"
                  : "font-medium text-slate-700 hover:bg-slate-50"
              }`}
            >
              Contact
            </Link>
          </nav>
          <div className="mt-auto border-t border-slate-200 pt-3">
            <Button
              variant="outline"
              onClick={onLogout}
              className="w-full justify-start"
            >
              Logout
            </Button>
          </div>
        </aside>

        <main className="w-full p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
