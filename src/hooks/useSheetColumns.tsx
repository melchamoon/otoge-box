'use client';

import { useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { noteTypesByGame } from '@/data/gameFeatures';
import { useGameContext } from '@/contexts/GameContext';
import { useGameLookups } from '@/hooks/useGameLookups';
import { toPercentageString } from '@/lib/utils/format';

export function useSheetColumns() {
  const t = useTranslations(); const { gameCode } = useGameContext(); const lookup = useGameLookups();
  return useMemo(() => {
    const base = [
      { id: 'songNo', accessorKey: 'songNo', header: 'No.' },
      { id: 'title', accessorKey: 'title', header: t('term.title'), cell: ({ row }: any) => <span className="font-medium">{row.original.title}</span> },
      { id: 'type', accessorKey: 'type', header: t('term.type'), cell: ({ row }: any) => lookup.getTypeAbbr(row.original.type) },
      { id: 'difficulty', accessorKey: 'difficulty', header: t('term.difficulty'), cell: ({ row }: any) => <span style={{ color: lookup.getDifficultyColor(row.original.difficulty) }}>{lookup.getDifficultyName(row.original.difficulty)}</span> },
      { id: 'levelValue', accessorKey: 'levelValue', header: t('term.level'), cell: ({ row }: any) => row.original.level ?? '—' },
      { id: 'internalLevelValue', accessorKey: 'internalLevelValue', header: t('term.internalLevel'), cell: ({ row }: any) => row.original.internalLevel ?? '—' },
      { id: 'bpm', accessorKey: 'bpm', header: t('term.bpm') },
      { id: 'version', accessorKey: 'version', header: t('term.version'), cell: ({ row }: any) => lookup.getVersionAbbr(row.original.version) },
      { id: 'releaseDate', accessorKey: 'releaseDate', header: t('term.releaseDate') },
    ];
    const optional = (noteTypesByGame[gameCode] ?? []).flatMap((noteType) => [
      { id: `noteCounts.${noteType}`, accessorKey: `noteCounts.${noteType}`, header: noteType.toUpperCase(), cell: ({ row }: any) => row.original.noteCounts?.[noteType] ?? '—' },
      { id: `notePercents.${noteType}`, accessorKey: `notePercents.${noteType}`, header: `${noteType.toUpperCase()} %`, cell: ({ row }: any) => toPercentageString(row.original.notePercents?.[noteType]) ?? '—' },
    ]);
    optional.push({ id: 'noteCounts.total', accessorKey: 'noteCounts.total', header: t('term.totalNotes'), cell: ({ row }: any) => row.original.noteCounts?.total ?? '—' });
    return [...base, ...optional] as any[];
  }, [gameCode, lookup, t]);
}
