import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cn } from '@/lib/cn';

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'default' | 'outline' | 'ghost' | 'destructive' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  asChild?: boolean;
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', type = 'button', asChild = false, ...props }, ref) => {
    const classes = cn(
      'inline-flex items-center justify-center gap-2 rounded-md border px-4 py-2 text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50',
      variant === 'default' && 'border-transparent bg-[var(--theme-color)] text-white hover:opacity-90',
      variant === 'outline' && 'border-[var(--border)] bg-transparent hover:bg-black/5 dark:hover:bg-white/10',
      variant === 'ghost' && 'border-transparent bg-transparent hover:bg-black/5 dark:hover:bg-white/10',
      variant === 'destructive' && 'border-transparent bg-red-600 text-white hover:bg-red-700',
      variant === 'link' && 'border-transparent bg-transparent p-0 text-blue-600 underline-offset-4 hover:underline',
      size === 'sm' && 'h-8 px-3 text-xs',
      size === 'lg' && 'h-11 px-6',
      size === 'icon' && 'h-9 w-9 p-0',
      className,
    );
    if (asChild) return <Slot ref={ref} className={classes} {...props} />;
    return <button
      ref={ref}
      type={type}
      className={classes}
      {...props}
    />;
  },
);
Button.displayName = 'Button';
