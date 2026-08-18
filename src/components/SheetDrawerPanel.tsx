'use client';

import confetti from 'canvas-confetti';
import { useEffect, useMemo, useState } from 'react';
import { useTheme } from 'next-themes';
import { useTranslations } from 'next-intl';
import { useSheetBrowserContext } from '@/contexts/SheetBrowserContext';
import { useSheetDialogStore } from '@/stores/sheetDialog';
import { useSheetComboDialogStore } from '@/stores/sheetComboDialog';
import { useItemDrawer } from '@/hooks/useItemDrawer';
import { INDI_SHEET } from '@/lib/utils/sheet';
import { pickItem } from '@/lib/utils/random';
import { sleep } from '@/lib/utils/misc';
import { Button } from '@/components/ui/button';
import type { Sheet } from '@/types';

type DrawMode = 'light' | 'single' | 'combo';

const lightPatterns = [
  [false, true, false, true, false],
  [true, false, false, false, true],
  [true, false, true, false, true],
];

export function SheetDrawerPanel() {
  const t = useTranslations();
  const { resolvedTheme, setTheme } = useTheme();
  const { displayingSheets } = useSheetBrowserContext();
  const openSheet = useSheetDialogStore((state) => state.open);
  const openCombo = useSheetComboDialogStore((state) => state.open);
  const pool = useMemo(() => displayingSheets, [displayingSheets]);
  const [mode, setMode] = useState<DrawMode>('single');
  const [lights, setLights] = useState<boolean[]>(() => resolvedTheme === 'dark' ? [false, false, false, false, false] : pickItem(lightPatterns));
  const singleDrawer = useItemDrawer<Sheet>({ drawingPool: pool, drawSize: 1 });

  useEffect(() => {
    setLights(resolvedTheme === 'dark' ? [false, false, false, false, false] : pickItem(lightPatterns));
  }, [resolvedTheme]);

  const drawSingle = async () => {
    if (!pool.length) {
      window.alert(t('description.drawPoolEmpty'));
      return;
    }
    await singleDrawer.startDrawing((items) => {
      const sheet = items[0];
      if (sheet) openSheet(sheet, true);
    });
  };

  const draw = () => {
    if (mode === 'light') return;
    if (mode === 'single') {
      void drawSingle();
      return;
    }
    if (!pool.length) {
      window.alert(t('description.drawPoolEmpty'));
      return;
    }
    openCombo(pool, { isDrawPool: true, headerTitle: t('sfc.SheetComboDialog.drawResults') });
  };

  const toggleLights = async (index: number) => {
    const next = lights.map((light, lightIndex) => (Math.abs(lightIndex - index) <= 1 ? !light : light));
    setLights(next);
    if (next.some(Boolean)) return;
    setTheme('dark');
    await sleep(1000);
    openSheet(INDI_SHEET);
    confetti({ particleCount: 100, spread: 60, origin: { y: 0.6 }, zIndex: 999 });
  };

  return <div className="my-4 flex flex-wrap items-center justify-center gap-2 rounded border border-[var(--border)] bg-[var(--card)] p-3">
    <div className="flex gap-1">
      {(['light', 'single', 'combo'] as const).map((entry) => <Button key={entry} variant={mode === entry ? 'default' : 'outline'} size="sm" onClick={() => setMode(entry)}>{entry === 'light' ? '💡' : entry === 'single' ? t('sfc.SheetDrawerPanel.drawRandomSheet') : t('sfc.SheetDrawerPanel.drawRandomSheetCombo')}</Button>)}
    </div>
    {mode === 'light' ? <div className="flex flex-wrap justify-center gap-1" role="group" aria-label="Light switch">
      {lights.map((light, index) => <Button key={index} variant="outline" className={light ? 'border-orange-400 bg-orange-400 text-white' : 'bg-black text-white'} onClick={() => void toggleLights(index)}>{light ? '💡' : '🕯'}</Button>)}
    </div> : <Button onClick={draw} disabled={singleDrawer.isDrawing}>{singleDrawer.isDrawing ? 'Drawing…' : mode === 'combo' ? t('sfc.SheetDrawerPanel.drawRandomSheetCombo') : t('sfc.SheetDrawerPanel.drawRandomSheet')}</Button>}
  </div>;
}
