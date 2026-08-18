'use client';

import { useEffect, useMemo, useState } from 'react';
import { stockFeatures, useTable } from '@tanstack/react-table';
import { useSheetColumns } from '@/hooks/useSheetColumns';
import { SheetDataGrid } from './SheetDataGrid';
import { SheetDataTable } from './SheetDataTable';
import { SheetDataChart } from './SheetDataChart';
import type { Sheet } from '@/types';

function Pagination({ table }: { table: any }) { return <div className="my-3 flex items-center justify-center gap-2 text-sm"><button type="button" className="rounded border px-2 py-1 disabled:opacity-40" disabled={!table.getCanPreviousPage()} onClick={() => table.previousPage()}>‹</button><span>{(table.state?.pagination?.pageIndex ?? 0) + 1} / {table.getPageCount()}</span><button type="button" className="rounded border px-2 py-1 disabled:opacity-40" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>›</button></div>; }

export function SheetDataView({ sheets, displayMode }: { sheets: Sheet[]; displayMode: 'grid' | 'table' | 'chart' }) {
  const columns = useSheetColumns(); const [sorting, setSorting] = useState<any[]>([]); const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 48 }); const data = useMemo(() => sheets, [sheets]);
  const table = useTable({ features: stockFeatures, data, columns, state: { sorting, pagination }, onSortingChange: setSorting, onPaginationChange: setPagination });
  useEffect(() => { setPagination((current) => ({ ...current, pageIndex: 0 })); }, [sheets]);
  if (displayMode === 'chart') return <SheetDataChart sheets={sheets} />;
  return <div><Pagination table={table} />{displayMode === 'grid' ? <SheetDataGrid table={table} /> : <SheetDataTable table={table} />}<Pagination table={table} /></div>;
}
