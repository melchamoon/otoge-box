import { describe, expect, it } from 'vitest';
import { resolveDataSourceUrl } from '@/lib/utils/dataSource';

describe('resolveDataSourceUrl', () => {
  it('uses the configured local base URL', () => expect(resolveDataSourceUrl('maimai', '/local-data')).toBe('/local-data/maimai'));
  it('removes a trailing slash', () => expect(resolveDataSourceUrl('maimai', '/local-data/')).toBe('/local-data/maimai'));
  it('uses the remote site URL by default', () => expect(resolveDataSourceUrl('maimai')).toContain('cloudfront.net/maimai'));
  it('returns undefined for unknown games', () => expect(resolveDataSourceUrl('unknown')).toBeUndefined());
});
