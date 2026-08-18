'use client';

import { mdiHelp, mdiStar } from '@mdi/js';
import { useTranslations } from 'next-intl';
import { Icon } from '@/components/Icon';
import { SongTile } from '@/components/SongTile';
import type { Song } from '@/types';

export type TimelineBlock =
  | { type: 'version'; typeOrder: number; releaseDate?: string; releaseDateValue: number | null; version: { version: string; releaseDate?: string } }
  | { type: 'songs'; typeOrder: number; releaseDate: string | null; releaseDateValue: number | null; songs: Song[] };

export function Timeline({ blocks, targetRegion, onSongClick }: { blocks: TimelineBlock[]; targetRegion?: string | null; onSongClick: (song: Song) => void }) {
  const t = useTranslations();
  if (!blocks.length) return <div className="flex items-center gap-3 py-10 text-xl"><Icon path={mdiHelp} />{t('ui.noData')}</div>;
  return <div className="relative space-y-6 pl-8 before:absolute before:bottom-0 before:left-2 before:top-0 before:w-px before:bg-[var(--border)]">
    {blocks.map((block, index) => block.type === 'version'
      ? <section key={`v-${block.version.version}-${index}`} className="relative" style={{ contentVisibility: 'auto', containIntrinsicSize: '80px' }}><span className="absolute -left-[1.65rem] top-1 grid h-5 w-5 place-items-center rounded-full bg-[var(--theme-color)] text-white"><Icon path={mdiStar} size={14} /></span><h2 className="text-xl font-semibold">{block.version.version} {block.releaseDate && `(${block.releaseDate})`}</h2></section>
      : <section key={`s-${block.releaseDate}-${index}`} className="relative" style={{ contentVisibility: 'auto', containIntrinsicSize: '280px' }}><span className="absolute -left-[1.55rem] top-2 h-3 w-3 rounded-full bg-gray-500" /><h2 className="mb-3 text-xl">{block.releaseDate ?? 'N/A'}</h2><div className="flex flex-wrap gap-1">{block.songs.map((song) => { const faded = targetRegion != null && song.sheets.every((sheet) => sheet.regions?.[targetRegion] === false); return <div key={`${song.songId}-${song.songNo}`} className={`transition-opacity hover:opacity-100 ${faded ? 'opacity-20' : ''}`}><SongTile song={song} onClick={() => onSongClick(song)} /></div>; })}</div></section>)}
  </div>;
}
