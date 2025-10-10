import type { ButtonHTMLAttributes, AnchorHTMLAttributes } from "react";
import clsx from "clsx";

type Common = {
  variant?: "primary" | "ghost";
  className?: string;
};

type ButtonAsButton = Common &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    as?: "button";
  };

type ButtonAsAnchor = Common &
  AnchorHTMLAttributes<HTMLAnchorElement> & {
    as: "a";
  };

type Props = ButtonAsButton | ButtonAsAnchor;

export function Button({ className, variant = "primary", as = "button", ...props }: Props) {
  const base =
    "inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition";
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    ghost: "bg-transparent text-blue-700 hover:bg-blue-50",
  };

  if (as === "a") {
    const anchorProps = props as AnchorHTMLAttributes<HTMLAnchorElement>;
    return <a className={clsx(base, variants[variant], className)} {...anchorProps} />;
  }

  const buttonProps = props as ButtonHTMLAttributes<HTMLButtonElement>;
  return <button className={clsx(base, variants[variant], className)} {...buttonProps} />;
}
