'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { flexRender, stockFeatures, useTable } from '@tanstack/react-table';
import { useTranslations } from 'next-intl';
import { useCurrentData } from '@/hooks/useGameDataQuery';
import { useGameLookups } from '@/hooks/useGameLookups';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import { useSheetDialogStore } from '@/stores/sheetDialog';
import { useGtagEvent } from '@/hooks/useGtagEvent';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function SongsPage() {
  const t = useTranslations();
  const data = useCurrentData();
  const lookup = useGameLookups();
  const open = useSheetDialogStore((state) => state.open);
  const sendEvent = useGtagEvent();
  const [search, setSearch] = useState('');
  const [sorting, setSorting] = useState<any[]>([]);
  const debounced = useDebouncedValue(search);
  const songs = useMemo(() => {
    const needle = debounced.toLowerCase();
    return data.songs.filter((song) => !needle || `${song.title ?? ''} ${song.artist ?? ''}`.toLowerCase().includes(needle));
  }, [data.songs, debounced]);
  const columns = useMemo(() => [
    { id: 'songNo', accessorKey: 'songNo', header: 'No.' },
    { id: 'category', accessorKey: 'category', header: t('term.category'), sortingFn: (rowA: any, rowB: any, id: string) => lookup.getCategoryIndex(rowA.getValue(id)) - lookup.getCategoryIndex(rowB.getValue(id)) },
    { id: 'title', accessorKey: 'title', header: t('term.title') },
    { id: 'artist', accessorKey: 'artist', header: t('term.artist') },
    { id: 'sheets', accessorKey: 'sheets', header: t('term.sheets') },
    { id: 'bpm', accessorKey: 'bpm', header: t('term.bpm') },
    { id: 'version', accessorKey: 'version', header: t('term.version'), sortingFn: (rowA: any, rowB: any, id: string) => lookup.getVersionIndex(rowA.getValue(id)) - lookup.getVersionIndex(rowB.getValue(id)) },
  ], [lookup, t]);
  const table = useTable({ features: stockFeatures, data: songs, columns, state: { sorting }, onSortingChange: setSorting });
  return <div className="mx-auto max-w-screen-2xl px-4 py-6 sm:px-8"><h1 className="mb-5 text-3xl font-semibold">{t('page-title.songs')}</h1><Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder={t('ui.search')} className="mb-5 max-w-xl" /><div className="overflow-x-auto rounded border border-[var(--border)]"><table className="w-full min-w-[900px] border-collapse text-sm"><thead className="bg-black/5 dark:bg-white/5">{table.getHeaderGroups().map((group: any) => <tr key={group.id}>{group.headers.map((header: any) => <th key={header.id} className="border-b border-[var(--border)] px-3 py-2 text-left">{header.isPlaceholder ? null : <button type="button" className="font-semibold" onClick={() => { if (!header.column.getCanSort()) return; const sorted = header.column.getIsSorted(); header.column.toggleSorting(sorted === 'asc'); }}>{flexRender(header.column.columnDef.header, header.getContext())}{header.column.getIsSorted() === 'asc' ? ' ↑' : header.column.getIsSorted() === 'desc' ? ' ↓' : ''}</button>}</th>)}</tr>)}</thead><tbody>{table.getRowModel().rows.map((row: any) => { const song = row.original; return <tr key={`${song.songId}-${song.songNo}`} className="border-b border-[var(--border)]">{row.getVisibleCells().map((cell: any) => <td key={cell.id} className="px-3 py-2">{cell.column.id === 'songNo' && song.songNo}{cell.column.id === 'category' && (song.category ?? '').replaceAll('|', '｜')}{cell.column.id === 'title' && <Link href={`/${lookup.gameCode}/song/?id=${encodeURIComponent(song.songId ?? '')}`} className="text-blue-600 underline">{song.title}</Link>}{cell.column.id === 'artist' && song.artist}{cell.column.id === 'sheets' && <div className="flex flex-wrap gap-1">{song.sheets.map((sheet: any) => <Button key={sheet.sheetExpr} variant="ghost" size="sm" className="h-7 px-1 font-bold" style={{ color: lookup.getDifficultyColor(sheet.difficulty) }} onClick={() => { sendEvent('SheetViewed', { eventSource: 'GameSongsPage' }); open(sheet); }}>{lookup.getTypeAbbr(sheet.type)} {sheet.level}</Button>)}</div>}{cell.column.id === 'bpm' && song.bpm}{cell.column.id === 'version' && lookup.getVersionAbbr(song.version)}</td>)}</tr>; })}</tbody></table></div></div>;
}
