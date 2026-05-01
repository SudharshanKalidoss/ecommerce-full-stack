import { cn } from "../../lib/utils";

export function Input({ label, error, description, className, ...props }) {
  return (
    <div className={cn("grid gap-2 text-left", className)}>
      {label && (
        <label className="text-sm font-medium text-slate-900">
          {label}
        </label>
      )}
      <input
        className={cn(
          "h-12 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 shadow-sm transition focus:border-rose-500 focus:outline-none focus:ring-2 focus:ring-rose-100",
          error && "border-rose-500 focus:border-rose-500 focus:ring-rose-100",
          "disabled:cursor-not-allowed disabled:opacity-50",
        )}
        {...props}
      />
      {description && <p className="text-xs text-slate-500">{description}</p>}
      {error && <p className="text-sm text-rose-600">{error}</p>}
    </div>
  );
}
