'use client';

import { useEffect, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { SheetTile } from '@/components/SheetTile';
import { useSheetComboDialogStore } from '@/stores/sheetComboDialog';
import { useItemDrawer } from '@/hooks/useItemDrawer';
import { clamp } from '@/lib/utils/math';
import type { Sheet } from '@/types';

export function SheetComboDialog() {
  const t = useTranslations();
  const state = useSheetComboDialogStore();
  const pool = useMemo(() => state.currentSheets, [state.currentSheets]);
  const drawer = useItemDrawer<Sheet>({ drawingPool: pool, drawSize: state.drawSize, allowDuplicate: state.allowDuplicate });
  const { startDrawing } = drawer;
  useEffect(() => { if (state.isOpened && state.isDrawPool) void startDrawing(); }, [startDrawing, state.isOpened, state.isDrawPool]);
  const sheets = state.isDrawPool ? drawer.currentItems.filter((sheet): sheet is Sheet => sheet != null) : state.currentSheets;
  const displaySheets = state.isShowAll ? sheets : sheets.slice(0, 100);
  const updateDrawSize = () => { const value = window.prompt(t('sfc.SheetComboDialog.changeDrawSize'), String(state.drawSize)); if (value != null) state.setDrawSize(clamp(Number(value) || state.drawSize, 1, 100)); };
  return <Dialog open={state.isOpened} onOpenChange={(open) => { if (!open) { void drawer.stopDrawing(); state.close(); } }}><DialogContent className="w-[min(96vw,1600px)]"><DialogHeader><DialogTitle>{state.headerTitle ?? t('sfc.SheetComboDialog.drawResults')}</DialogTitle></DialogHeader><div className="flex flex-wrap items-center gap-4 text-sm"><label className="flex items-center gap-2"><Switch checked={state.allowDuplicate} onCheckedChange={state.setAllowDuplicate} />{t('sfc.SheetComboDialog.allowDuplicate')}</label><label className="flex items-center gap-2"><Switch checked={state.isBlindfoldMode} onCheckedChange={state.setBlindfoldMode} />{t('sfc.SheetComboDialog.blindfoldMode')}</label>{state.isDrawPool && <Button variant="outline" onClick={() => void drawer.startDrawing()}>{t('sfc.SheetDialog.tryAgain')}</Button>}<Button variant="outline" onClick={updateDrawSize}>{state.drawSize}</Button></div><div className="mt-5 flex flex-wrap justify-center gap-2">{displaySheets.map((sheet, index) => <div key={`${sheet.sheetExpr ?? sheet.songNo}-${index}`}>{state.isBlindfoldMode && !state.blindfoldedIndexes.has(index) ? <Button className="h-auto p-1" variant="outline" onClick={() => state.reveal(index)}><SheetTile sheet={{ ...sheet, imageUrl: '/v.png', imageUrlM: '/v.png' }} hideTitle /></Button> : <SheetTile sheet={sheet} />}</div>)}</div>{!state.isShowAll && sheets.length > 100 && <Button variant="link" onClick={() => useSheetComboDialogStore.setState({ isShowAll: true })}>{t('ui.showAll')}</Button>}<DialogFooter><Button onClick={() => { void drawer.stopDrawing(); state.close(); }}>{t('ui.close')}</Button></DialogFooter></DialogContent></Dialog>;
}
