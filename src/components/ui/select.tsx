import * as React from 'react';
import { cn } from '@/lib/cn';

export const Select = ({ className, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) => <select className={cn('h-10 rounded-md border border-[var(--border)] bg-[var(--card)] px-3 text-sm', className)} {...props} />;
export const SelectTrigger = Select;
export const SelectContent = ({ children }: { children: React.ReactNode }) => <>{children}</>;
export const SelectItem = ({ value, children, ...props }: React.OptionHTMLAttributes<HTMLOptionElement> & { value: string }) => <option value={value} {...props}>{children}</option>;
