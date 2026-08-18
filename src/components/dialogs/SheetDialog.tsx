'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { mdiBookmark, mdiBookmarkCheck, mdiCircleOffOutline, mdiContentCopy, mdiDomainOff, mdiEarthBoxOff, mdiEarthOff, mdiLock, mdiOpenInNew, mdiSignalOff } from '@mdi/js';
import copyToClipboard from 'copy-to-clipboard';
import catImage from '@/assets/images/cat.png';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Icon } from '@/components/Icon';
import { useSheetDialogStore } from '@/stores/sheetDialog';
import { useSelectedSheets } from '@/hooks/useSelectedSheets';
import { useGameLookups } from '@/hooks/useGameLookups';
import { getCanonicalSheet } from '@/lib/utils/sheet';
import { cn } from '@/lib/cn';

const regionIconPaths: Record<string, string> = {
  jp: mdiCircleOffOutline,
  intl: mdiEarthOff,
  usa: mdiDomainOff,
  cn: mdiEarthBoxOff,
  offline: mdiSignalOff,
};

export function SheetDialog() {
  const t = useTranslations();
  const { isOpened, currentSheet, isDrawMode, close } = useSheetDialogStore();
  const open = useSheetDialogStore((state) => state.open);
  const { selectedSheetSet, toggleSheetSelection } = useSelectedSheets();
  const lookup = useGameLookups();
  const [failedImage, setFailedImage] = useState<string | null>(null);

  useEffect(() => {
    setFailedImage(null);
  }, [currentSheet]);

  if (!currentSheet) return null;
  const canonicalSheet = getCanonicalSheet(currentSheet);
  const imageError = failedImage === currentSheet.imageUrl;
  const imageSrc = imageError ? catImage.src : (currentSheet.imageUrl ?? catImage.src);
  const searchUrl = lookup.getSheetSearchLink(currentSheet);
  const difficultyIcon = lookup.getDifficultyIconUrl(currentSheet.difficulty);
  const typeIcon = lookup.getTypeIconUrl(currentSheet.type);

  const copyTitle = () => {
    if (currentSheet.title == null) return;
    copyToClipboard(currentSheet.title);
    window.alert(t('description.copied'));
  };

  return <Dialog open={isOpened} onOpenChange={(value) => { if (!value) close(); }}><DialogContent className="w-[min(96vw,760px)]"><DialogHeader><DialogTitle>{currentSheet.title}</DialogTitle></DialogHeader><div className={cn('relative mx-auto w-full max-w-[500px] overflow-hidden rounded bg-gray-300 p-3 dark:bg-gray-700', currentSheet.isSpecial && 'rainbow-background')}><img src={imageSrc} alt={currentSheet.title ?? ''} className="mx-auto max-h-[52vh] w-full object-contain" onError={() => setFailedImage(currentSheet.imageUrl ?? null)} /><div className="absolute right-3 top-3"><Button variant="outline" size="icon" className="bg-white/80 dark:bg-black/50" onClick={() => toggleSheetSelection(canonicalSheet)} aria-label="Toggle My List"><Icon path={selectedSheetSet.has(canonicalSheet) ? mdiBookmarkCheck : mdiBookmark} /></Button></div>{typeIcon && <img src={typeIcon} alt="" className="absolute bottom-4 left-4" />}</div><div className="grid gap-5 pt-2 md:grid-cols-[1fr_auto] md:items-start"><div className="min-w-0"><button type="button" className="block max-w-full truncate text-left text-sm opacity-75" onClick={copyTitle}>{(currentSheet.category ?? 'N/A').replaceAll('|', '｜')}</button><button type="button" className="block max-w-full truncate py-2 text-left text-2xl font-semibold" onClick={copyTitle} title={currentSheet.title ?? undefined}>{currentSheet.title}</button><p className="truncate pb-2 font-medium">{currentSheet.artist ?? 'N/A'}</p><p className="flex items-center gap-1 py-2 text-xl font-semibold" style={{ color: lookup.getDifficultyColor(currentSheet.difficulty) }}>{difficultyIcon && <img src={difficultyIcon} height={lookup.getDifficultyIconHeight(currentSheet.difficulty)} alt="" />}{lookup.getDifficultyName(currentSheet.difficulty)} {currentSheet.level}{currentSheet.internalLevel != null && <small className="text-sm opacity-70">({currentSheet.internalLevel})</small>}</p><p className="pt-2 text-sm"><strong>{t('term.noteDesigner')}:</strong> {currentSheet.noteDesigner ?? 'N/A'}</p><p className="pt-2 text-sm"><strong>{t('term.releaseDate')}:</strong> {currentSheet.releaseDate ?? '????-??-??'} ({currentSheet.version ?? 'N/A'})</p><p className="pt-2 text-sm"><strong>{t('term.comment')}:</strong> {currentSheet.comment ?? 'N/A'}</p></div><div className="flex flex-row items-start gap-2 md:flex-col md:items-end"><strong>{t('term.bpm')} {currentSheet.bpm ?? '?'}</strong>{currentSheet.isLocked && <span title={t('description.unlockNeeded')}><Icon path={mdiLock} size={28} /></span>}{lookup.data.regions.map((region) => { if (currentSheet.regions?.[region.region] !== false) return null; return <span key={region.region} title={t('description.unavailableInRegion', { region: region.name })} style={{ transform: ['jp', 'usa', 'offline'].includes(region.region) ? undefined : 'rotateY(180deg)' }}><Icon path={regionIconPaths[region.region] ?? mdiCircleOffOutline} size={28} /></span>; })}</div></div><DialogFooter><div className="mr-auto flex gap-2">{searchUrl && <Button variant="outline" asChild><a href={searchUrl} target="_blank" rel="noreferrer"><Icon path={mdiOpenInNew} size={16} />{currentSheet.searchUrl ? ':3' : t('sfc.SheetDialog.searchOnYouTube')}</a></Button>}<Button variant="outline" onClick={copyTitle}><Icon path={mdiContentCopy} size={16} />{t('description.copied')}</Button></div>{isDrawMode && <Button variant="outline" onClick={() => open(currentSheet, true)}>{t('sfc.SheetDialog.tryAgain')}</Button>}<Button onClick={close}>{isDrawMode ? t('ui.ok') : t('ui.close')}</Button></DialogFooter><Badge className="mt-3">{currentSheet.sheetExpr ?? `${currentSheet.songId}|${currentSheet.type}|${currentSheet.difficulty}`}</Badge></DialogContent></Dialog>;
}
