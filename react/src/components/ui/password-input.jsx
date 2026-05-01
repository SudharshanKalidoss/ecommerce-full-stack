import { useState } from "react";
import { cn } from "../../lib/utils";

export function PasswordInput({ label, error, description, className, ...props }) {
  const [visible, setVisible] = useState(false);
  return (
    <div className={cn("grid gap-2 text-left", className)}>
      {label && (
        <label className="text-sm font-medium text-slate-900">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          type={visible ? "text" : "password"}
          className={cn(
            "h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 pr-28 text-sm text-slate-900 shadow-sm transition focus:border-rose-500 focus:outline-none focus:ring-2 focus:ring-rose-100",
            error && "border-rose-500 focus:border-rose-500 focus:ring-rose-100",
            "disabled:cursor-not-allowed disabled:opacity-50",
          )}
          {...props}
        />
        <button
          type="button"
          onClick={() => setVisible((value) => !value)}
          className="absolute inset-y-0 right-2 inline-flex items-center rounded-full px-3 text-xs font-semibold text-slate-600 transition hover:text-slate-900"
        >
          {visible ? "Hide" : "Show"}
        </button>
      </div>
      {description && <p className="text-xs text-slate-500">{description}</p>}
      {error && <p className="text-sm text-rose-600">{error}</p>}
    </div>
  );
}
