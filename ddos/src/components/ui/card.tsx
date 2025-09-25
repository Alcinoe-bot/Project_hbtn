import { PropsWithChildren } from "react";
import clsx from "clsx";

export function Card({ children, className }: PropsWithChildren<{ className?: string }>) {
  return <div className={clsx("rounded-lg border bg-white shadow-sm", className)}>{children}</div>;
}

export function CardHeader({ children, className }: PropsWithChildren<{ className?: string }>) {
  return <div className={clsx("border-b px-5 py-4", className)}>{children}</div>;
}

export function CardTitle({ children, className }: PropsWithChildren<{ className?: string }>) {
  return <h2 className={clsx("text-xl font-semibold", className)}>{children}</h2>;
}

export function CardContent({ children, className }: PropsWithChildren<{ className?: string }>) {
  return <div className={clsx("px-5 py-4", className)}>{children}</div>;
}
