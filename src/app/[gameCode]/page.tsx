'use client';

import { useEffect, useMemo, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import { useTranslations } from 'next-intl';
import confetti from 'canvas-confetti';
import { SheetBrowserProvider, type DisplayMode, type FilterMode } from '@/contexts/SheetBrowserContext';
import { useCurrentData, useGameDataQuery } from '@/hooks/useGameDataQuery';
import { useSelectedSheets } from '@/hooks/useSelectedSheets';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import { buildEmptyFilters, buildFilterOptions, filterSheets, getRegionOverrideSheet, loadFiltersFromQuery, NULL_SHEET, VOID_SHEET, HYBRID_SHEET } from '@/lib/utils';
import { SheetFilter } from '@/components/SheetFilter';
import { ModeSelector } from '@/components/ModeSelector';
import { SheetDrawerPanel } from '@/components/SheetDrawerPanel';
import { DataInfoBar } from '@/components/DataInfoBar';
import { FilterInfoBar } from '@/components/FilterInfoBar';
import { SheetDataView } from '@/components/sheet-data-view/SheetDataView';
import { LoadingOverlay } from '@/components/LoadingOverlay';
import { useSheetDialogStore } from '@/stores/sheetDialog';
import type { Translate } from '@/lib/utils/filter';

export default function GamePage() {
  const t = useTranslations(); const router = useRouter(); const pathname = usePathname(); const query = useGameDataQuery(); const data = useCurrentData(); const [filters, setFilters] = useState(buildEmptyFilters); const [displayMode, setDisplayMode] = useState<DisplayMode>('grid'); const [filterMode, setFilterMode] = useState<FilterMode>('filter'); const { selectedSheets, selectedSheetSet, setSelectedSheets } = useSelectedSheets(); const openSheet = useSheetDialogStore((state) => state.open); const { resolvedTheme, setTheme } = useTheme();
  const filterOptions = useMemo(() => buildFilterOptions(data, ((key, values) => t(key, values as never)) as Translate), [data, t]);
  const debouncedTitle = useDebouncedValue(filters.title); const debouncedArtist = useDebouncedValue(filters.artist); const debouncedMinBPM = useDebouncedValue(filters.minBPM); const debouncedMaxBPM = useDebouncedValue(filters.maxBPM);
  const effectiveFilters = useMemo(() => ({ ...filters, title: debouncedTitle, artist: debouncedArtist, minBPM: debouncedMinBPM, maxBPM: debouncedMaxBPM }), [filters, debouncedArtist, debouncedMaxBPM, debouncedMinBPM, debouncedTitle]);
  const filteredSheets = useMemo(() => filterSheets(data.sheets, effectiveFilters), [data.sheets, effectiveFilters]);
  const preDisplayingSheets = filterMode === 'filter' ? filteredSheets : selectedSheets;
  const displayingSheets = useMemo(() => { if (filterMode === 'my-list' && filters.useRegionOverride && filters.region && !filters.region.startsWith('!')) return preDisplayingSheets.map((sheet) => getRegionOverrideSheet(sheet, filters.region!)); return preDisplayingSheets; }, [filterMode, filters.region, filters.useRegionOverride, preDisplayingSheets]);
  const unselectedSheets = useMemo(() => filteredSheets.filter((sheet) => !selectedSheetSet.has(sheet)), [filteredSheets, selectedSheetSet]);
  useEffect(() => { const params = new URLSearchParams(window.location.search); if (params.size > 0) { const queryObject = Object.fromEntries(params.entries()); setFilters(loadFiltersFromQuery(queryObject)); router.replace(pathname); } }, [pathname, router]);
  const ritualReady = selectedSheets.length === 2 && selectedSheetSet.has(NULL_SHEET) && selectedSheetSet.has(VOID_SHEET);
  const clearMyList = async () => { if (!ritualReady) { setSelectedSheets([]); return; } setTheme(resolvedTheme === 'dark' ? 'light' : 'dark'); await new Promise((resolve) => window.setTimeout(resolve, 1500)); openSheet(HYBRID_SHEET); confetti({ particleCount: 100, spread: 60, origin: { y: 0.6 }, zIndex: 999 }); setSelectedSheets([HYBRID_SHEET]); };
  const pickFromFilter = () => { if (!unselectedSheets.length) { window.alert(t('description.noMoreSheetsToPick')); return; } setSelectedSheets([...selectedSheets, unselectedSheets[Math.floor(Math.random() * unselectedSheets.length)]]); };
  const contextValue = { displayingSheets, filters, setFilters, filterOptions, displayMode, setDisplayMode, filterMode, setFilterMode };
  return <SheetBrowserProvider value={contextValue}><div className="mx-auto max-w-screen-2xl px-4 py-5 sm:px-8"><DataInfoBar className="mb-5" />{query.isFetching && !query.data && <LoadingOverlay />}<SheetFilter /><ModeSelector /><SheetDrawerPanel /><FilterInfoBar sheets={displayingSheets} totalSheets={data.sheets.length} totalSongs={data.songs.length} />{filterMode === 'my-list' && <div className="my-4 text-center"><ButtonLike onClick={pickFromFilter}>{t('description.pickOneFromFilter')}</ButtonLike></div>}{displayingSheets.length > 0 || displayMode === 'chart' ? <SheetDataView sheets={displayingSheets} displayMode={displayMode} /> : <p className="py-10 text-center opacity-70">{filterMode === 'filter' ? t('description.filterResultEmpty') : t('description.myListEmpty')}</p>}{filterMode === 'my-list' && selectedSheets.length > 0 && <div className="py-8 text-center"><ButtonLike danger={!ritualReady} onClick={() => void clearMyList()}>{t('description.clearMyList')}</ButtonLike></div>}</div></SheetBrowserProvider>;
}

function ButtonLike({ children, onClick, danger = false }: { children: React.ReactNode; onClick: () => void; danger?: boolean }) { return <button type="button" onClick={onClick} className={`rounded border px-4 py-2 text-sm ${danger ? 'border-red-500 text-red-600' : 'border-blue-500 text-blue-600'} hover:bg-black/5 dark:hover:bg-white/10`}>{children}</button>; }
