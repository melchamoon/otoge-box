import * as React from 'react';
import { cn } from '@/lib/cn';

export function Switch({ className, checked, onCheckedChange, ...props }: Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'type'> & { onCheckedChange?: (checked: boolean) => void }) {
  return <input type="checkbox" role="switch" checked={checked} onChange={(event) => onCheckedChange?.(event.target.checked)} className={cn('h-5 w-9 accent-[var(--theme-color)]', className)} {...props} />;
}
