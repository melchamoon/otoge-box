'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useCurrentData } from '@/hooks/useGameDataQuery';
import { useGameLookups } from '@/hooks/useGameLookups';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import { useSheetDialogStore } from '@/stores/sheetDialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function SongsPage() { const t = useTranslations(); const data = useCurrentData(); const lookup = useGameLookups(); const open = useSheetDialogStore((state) => state.open); const [search, setSearch] = useState(''); const debounced = useDebouncedValue(search); const songs = useMemo(() => { const needle = debounced.toLowerCase(); return data.songs.filter((song) => !needle || `${song.title ?? ''} ${song.artist ?? ''}`.toLowerCase().includes(needle)); }, [data.songs, debounced]); return <div className="mx-auto max-w-screen-2xl px-4 py-6 sm:px-8"><h1 className="mb-5 text-3xl font-semibold">{t('page-title.songs')}</h1><Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder={t('ui.search')} className="mb-5 max-w-xl" /><div className="overflow-x-auto rounded border border-[var(--border)]"><table className="w-full min-w-[900px] border-collapse text-sm"><thead className="bg-black/5 dark:bg-white/5"><tr>{['No.', t('term.category'), t('term.title'), t('term.artist'), t('term.sheets'), t('term.bpm'), t('term.version')].map((header) => <th key={header} className="border-b border-[var(--border)] px-3 py-2 text-left">{header}</th>)}</tr></thead><tbody>{songs.map((song) => <tr key={`${song.songId}-${song.songNo}`} className="border-b border-[var(--border)]"><td className="px-3 py-2">{song.songNo}</td><td className="px-3 py-2">{(song.category ?? '').replaceAll('|', '｜')}</td><td className="px-3 py-2"><Link href={`/${lookup.gameCode}/song/?id=${encodeURIComponent(song.songId ?? '')}`} className="text-blue-600 underline">{song.title}</Link></td><td className="px-3 py-2">{song.artist}</td><td className="px-3 py-2"><div className="flex flex-wrap gap-1">{song.sheets.map((sheet) => <Button key={sheet.sheetExpr} variant="ghost" size="sm" className="h-7 px-1 font-bold" style={{ color: lookup.getDifficultyColor(sheet.difficulty) }} onClick={() => open(sheet)}>{lookup.getTypeAbbr(sheet.type)} {sheet.level}</Button>)}</div></td><td className="px-3 py-2">{song.bpm}</td><td className="px-3 py-2">{lookup.getVersionAbbr(song.version)}</td></tr>)}</tbody></table></div></div>; }
