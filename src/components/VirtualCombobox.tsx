'use client';

import { useVirtualizer } from '@tanstack/react-virtual';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

export function VirtualCombobox({ items, value, onChange, multiple = false, placeholder = 'Type at least 2 characters…' }: { items: string[]; value: string | string[] | null; onChange: (value: string | string[] | null) => void; multiple?: boolean; placeholder?: string }) {
  const [input, setInput] = useState(multiple ? '' : (value as string | null) ?? '');
  const [open, setOpen] = useState(false);
  const parentRef = useRef<HTMLDivElement>(null);
  const selected = multiple ? ((value as string[] | null) ?? []) : [];
  const filtered = useMemo(() => input.trim().length < 2 ? [] : items.filter((item) => item.toLowerCase().includes(input.trim().toLowerCase())).slice(0, 100), [input, items]);
  const virtualizer = useVirtualizer({ count: filtered.length, getScrollElement: () => parentRef.current, estimateSize: () => 32, overscan: 6 });
  useEffect(() => { if (!multiple) setInput((value as string | null) ?? ''); }, [multiple, value]);
  const choose = (item: string) => { if (multiple) { const next = selected.includes(item) ? selected.filter((entry) => entry !== item) : [...selected, item]; onChange(next); setInput(''); } else { onChange(item); setInput(item); setOpen(false); } };
  return <div className="relative min-w-0 flex-1"><Input value={input} placeholder={placeholder} onFocus={() => setOpen(true)} onChange={(event) => { setInput(event.target.value); if (!multiple) onChange(event.target.value || null); setOpen(true); }} onKeyDown={(event) => { if (event.key === 'Enter' && filtered[0]) { event.preventDefault(); choose(filtered[0]); } }} />{multiple && selected.length > 0 && <div className="mt-1 flex flex-wrap gap-1">{selected.map((item) => <Badge key={item} className="cursor-pointer" onClick={() => choose(item)}>{item} ×</Badge>)}</div>}{open && <div className="absolute inset-x-0 top-full z-30 mt-1 overflow-hidden rounded-md border border-[var(--border)] bg-[var(--card)] shadow-lg" onMouseDown={(event) => event.preventDefault()}><div ref={parentRef} className="max-h-64 overflow-auto p-1">{input.trim().length < 2 ? <p className="p-3 text-xs opacity-60">{placeholder}</p> : filtered.length === 0 ? <p className="p-3 text-xs opacity-60">No matches</p> : <div style={{ height: virtualizer.getTotalSize(), position: 'relative' }}>{virtualizer.getVirtualItems().map((item) => <button type="button" key={filtered[item.index]} className="absolute left-0 w-full rounded px-2 py-1.5 text-left text-sm hover:bg-black/10 dark:hover:bg-white/10" style={{ transform: `translateY(${item.start}px)` }} onClick={() => choose(filtered[item.index])}>{filtered[item.index]}</button>)}</div>}</div></div>}</div>;
}
