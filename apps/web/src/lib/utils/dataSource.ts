import sites from "@/data/sites.json";

export type ReleaseManifest = {
  schemaVersion: 1;
  gameCode: string;
  releaseId: string;
  prefix: string;
  generatedAt: string;
  dataFile: "data.json";
  songCount: number;
  sheetCount: number;
  files: Array<{ path: string; bytes: number; sha256: string }>;
};

const LEGACY_DATA_BASE_URL = "https://dp4p6x0xfi5o9.cloudfront.net";

export function getDataBaseUrl() {
  return (
    process.env.NEXT_PUBLIC_DATA_BASE_URL?.replace(/\/+$/, "") ||
    LEGACY_DATA_BASE_URL
  );
}

export function getCurrentManifestUrl(gameCode: string) {
  return `${getDataBaseUrl()}/${gameCode}/current.json`;
}

export function resolveDataSourceUrl(
  gameCode: string,
  localDataBaseUrl?: string,
) {
  const siteInfo = sites.find((site) => site.gameCode === gameCode);
  if (siteInfo === undefined) return undefined;

  if (localDataBaseUrl) {
    return `${localDataBaseUrl.replace(/\/+$/, "")}/${gameCode}`;
  }

  // Keep local development usable before the first R2 release. Configured
  // production deployments resolve the immutable prefix below.
  return `${getDataBaseUrl()}/${gameCode}`;
}

function parseManifest(value: unknown, gameCode: string): ReleaseManifest {
  if (!value || typeof value !== "object") {
    throw new Error(`Invalid current manifest for ${gameCode}`);
  }
  const manifest = value as Partial<ReleaseManifest>;
  const releaseIdIsSafe =
    typeof manifest.releaseId === "string" &&
    /^[a-z0-9][a-z0-9-]{7,63}$/.test(manifest.releaseId);
  if (
    manifest.schemaVersion !== 1 ||
    manifest.gameCode !== gameCode ||
    !releaseIdIsSafe ||
    typeof manifest.prefix !== "string" ||
    manifest.prefix !== `${gameCode}/releases/${manifest.releaseId}` ||
    typeof manifest.generatedAt !== "string" ||
    manifest.dataFile !== "data.json" ||
    typeof manifest.songCount !== "number" ||
    typeof manifest.sheetCount !== "number" ||
    !Array.isArray(manifest.files)
  ) {
    throw new Error(`Invalid current manifest for ${gameCode}`);
  }
  return manifest as ReleaseManifest;
}

export async function resolveCurrentManifest(gameCode: string) {
  const response = await fetch(getCurrentManifestUrl(gameCode), {
    cache: "no-store",
  });
  if (!response.ok) {
    if (process.env.NEXT_PUBLIC_DATA_MANIFEST_REQUIRED === "true") {
      throw new Error(
        `Failed to load current manifest for ${gameCode} (${response.status})`,
      );
    }
    return undefined;
  }
  return parseManifest(await response.json(), gameCode);
}

export async function resolveCurrentDataSourceUrl(
  gameCode: string,
  localDataBaseUrl?: string,
): Promise<string> {
  const local = resolveDataSourceUrl(gameCode, localDataBaseUrl);
  if (localDataBaseUrl) {
    if (!local) throw new Error(`Unknown game code: ${gameCode}`);
    return local;
  }
  if (process.env.NEXT_PUBLIC_DATA_MANIFEST_REQUIRED !== "true") {
    if (!local) throw new Error(`Unknown game code: ${gameCode}`);
    return local;
  }
  const manifest = await resolveCurrentManifest(gameCode);
  return manifest ? `${getDataBaseUrl()}/${manifest.prefix}` : local!;
}
