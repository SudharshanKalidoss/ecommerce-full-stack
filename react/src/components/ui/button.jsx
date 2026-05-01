import { cn } from "../../lib/utils";

export function Button({ className, variant = "default", size = "default", ...props }) {
  const variants = {
    default:
      "inline-flex items-center justify-center rounded-2xl bg-fuchsia-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-fuchsia-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fuchsia-500",
    secondary:
      "inline-flex items-center justify-center rounded-2xl border border-fuchsia-200 bg-white px-4 py-3 text-sm font-semibold text-fuchsia-700 transition hover:border-fuchsia-300 hover:bg-fuchsia-50",
  };

  const sizes = {
    default: "w-full",
    sm: "w-full px-3 py-2 text-sm",
  };

  return (
    <button
      className={cn(variants[variant], sizes[size], className)}
      {...props}
    />
  );
}
