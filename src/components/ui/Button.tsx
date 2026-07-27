import type { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "quiet";

const styles: Record<Variant, string> = {
  primary: "bg-emerald-600 text-white hover:bg-emerald-700",
  quiet: "border border-slate-200 bg-white text-slate-900 hover:bg-slate-50",
};

export function Button({
  variant = "primary",
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  return (
    <button
      className={`inline-flex items-center justify-center rounded-md px-4 py-2.5 text-sm font-medium transition disabled:pointer-events-none disabled:opacity-50 ${styles[variant]} ${className}`}
      {...props}
    />
  );
}
