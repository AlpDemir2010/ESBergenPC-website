import type { ButtonHTMLAttributes, HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

/* ------------------------------------------------------------------ Card */

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-xl border border-slate-200 bg-white shadow-card",
        className,
      )}
      {...props}
    />
  );
}

export function CardHeader({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex flex-col gap-1.5 p-6", className)} {...props} />;
}

export function CardTitle({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn("text-lg font-semibold tracking-tight text-slate-900", className)}
      {...props}
    />
  );
}

export function CardContent({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("p-6 pt-0", className)} {...props} />;
}

/* ----------------------------------------------------------------- Badge */

export type BadgeVariant = "blue" | "yellow" | "neutral" | "outline";

const badgeStyles: Record<BadgeVariant, string> = {
  blue: "bg-brand-blue-100 text-brand-blue-800 ring-brand-blue-200",
  yellow:
    "bg-brand-yellow-300 text-brand-navy ring-brand-yellow-400/60",
  neutral: "bg-slate-100 text-slate-700 ring-slate-200",
  outline: "bg-white text-slate-600 ring-slate-200",
};

export function Badge({
  variant = "neutral",
  className,
  children,
}: {
  variant?: BadgeVariant;
  className?: string;
  children: ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset",
        badgeStyles[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}

/* ---------------------------------------------------------------- Button */

export type ButtonVariant =
  | "primary"
  | "accent"
  | "outline"
  | "ghost"
  | "danger"
  | "navy"
  | "onDark";
export type ButtonSize = "sm" | "md" | "lg";

export function buttonClass(
  variant: ButtonVariant = "primary",
  size: ButtonSize = "md",
  className?: string,
): string {
  const variants: Record<ButtonVariant, string> = {
    primary:
      "bg-brand-blue-600 text-white shadow-sm hover:bg-brand-blue-700 active:bg-brand-blue-800",
    accent:
      "bg-brand-yellow-400 text-brand-navy shadow-sm hover:bg-brand-yellow-300 active:bg-brand-yellow-500",
    outline:
      "bg-white text-slate-700 ring-1 ring-inset ring-slate-300 hover:bg-slate-50 active:bg-slate-100",
    ghost: "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
    danger:
      "bg-white text-red-600 ring-1 ring-inset ring-red-200 hover:bg-red-50",
    navy: "bg-brand-navy text-white shadow-sm hover:bg-brand-navy-deep",
    onDark:
      "bg-white/10 text-white ring-1 ring-inset ring-white/20 hover:bg-white/20",
  };

  const sizes: Record<ButtonSize, string> = {
    sm: "h-8 px-3 text-sm",
    md: "h-10 px-4 text-sm",
    lg: "h-12 px-6 text-base",
  };

  return cn(
    "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors",
    "disabled:pointer-events-none disabled:opacity-50",
    variants[variant],
    sizes[size],
    className,
  );
}

export function Button({
  variant = "primary",
  size = "md",
  className,
  type = "button",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
}) {
  return (
    <button
      type={type}
      className={buttonClass(variant, size, className)}
      {...props}
    />
  );
}

/* ------------------------------------------------------------ Field bits */

export function Label({
  className,
  children,
  htmlFor,
}: {
  className?: string;
  children: ReactNode;
  htmlFor?: string;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className={cn(
        "mb-1.5 block text-sm font-medium text-slate-700",
        className,
      )}
    >
      {children}
    </label>
  );
}

const fieldBase =
  "block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 " +
  "placeholder:text-slate-400 focus:border-brand-blue-500 focus:outline-none " +
  "focus:ring-2 focus:ring-brand-blue-500/20 disabled:cursor-not-allowed disabled:opacity-60";

export function Input({
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn(fieldBase, className)} {...props} />;
}

export function Textarea({
  className,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={cn(fieldBase, "min-h-24", className)} {...props} />;
}

export function Select({
  className,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return <select className={cn(fieldBase, "pr-8", className)} {...props} />;
}
