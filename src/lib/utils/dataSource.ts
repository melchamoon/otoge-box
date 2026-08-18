import sites from '@/data/sites.json';

/**
 * Resolve the data source of a game.
 *
 * When `localDataBaseUrl` is set, the local data copy under `public/local-data/`
 * is used instead of the remote data source.
 */
export function resolveDataSourceUrl(gameCode: string, localDataBaseUrl?: string) {
  const siteInfo = sites.find((site) => site.gameCode === gameCode);
  if (siteInfo === undefined) return undefined;

  if (localDataBaseUrl) {
    return `${localDataBaseUrl.replace(/\/+$/, '')}/${gameCode}`;
  }

  return siteInfo.dataSourceUrl;
}
