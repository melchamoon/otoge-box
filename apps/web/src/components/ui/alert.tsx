import * as React from "react";
import { cn } from "@/lib/cn";

export function Alert({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      role="alert"
      className={cn(
        "rounded-md border border-[var(--border)] bg-[var(--card)] p-3 text-sm",
        className,
      )}
      {...props}
    />
  );
}
