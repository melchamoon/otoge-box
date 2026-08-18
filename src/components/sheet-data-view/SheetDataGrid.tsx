'use client';

import { useSheetBrowserContext } from '@/contexts/SheetBrowserContext';
import { useTranslations } from 'next-intl';
import { SheetTile } from '@/components/SheetTile';
import { useSheetDialogStore } from '@/stores/sheetDialog';
import { Select } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import type { Sheet } from '@/types';

export function SheetDataGrid({ table }: { table: any }) {
  const t = useTranslations();
  const { filterMode } = useSheetBrowserContext();
  const open = useSheetDialogStore((state) => state.open);
  const sorting = table.state?.sorting ?? [];
  const sortableColumns = table.getAllLeafColumns().filter((column: any) => column.getCanSort());
  const activeColumn = sorting[0]?.id ?? sortableColumns[0]?.id ?? 'songNo';
  const activeDesc = Boolean(sorting[0]?.desc);
  const setSortColumn = (id: string) => table.setSorting([{ id, desc: id === activeColumn ? activeDesc : false }]);
  const toggleSortDirection = () => table.setSorting([{ id: activeColumn, desc: !activeDesc }]);
  return <div><div className="mb-3 flex flex-wrap items-center justify-center gap-2"><label className="text-sm" htmlFor="grid-sort">{t('ui.sortBy')}</label><Select id="grid-sort" value={activeColumn} onChange={(event) => setSortColumn(event.target.value)}>{sortableColumns.map((column: any) => <option key={column.id} value={column.id}>{typeof column.columnDef.header === 'string' ? column.columnDef.header : column.id}</option>)}</Select><Button type="button" variant="outline" size="sm" onClick={toggleSortDirection}>{activeDesc ? t('ui.sort-desc') : t('ui.sort-asc')}</Button></div><div className="flex flex-wrap justify-center gap-2" onContextMenu={(event) => event.preventDefault()}>{table.getRowModel().rows.map((row: any) => <SheetTile key={row.id} sheet={row.original as Sheet} filterMode={filterMode} onClick={() => open(row.original as Sheet)} />)}{table.getRowModel().rows.length === 0 && <p className="py-8 opacity-70">No data</p>}</div></div>;
}
