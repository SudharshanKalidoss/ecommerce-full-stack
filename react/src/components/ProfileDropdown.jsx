import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export function ProfileDropdown() {
  const { isLoggedIn, user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const fullName = `${user?.firstName || ""} ${user?.lastName || ""}`.trim();
  const displayName = fullName || user?.name?.trim() || "User";
  const displayEmail = user?.email?.trim() || "Signed in account";

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:bg-slate-50"
        aria-label="Profile"
      >
        <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
          <path
            d="M12 12a4 4 0 100-8 4 4 0 000 8z"
            stroke="currentColor"
            strokeWidth="1.8"
          />
          <path
            d="M4 20c0-4.418 3.582-8 8-8s8 3.582 8 8"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute left-0 top-full z-50 mt-2 w-56 max-w-[calc(100vw-1rem)] rounded-xl border border-slate-200 bg-white shadow-lg sm:left-auto sm:right-0 sm:w-64">
          <span
            className="absolute -top-2 left-4 h-3 w-3 rotate-45 border-l border-t border-slate-200 bg-white sm:left-auto sm:right-4"
            aria-hidden="true"
          />
          {isLoggedIn ? (
            <>
              <div className="border-b border-slate-200 px-3 py-2.5 sm:px-4 sm:py-3">
                <p className="truncate text-sm font-semibold text-slate-950">{displayName}</p>
                <p className="truncate text-[11px] text-slate-500 sm:text-xs">{displayEmail}</p>
              </div>
              <div className="space-y-1 p-1.5 sm:p-2">
                <Link
                  to="/profile"
                  onClick={() => setIsOpen(false)}
                  className="block rounded-lg px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 sm:px-4 sm:py-2"
                >
                  My Profile
                </Link>
                <Link
                  to="/orders"
                  onClick={() => setIsOpen(false)}
                  className="block rounded-lg px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 sm:px-4 sm:py-2"
                >
                  My Orders
                </Link>
                <Link
                  to="/settings"
                  onClick={() => setIsOpen(false)}
                  className="block rounded-lg px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 sm:px-4 sm:py-2"
                >
                  Settings
                </Link>
              </div>
              <div className="border-t border-slate-200 p-1.5 sm:p-2">
                <button
                  onClick={handleLogout}
                  className="w-full rounded-lg px-3 py-1.5 text-sm font-semibold text-rose-600 transition hover:bg-rose-50 sm:px-4 sm:py-2"
                >
                  Logout
                </button>
              </div>
            </>
          ) : (
            <div className="p-3">
              <p className="mb-3 text-sm text-slate-600">Sign in to your account to continue</p>
              <Link
                to="/login"
                onClick={() => setIsOpen(false)}
                className="block w-full rounded-lg bg-fuchsia-600 px-4 py-2 text-center text-sm font-semibold text-white transition hover:bg-fuchsia-500"
              >
                Sign In
              </Link>
              <p className="mt-3 text-center text-xs text-slate-500">
                Don't have an account?{" "}
                <Link
                  to="/register"
                  onClick={() => setIsOpen(false)}
                  className="font-semibold text-fuchsia-600 hover:text-fuchsia-500"
                >
                  Register
                </Link>
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
