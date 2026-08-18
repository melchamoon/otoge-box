import * as React from 'react';

export function RadioGroup({ value, onValueChange, children, className }: { value?: string; onValueChange?: (value: string) => void; children: React.ReactNode; className?: string }) {
  return <div className={className} data-value={value} role="radiogroup" onChange={(event) => { const target = event.target as HTMLInputElement; if (target.value) onValueChange?.(target.value); }}>{children}</div>;
}

export function RadioGroupItem({ value, id }: { value: string; id?: string }) { return <input type="radio" id={id} value={value} className="accent-[var(--theme-color)]" />; }
