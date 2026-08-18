import * as React from 'react';
import { cn } from '@/lib/cn';

export function Checkbox({ className, checked, onCheckedChange, ...props }: Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'type'> & { onCheckedChange?: (checked: boolean) => void }) {
  return <input type="checkbox" checked={checked} onChange={(event) => onCheckedChange?.(event.target.checked)} className={cn('h-4 w-4 accent-[var(--theme-color)]', className)} {...props} />;
}
