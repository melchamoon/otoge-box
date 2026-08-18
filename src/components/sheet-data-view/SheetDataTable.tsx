'use client';

import { flexRender } from '@tanstack/react-table';
import { useSheetBrowserContext } from '@/contexts/SheetBrowserContext';
import { useSelectedSheets } from '@/hooks/useSelectedSheets';

export function SheetDataTable({ table }: { table: any }) {
  const { filterMode } = useSheetBrowserContext(); const { selectedSheetSet, toggleSheetSelection } = useSelectedSheets();
  return <div className="overflow-x-auto rounded border border-[var(--border)]"><table className="w-full min-w-[1000px] border-collapse text-sm"><thead className="bg-black/5 dark:bg-white/5">{table.getHeaderGroups().map((group: any) => <tr key={group.id}>{group.headers.map((header: any) => <th key={header.id} className="whitespace-nowrap border-b border-[var(--border)] px-3 py-2 text-left">{header.isPlaceholder ? null : <button type="button" className="font-semibold" onClick={() => header.column.getCanSort() && header.column.toggleSorting()}>{flexRender(header.column.columnDef.header, header.getContext())}{header.column.getIsSorted() === 'asc' ? ' ↑' : header.column.getIsSorted() === 'desc' ? ' ↓' : ''}</button>}</th>)}</tr>)}</thead><tbody>{table.getRowModel().rows.map((row: any) => <tr key={row.id} className={filterMode !== 'my-list' && selectedSheetSet.has(row.original) ? 'bg-[#4eda]' : ''} onContextMenu={(event) => { event.preventDefault(); toggleSheetSelection(row.original); }}>{row.getVisibleCells().map((cell: any) => <td key={cell.id} className="border-b border-[var(--border)] px-3 py-2">{flexRender(cell.column.columnDef.cell, cell.getContext()) ?? String(cell.getValue() ?? '')}</td>)}</tr>)}</tbody></table></div>;
}
