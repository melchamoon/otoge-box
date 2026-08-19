import * as React from "react";
import { cn } from "@/lib/cn";

export const Select = ({
  className,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement>) => (
  <select
    className={cn(
      "h-10 rounded-md border border-[var(--border)] bg-[var(--card)] px-3 text-sm",
      className,
    )}
    {...props}
  />
);
