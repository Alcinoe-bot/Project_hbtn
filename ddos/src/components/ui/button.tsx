import type { ButtonHTMLAttributes } from "react";
import clsx from "clsx";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "ghost";
};

export function Button({ className, variant = "primary", ...props }: Props) {
  const base =
    "inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition";
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    ghost: "bg-transparent text-blue-700 hover:bg-blue-50",
  };
  return <button className={clsx(base, variants[variant], className)} {...props} />;
}
