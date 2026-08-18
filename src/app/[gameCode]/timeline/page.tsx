'use client';

import { useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useCurrentData } from '@/hooks/useGameDataQuery';
import { useSheetComboDialogStore } from '@/stores/sheetComboDialog';
import { Timeline, type TimelineBlock } from '@/components/Timeline';
import { Select } from '@/components/ui/select';

export default function TimelinePage() {
  const t = useTranslations();
  const data = useCurrentData();
  const [region, setRegion] = useState<string | null>(null);
  const openCombo = useSheetComboDialogStore((state) => state.open);
  const versionMap = useMemo(() => new Map(data.versions.map((version) => [version.version, version])), [data.versions]);
  const blocks = useMemo<TimelineBlock[]>(() => {
    const all: TimelineBlock[] = [
      ...data.versions.toReversed().map((version) => ({
        type: 'version' as const,
        typeOrder: 0,
        releaseDate: version.releaseDate,
        releaseDateValue: version.releaseDate ? new Date(version.releaseDate).valueOf() : null,
        version,
      })),
      ...[...Map.groupBy(data.songs.toReversed().filter((song) => song.releaseDate != null), (song) => song.releaseDate!).entries()].map(([releaseDate, songs]) => ({
        type: 'songs' as const,
        typeOrder: 2,
        releaseDate,
        releaseDateValue: new Date(releaseDate).valueOf(),
        songs,
      })),
      ...[...Map.groupBy(data.songs.toReversed().filter((song) => song.releaseDate == null), (song) => song.version != null ? versionMap.get(song.version) : null).entries()].map(([version, songs]) => ({
        type: 'songs' as const,
        typeOrder: 1,
        releaseDate: version?.releaseDate ? `${version.releaseDate} ~` : null,
        releaseDateValue: version?.releaseDate ? new Date(version.releaseDate).valueOf() : null,
        songs,
      })).filter((block) => block.releaseDateValue != null),
    ];
    return all.toSorted((a, b) => (b.releaseDateValue ?? 0) - (a.releaseDateValue ?? 0) || b.typeOrder - a.typeOrder);
  }, [data.songs, data.versions, versionMap]);
  const targetRegion = region ?? data.regions[0]?.region;
  return <div className="mx-auto max-w-screen-xl px-4 py-6 sm:px-8"><h1 className="mb-4 text-3xl font-semibold">{t('page-title.timeline')}</h1>{data.regions.length > 0 && <Select value={region ?? data.regions[0]?.region ?? ''} onChange={(event) => setRegion(event.target.value || null)} className="mb-6"><option value="">{t('ui.all')}</option>{data.regions.map((entry) => <option key={entry.region} value={entry.region}>{entry.name}</option>)}</Select>}<Timeline blocks={blocks} targetRegion={targetRegion} onSongClick={(song) => openCombo(song.sheets, { headerTitle: song.title })} /></div>;
}
