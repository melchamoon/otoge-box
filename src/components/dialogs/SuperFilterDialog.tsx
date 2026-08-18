'use client';

import { useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { parseSuperFilter } from '@/lib/utils/filter';

export function SuperFilterDialog({ open, onOpenChange, value, onCommit }: { open: boolean; onOpenChange: (open: boolean) => void; value: string; onCommit: (value: string) => void }) {
  const t = useTranslations();
  const [draft, setDraft] = useState(value);
  const error = useMemo(() => { if (!draft) return ''; try { const result = parseSuperFilter(draft); return typeof result === 'function' ? '' : 'You should return a predicate function.'; } catch (err) { return String(err); } }, [draft]);
  return <Dialog open={open} onOpenChange={onOpenChange}><DialogContent><DialogHeader><DialogTitle>{t('term.superFilter')}</DialogTitle><DialogDescription>{t('description.superFilterHint')}</DialogDescription></DialogHeader><Textarea value={draft} onChange={(event) => setDraft(event.target.value)} placeholder={t('description.superFilterPlaceholder')} className="font-mono" />{error && <p className="mt-2 text-sm text-red-600">{error}</p>}<DialogFooter><Button variant="outline" onClick={() => onOpenChange(false)}>{t('ui.cancel')}</Button><Button disabled={Boolean(error)} onClick={() => { onCommit(draft); onOpenChange(false); }}>{t('ui.ok')}</Button></DialogFooter></DialogContent></Dialog>;
}
