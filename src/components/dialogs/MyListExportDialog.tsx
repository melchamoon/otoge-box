'use client';

import { useMemo } from 'react';
import { useTranslations } from 'next-intl';
import YAML from 'yaml';
import { saveAs } from 'file-saver';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useSelectedSheets } from '@/hooks/useSelectedSheets';
import { useGameContext } from '@/contexts/GameContext';

export function MyListExportDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) { const t = useTranslations(); const { gameCode } = useGameContext(); const { selectedSheets } = useSelectedSheets(); const content = useMemo(() => YAML.stringify(selectedSheets.map((sheet) => sheet.sheetExpr)), [selectedSheets]); return <Dialog open={open} onOpenChange={onOpenChange}><DialogContent><DialogHeader><DialogTitle>{t('sfc.ModeSelector.exportMyList')}</DialogTitle></DialogHeader><Textarea readOnly value={content} className="min-h-64 font-mono" /><DialogFooter><Button variant="outline" onClick={() => onOpenChange(false)}>{t('ui.close')}</Button><Button onClick={() => saveAs(new Blob([content], { type: 'text/yaml;charset=utf-8' }), `${gameCode}-mylist-${new Date().toISOString().slice(0, 10).replaceAll('-', '')}.yaml`)}>{t('ui.download')}</Button></DialogFooter></DialogContent></Dialog>; }
