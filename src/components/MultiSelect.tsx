'use client';

import * as Popover from '@radix-ui/react-popover';
import { Command } from 'cmdk';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';

export type MultiSelectOption = { value: string; text: string };

export function MultiSelect({ options, value, onChange, placeholder }: { options: MultiSelectOption[]; value: string[]; onChange: (value: string[]) => void; placeholder: string }) {
  const [open, setOpen] = useState(false);
  const selected = new Set(value);
  const toggle = (option: MultiSelectOption) => onChange(selected.has(option.value) ? value.filter((entry) => entry !== option.value) : [...value, option.value]);
  const selectedLabels = options.filter((option) => selected.has(option.value));
  return <Popover.Root open={open} onOpenChange={setOpen}><Popover.Trigger asChild><button type="button" className="flex min-h-10 w-full flex-wrap items-center gap-1 rounded-md border border-[var(--border)] bg-[var(--card)] px-3 py-1.5 text-left text-sm"><span className="mr-auto flex flex-wrap gap-1">{selectedLabels.length === 0 ? <span className="opacity-60">{placeholder}</span> : selectedLabels.slice(0, 3).map((option) => <Badge key={option.value}>{option.text}</Badge>)}{selectedLabels.length > 3 && <Badge>+{selectedLabels.length - 3}</Badge>}</span><span aria-hidden="true" className="opacity-60">⌄</span></button></Popover.Trigger><Popover.Portal><Popover.Content align="start" sideOffset={4} className="z-50 w-[min(92vw,420px)] rounded-md border border-[var(--border)] bg-[var(--card)] p-1 text-[var(--foreground)] shadow-lg"><Command><Command.Input autoFocus placeholder={placeholder} className="h-9 w-full border-b border-[var(--border)] bg-transparent px-2 text-sm outline-none" /><Command.List className="max-h-64 overflow-y-auto py-1"><Command.Empty className="px-2 py-3 text-sm opacity-60">No matches</Command.Empty>{options.map((option) => <Command.Item key={option.value} value={`${option.value} ${option.text}`} onSelect={() => toggle(option)} className="flex cursor-pointer items-center gap-2 rounded px-2 py-1.5 text-sm aria-selected:bg-black/10 dark:aria-selected:bg-white/10"><span className="grid h-4 w-4 place-items-center rounded border border-current text-xs">{selected.has(option.value) ? '✓' : ''}</span>{option.text}</Command.Item>)}</Command.List></Command></Popover.Content></Popover.Portal></Popover.Root>;
}
