'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import YAML from 'yaml';
import copyToClipboard from 'copy-to-clipboard';
import { useSheetBrowserContext } from '@/contexts/SheetBrowserContext';
import { useCurrentData } from '@/hooks/useGameDataQuery';
import { useSelectedSheets } from '@/hooks/useSelectedSheets';
import { makeDummySheet, saveFiltersAsQuery, selectFiles } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MyListExportDialog } from '@/components/dialogs/MyListExportDialog';

export function ModeSelector() {
  const t = useTranslations(); const { displayMode, setDisplayMode, filterMode, setFilterMode, filters, setFilters } = useSheetBrowserContext(); const data = useCurrentData(); const { selectedSheets, setSelectedSheets } = useSelectedSheets(); const [exportOpen, setExportOpen] = useState(false);
  const copyFilterLink = () => { const query = saveFiltersAsQuery(filters); if (Object.keys(query).length === 0) { window.alert(t('sfc.ModeSelector.noFilterWarn')); return; } const params = new URLSearchParams(query); const url = `${window.location.pathname}?${params.toString().replaceAll('%7C', '|')}`; copyToClipboard(url); window.alert(`${url}\n${t('description.copied')}`); };
  const importSelectedSheets = async () => { const files = await selectFiles({ accept: '.yaml', multiple: false }); if (!files?.length) return; try { const expressions = [...new Set(YAML.parse(await files[0].text()) as string[])]; const map = new Map(data.sheets.map((sheet) => [sheet.sheetExpr, sheet])); const loaded = expressions.map((expr) => map.get(expr) ?? makeDummySheet(expr)); setSelectedSheets(loaded); window.alert(t('sfc.ModeSelector.sheetsLoaded', { n: loaded.length })); } catch (error) { window.alert(`An error occurred while loading '${files[0].name}':\n\n${error}`); } };
  return <div className="flex flex-wrap items-center justify-center gap-5 py-3"><div className="flex flex-wrap justify-center gap-1">{(['grid', 'table', 'chart'] as const).map((mode) => <Button key={mode} variant={displayMode === mode ? 'default' : 'outline'} size="sm" onClick={() => setDisplayMode(mode)}>{t(`sfc.ModeSelector.${mode}Mode`)}</Button>)}</div><div className="flex flex-wrap items-center justify-center gap-1"><Button variant={filterMode === 'filter' ? 'default' : 'outline'} size="sm" onClick={() => setFilterMode('filter')}>{t('sfc.ModeSelector.filterMode')}</Button><Button variant={filterMode === 'my-list' ? 'default' : 'outline'} size="sm" onClick={() => setFilterMode('my-list')}>{t('sfc.ModeSelector.myListMode')} {selectedSheets.length > 0 && <Badge>{selectedSheets.length}</Badge>}</Button>{filterMode === 'filter' ? <><Button variant="outline" size="sm" onClick={copyFilterLink}>↗</Button><Button variant="outline" size="sm" onClick={() => setFilters((current) => ({ ...current, superFilter: current.superFilter === null ? '' : null }))}>{t('term.superFilter')}</Button></> : <><Button variant="outline" size="sm" onClick={() => selectedSheets.length ? setExportOpen(true) : window.alert(t('sfc.ModeSelector.myListEmptyWarn'))}>{t('ui.download')}</Button><Button variant="outline" size="sm" onClick={() => void importSelectedSheets()}>↑</Button></>}</div><MyListExportDialog open={exportOpen} onOpenChange={setExportOpen} /></div>;
}
