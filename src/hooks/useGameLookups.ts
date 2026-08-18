'use client';

import { useCallback, useMemo } from 'react';
import { useGameContext } from '@/contexts/GameContext';
import { useCurrentData } from './useGameDataQuery';
import { resolveUrl } from '@/lib/utils/url';
import type { Sheet } from '@/types';

export function useGameLookups() {
  const data = useCurrentData();
  const { gameCode, gameTitle, dataSourceUrl } = useGameContext();
  const categoryMap = useMemo(() => new Map(data.categories.map((entry) => [entry.category, entry])), [data]);
  const categoryIndex = useMemo(() => new Map(data.categories.map((entry, index) => [entry.category, index])), [data]);
  const versionMap = useMemo(() => new Map(data.versions.map((entry) => [entry.version, entry])), [data]);
  const versionIndex = useMemo(() => new Map(data.versions.map((entry, index) => [entry.version, index])), [data]);
  const typeMap = useMemo(() => new Map(data.types.map((entry) => [entry.type, entry])), [data]);
  const typeIndex = useMemo(() => new Map(data.types.map((entry, index) => [entry.type, index])), [data]);
  const difficultyMap = useMemo(() => new Map(data.difficulties.map((entry) => [entry.difficulty, entry])), [data]);
  const difficultyIndex = useMemo(() => new Map(data.difficulties.map((entry, index) => [entry.difficulty, index])), [data]);
  const getCategoryIndex = useCallback((value?: string) => categoryIndex.get(value ?? '') ?? -1, [categoryIndex]);
  const getCategoryData = useCallback((value?: string) => categoryMap.get(value ?? ''), [categoryMap]);
  const getVersionData = useCallback((value?: string) => versionMap.get(value ?? ''), [versionMap]);
  const getVersionAbbr = useCallback((value?: string) => getVersionData(value)?.abbr ?? value, [getVersionData]);
  const getVersionIndex = useCallback((value?: string) => versionIndex.get(value ?? '') ?? -1, [versionIndex]);
  const getTypeData = useCallback((value?: string) => typeMap.get(value ?? ''), [typeMap]);
  const getTypeName = useCallback((value?: string) => getTypeData(value)?.name ?? String(value).toUpperCase(), [getTypeData]);
  const getTypeAbbr = useCallback((value?: string) => getTypeData(value)?.abbr ?? String(value).toUpperCase(), [getTypeData]);
  const getTypeIconUrl = useCallback((value?: string) => getTypeData(value)?.iconUrl, [getTypeData]);
  const getTypeIconHeight = useCallback((value?: string) => getTypeData(value)?.iconHeight, [getTypeData]);
  const getTypeIndex = useCallback((value?: string) => typeIndex.get(value ?? '') ?? -1, [typeIndex]);
  const getDifficultyData = useCallback((value?: string) => difficultyMap.get(value ?? ''), [difficultyMap]);
  const getDifficultyName = useCallback((value?: string) => getDifficultyData(value)?.name ?? String(value).toUpperCase(), [getDifficultyData]);
  const getDifficultyColor = useCallback((value?: string) => getDifficultyData(value)?.color ?? 'unset', [getDifficultyData]);
  const getDifficultyIconUrl = useCallback((value?: string) => getDifficultyData(value)?.iconUrl, [getDifficultyData]);
  const getDifficultyIconHeight = useCallback((value?: string) => getDifficultyData(value)?.iconHeight, [getDifficultyData]);
  const getDifficultyIndex = useCallback((value?: string) => difficultyIndex.get(value ?? '') ?? -1, [difficultyIndex]);
  const getLockedIconUrl = useCallback(() => resolveUrl('locked.png', `${dataSourceUrl}/img/`), [dataSourceUrl]);
  const getLockedIconHeight = useCallback(() => 40, []);
  const getSheetSearchLinkIcon = useCallback((sheet: Sheet) => sheet.searchUrl === null ? null : sheet.searchUrl?.includes('youtube.com') !== false ? 'youtube' : 'link', []);
  const getSheetSearchLinkColor = useCallback((sheet: Sheet) => sheet.searchUrl === null ? null : 'red', []);
  const getSheetSearchLink = useCallback((sheet: Sheet) => {
    if (sheet.searchUrl === null) return null;
    if (sheet.searchUrl !== undefined) return sheet.searchUrl;
    const url = new URL('https://www.youtube.com/results');
    url.searchParams.set('search_query', `${gameTitle} ${sheet.title ?? ''} ${getDifficultyName(sheet.difficulty)}`.replaceAll('-', '\\-').replaceAll(/([!])\1{3,}/g, (_, mark: string) => mark.repeat(3)));
    return url.toString();
  }, [gameTitle, getDifficultyName]);
  return useMemo(() => ({ data, gameCode, getCategoryData, getCategoryIndex, getVersionAbbr, getVersionIndex, getTypeName, getTypeAbbr, getTypeIconUrl, getTypeIconHeight, getTypeIndex, getDifficultyName, getDifficultyColor, getDifficultyIconUrl, getDifficultyIconHeight, getDifficultyIndex, getLockedIconUrl, getLockedIconHeight, getSheetSearchLinkIcon, getSheetSearchLinkColor, getSheetSearchLink }), [data, gameCode, getCategoryData, getCategoryIndex, getVersionAbbr, getVersionIndex, getTypeName, getTypeAbbr, getTypeIconUrl, getTypeIconHeight, getTypeIndex, getDifficultyName, getDifficultyColor, getDifficultyIconUrl, getDifficultyIconHeight, getDifficultyIndex, getLockedIconUrl, getLockedIconHeight, getSheetSearchLinkIcon, getSheetSearchLinkColor, getSheetSearchLink]);
}
