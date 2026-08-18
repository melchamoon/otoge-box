/**
 * Resolve `filePath` against `baseUrl`.
 *
 * `baseUrl` is a data source URL, which is either an absolute URL (the remote
 * data source) or a site-absolute path (the local data copy). For the latter,
 * a site-absolute path is returned instead of an absolute URL.
 */
// eslint-disable-next-line import/prefer-default-export
export function resolveUrl(filePath: string | undefined, baseUrl: string) {
  if (filePath == null) return filePath;

  if (baseUrl.startsWith('/')) {
    // normalize with a dummy origin, then keep the path only
    const { pathname, search, hash } = new URL(filePath, `http://local-data.invalid${baseUrl}`);
    return `${pathname}${search}${hash}`;
  }

  return new URL(filePath, baseUrl).toString();
}
