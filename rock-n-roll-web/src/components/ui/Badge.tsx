import React from "react";
import { cn } from "@/lib/utils";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "outline" | "success" | "warning" | "danger" | "accent";
  size?: "sm" | "md";
}

export function Badge({
  children,
  className,
  variant = "default",
  size = "sm",
  ...props
}: BadgeProps) {
  const base =
    "inline-flex items-center font-mono font-medium rounded transition-colors";
  
  const sizes = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-2.5 py-1 text-xs",
  };

  const variants = {
    default:
      "bg-zinc-800/80 text-zinc-300 border border-zinc-700/60 dark:bg-zinc-800/80 dark:text-zinc-300 dark:border-zinc-700/60",
    outline:
      "bg-transparent text-zinc-400 border border-zinc-700/80 hover:text-zinc-200",
    success:
      "bg-emerald-950/40 text-emerald-400 border border-emerald-800/50",
    warning:
      "bg-amber-950/40 text-amber-400 border border-amber-800/50",
    danger:
      "bg-rose-950/40 text-rose-400 border border-rose-800/50",
    accent:
      "bg-indigo-950/40 text-indigo-300 border border-indigo-700/50",
  };

  return (
    <span
      className={cn(base, sizes[size], variants[variant], className)}
      {...props}
    >
      {children}
    </span>
  );
}
