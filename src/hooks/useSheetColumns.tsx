'use client';

import { useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { mdiFileImage, mdiLock, mdiStar } from '@mdi/js';
import { noteTypesByGame } from '@/data/gameFeatures';
import { useGameContext } from '@/contexts/GameContext';
import { useGameLookups } from '@/hooks/useGameLookups';
import { useSheetDialogStore } from '@/stores/sheetDialog';
import { toPercentageString } from '@/lib/utils/format';
import { validateNoteCounts } from '@/lib/utils/sheet';
import { Icon } from '@/components/Icon';
import type { Sheet } from '@/types';

export function useSheetColumns() {
  const t = useTranslations();
  const { gameCode } = useGameContext();
  const lookup = useGameLookups();
  const open = useSheetDialogStore((state) => state.open);
  return useMemo(() => {
    const indexSort = (getIndex: (value?: string) => number) => (rowA: any, rowB: any, id: string) => getIndex(rowA.getValue(id) as string | undefined) - getIndex(rowB.getValue(id) as string | undefined);
    const base = [
      { id: 'songNo', accessorKey: 'songNo', header: 'No.' },
      { id: 'title', accessorKey: 'title', header: t('term.title'), cell: ({ row }: any) => { const sheet = row.original as Sheet; return <div className="flex min-w-48 items-center gap-1"><button type="button" className="text-cyan-600" aria-label={t('term.title')} onClick={() => open(sheet)}><Icon path={mdiFileImage} size={20} /></button><span>{sheet.title}</span>{sheet.isLocked && <span title={t('description.unlockNeeded')}><Icon path={mdiLock} size={16} className="text-yellow-500" /></span>}{sheet.isNew && <span title={t('description.newSong')}><Icon path={mdiStar} size={16} className="text-yellow-500" /></span>}</div>; } },
      { id: 'type', accessorKey: 'type', header: t('term.type'), sortingFn: indexSort(lookup.getTypeIndex), cell: ({ row }: any) => { const sheet = row.original as Sheet; const icon = lookup.getTypeIconUrl(sheet.type); return icon ? <img src={icon} height={lookup.getTypeIconHeight(sheet.type)} alt={lookup.getTypeAbbr(sheet.type)} /> : lookup.getTypeAbbr(sheet.type); } },
      { id: 'difficulty', accessorKey: 'difficulty', header: t('term.difficulty'), sortingFn: indexSort(lookup.getDifficultyIndex), cell: ({ row }: any) => { const sheet = row.original as Sheet; const icon = lookup.getDifficultyIconUrl(sheet.difficulty); return <span className="font-bold" style={{ color: lookup.getDifficultyColor(sheet.difficulty) }}>{icon && <img src={icon} height={lookup.getDifficultyIconHeight(sheet.difficulty)} alt="" className="mr-1 inline align-middle" />}{lookup.getDifficultyName(sheet.difficulty)}</span>; } },
      { id: 'levelValue', accessorKey: 'levelValue', header: t('term.level'), cell: ({ row }: any) => <span className="font-bold" style={{ color: lookup.getDifficultyColor(row.original.difficulty) }}>{row.original.level ?? '—'}</span> },
      { id: 'internalLevelValue', accessorKey: 'internalLevelValue', header: t('term.internalLevel'), cell: ({ row }: any) => row.original.internalLevel ?? '—' },
      { id: 'bpm', accessorKey: 'bpm', header: t('term.bpm') },
      { id: 'version', accessorKey: 'version', header: t('term.version'), sortingFn: indexSort(lookup.getVersionIndex), cell: ({ row }: any) => lookup.getVersionAbbr(row.original.version) },
      { id: 'releaseDate', accessorKey: 'releaseDate', header: t('term.releaseDate') },
    ];
    const optional = (noteTypesByGame[gameCode] ?? []).flatMap((noteType) => [
      { id: `noteCounts.${noteType}`, accessorKey: `noteCounts.${noteType}`, header: noteType.toUpperCase(), cell: ({ row }: any) => row.original.noteCounts?.[noteType] ?? '—' },
      { id: `notePercents.${noteType}`, accessorKey: `notePercents.${noteType}`, header: `${noteType.toUpperCase()} %`, cell: ({ row }: any) => toPercentageString(row.original.notePercents?.[noteType]) ?? '—' },
    ]);
    optional.push({ id: 'noteCounts.total', accessorKey: 'noteCounts.total', header: t('term.totalNotes'), cell: ({ row }: any) => { const sheet = row.original as Sheet; return <>{sheet.noteCounts?.total ?? '—'}{!validateNoteCounts(sheet, gameCode) && <span title={t('description.invalidNoteCounts')}> ⚠</span>}</>; } });
    return [...base, ...optional] as any[];
  }, [gameCode, lookup, open, t]);
}
