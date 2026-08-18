'use client';

import { useSheetBrowserContext } from '@/contexts/SheetBrowserContext';
import { SheetTile } from '@/components/SheetTile';
import type { Sheet } from '@/types';

export function SheetDataGrid({ table }: { table: any }) { const { filterMode } = useSheetBrowserContext(); return <div className="flex flex-wrap justify-center gap-2">{table.getRowModel().rows.map((row: any) => <SheetTile key={row.id} sheet={row.original as Sheet} filterMode={filterMode} />)}{table.getRowModel().rows.length === 0 && <p className="py-8 opacity-70">No data</p>}</div>; }
