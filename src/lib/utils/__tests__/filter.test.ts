import { describe, expect, it } from 'vitest';
import fixture from '@/test/fixtures/mini-data.json';
import { buildEmptyFilters, buildFilterOptions, filterSheets, loadFiltersFromQuery, saveFiltersAsQuery } from '@/lib/utils/filter';
import { preprocessData } from '@/lib/utils/data';
import type { Data, Filters } from '@/types';

function data() { const value = JSON.parse(JSON.stringify(fixture)) as Data; preprocessData(value, '/local-data/maimai', 'maimai'); return value; }

describe('filter utilities', () => {
  it('builds the complete empty filter shape', () => { const filters = buildEmptyFilters(); expect(Object.keys(filters)).toHaveLength(19); expect(filters.categories).toEqual([]); expect(filters.title).toBeNull(); });
  it('round-trips all shareable query fields and excludes super filters', () => { const query = { categories: 'A|C', title: 'alpha', matchExactTitle: 'false', artist: 'artist', matchExactArtist: 'true', versions: 'v1|v2', minBPM: '100', maxBPM: '200', types: 'basic', difficulties: 'easy|hard', minLevelValue: '4', maxLevelValue: '9', useInternalLevel: 'true', noteDesigners: 'Designer A', region: '!usa', useRegionOverride: 'true' }; const filters = loadFiltersFromQuery(query); expect(saveFiltersAsQuery(filters)).toEqual(query); expect(saveFiltersAsQuery({ ...filters, superFilter: 'return () => true' })).not.toHaveProperty('superFilter'); });
  it('filters with AND semantics and canonicalizes results', () => { const value = data(); const filters: Filters = { ...buildEmptyFilters(), categories: ['A'], title: 'alpha', minBPM: 100, maxBPM: 150, region: 'jp' }; const result = filterSheets(value.sheets, filters); expect(result).toHaveLength(2); expect(result.every((sheet) => sheet.sheetExpr)).toBe(true); });
  it('supports region override and super filters', () => { const value = data(); const filters = { ...buildEmptyFilters(), region: 'usa', useRegionOverride: true, superFilter: 'return (sheet) => sheet.levelValue === 7' }; expect(filterSheets(value.sheets, filters)).toHaveLength(0); expect(filterSheets(value.sheets, { ...filters, region: 'jp', superFilter: 'return (sheet) => sheet.levelValue >= 8' })).toHaveLength(2); });
  it('builds sorted options and deep-empty behavior', () => { const value = data(); const options = buildFilterOptions(value, (key, values) => `${key}:${values?.region ?? ''}`); expect(options.levels?.[0]).toMatchObject({ value: 4 }); expect(options.noteDesigners?.[0]).toMatchObject({ value: 'Designer A' }); expect(buildFilterOptions({ ...value, updateTime: '0000-00-00' }, () => '').titles).toEqual([]); });
});
