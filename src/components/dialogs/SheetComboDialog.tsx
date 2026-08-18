'use client';

import { useEffect, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { SheetTile } from '@/components/SheetTile';
import { useSheetComboAllowDuplicateStore, useSheetComboDialogStore, useSheetComboDrawSizeStore } from '@/stores/sheetComboDialog';
import { useSheetDialogStore } from '@/stores/sheetDialog';
import { useItemDrawer } from '@/hooks/useItemDrawer';
import { clamp } from '@/lib/utils/math';
import { NULL_SHEET, VOID_SHEET } from '@/lib/utils/sheet';
import type { Sheet } from '@/types';

export function SheetComboDialog() {
  const t = useTranslations();
  const state = useSheetComboDialogStore();
  const drawSize = useSheetComboDrawSizeStore((store) => store.value);
  const setDrawSize = useSheetComboDrawSizeStore((store) => store.setValue);
  const allowDuplicate = useSheetComboAllowDuplicateStore((store) => store.value);
  const setAllowDuplicate = useSheetComboAllowDuplicateStore((store) => store.setValue);
  const pool = useMemo(() => state.currentSheets, [state.currentSheets]);
  const openSheet = useSheetDialogStore((store) => store.open);
  const drawer = useItemDrawer<Sheet>({ drawingPool: pool, drawSize, allowDuplicate });
  const singleDrawer = useItemDrawer<Sheet>({ drawingPool: pool, drawSize: 1 });
  const { startDrawing } = drawer;
  useEffect(() => { if (state.isOpened && state.isDrawMode) void startDrawing(); }, [startDrawing, state.isOpened, state.isDrawMode]);
  const sheets = state.isDrawMode ? drawer.currentItems.map((sheet) => sheet ?? NULL_SHEET) : state.currentSheets;
  const displaySheets = state.isShowAll ? sheets : sheets.slice(0, 100);
  const maxDialogWidth = displaySheets.length <= 4 ? 400 : displaySheets.length <= 9 ? 550 : displaySheets.length <= 16 ? 700 : displaySheets.length <= 25 ? 850 : displaySheets.length <= 36 ? 1000 : displaySheets.length <= 49 ? 1150 : displaySheets.length <= 64 ? 1300 : displaySheets.length <= 81 ? 1450 : 1600;
  const updateDrawSize = () => { const value = window.prompt(t('sfc.SheetComboDialog.changeDrawSize'), String(drawSize)); if (value != null) setDrawSize(clamp(Number(value) || drawSize, 1, 100)); };
  const drawOneFromPool = async () => { if (!pool.length) { window.alert(t('description.drawPoolEmpty')); return; } await singleDrawer.startDrawing((items) => { if (items[0]) openSheet(items[0], true); }); };
  return <Dialog open={state.isOpened} onOpenChange={(open) => { if (!open) { void drawer.stopDrawing(); void singleDrawer.stopDrawing(); state.close(); } }}><DialogContent className="max-w-[96vw]" style={{ width: `min(${maxDialogWidth}px, 96vw)` }}><DialogHeader><DialogTitle>{state.isDrawMode ? t('sfc.SheetComboDialog.drawResults') : <>{state.headerTitle ?? t('sfc.SheetComboDialog.drawResults')} ({t('sfc.FilterInfoBar.sheetsCount', { n: state.currentSheets.length })})</>}</DialogTitle></DialogHeader>{state.isDrawMode && <div className="flex flex-wrap items-center gap-4 text-sm"><label className="flex items-center gap-2"><Switch checked={allowDuplicate} onCheckedChange={setAllowDuplicate} />{t('sfc.SheetComboDialog.allowDuplicate')}</label><label className="flex items-center gap-2"><Switch checked={state.isBlindfoldMode} onCheckedChange={state.setBlindfoldMode} />{t('sfc.SheetComboDialog.blindfoldMode')}</label><Button variant="outline" onClick={updateDrawSize}>{drawSize}</Button></div>}<div className="mt-5 flex flex-wrap justify-center gap-2" onContextMenu={(event) => event.preventDefault()}>{displaySheets.map((sheet, index) => <div key={`${sheet.sheetExpr ?? sheet.songNo}-${index}`}>{state.isBlindfoldMode && !state.blindfoldedIndexes.has(index) ? <SheetTile sheet={VOID_SHEET} hideTitle onClick={() => state.reveal(index)} /> : <SheetTile sheet={sheet} />}</div>)}</div>{!state.isShowAll && sheets.length > 100 && <Button variant="link" onClick={() => useSheetComboDialogStore.setState({ isShowAll: true })}>{t('ui.showAll')}</Button>}<DialogFooter>{state.isDrawPool && !state.isDrawMode && <Button variant="outline" onClick={() => void drawOneFromPool()} disabled={singleDrawer.isDrawing}>{t('sfc.SheetDrawerPanel.drawRandomSheet')}</Button>}{state.isDrawMode && <Button variant="outline" onClick={() => void drawer.startDrawing()}>{t('sfc.SheetDialog.tryAgain')}</Button>}<Button onClick={() => { void drawer.stopDrawing(); void singleDrawer.stopDrawing(); state.close(); }}>{state.isDrawMode ? t('ui.ok') : t('ui.close')}</Button></DialogFooter></DialogContent></Dialog>;
}
