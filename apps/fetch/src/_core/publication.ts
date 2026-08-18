import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { rawDataSchema, type RawData } from "./utils/schemas";
import {
  getR2ObjectBytes,
  getR2ObjectText,
  hasR2Object,
  putR2Object,
  type R2Store,
} from "./r2";

const RELEASE_ID_PATTERN = /^[a-z0-9][a-z0-9-]{7,63}$/;
const DATA_FILE = "data.json";

export type ReleaseFile = {
  path: string;
  bytes: number;
  sha256: string;
};

export type ReleaseManifest = {
  schemaVersion: 1;
  gameCode: string;
  releaseId: string;
  prefix: string;
  generatedAt: string;
  dataFile: typeof DATA_FILE;
  songCount: number;
  sheetCount: number;
  files: ReleaseFile[];
};

export type PublicationValidationOptions = {
  previousData?: RawData;
  allowLargeDecrease?: boolean;
  minimumCountRatio?: number;
  requireAssets?: boolean;
};

function contentType(filePath: string) {
  if (filePath.endsWith(".json")) return "application/json; charset=utf-8";
  if (filePath.endsWith(".yaml")) return "text/yaml; charset=utf-8";
  if (filePath.endsWith(".svg")) return "image/svg+xml";
  if (filePath.endsWith(".png")) return "image/png";
  if (filePath.endsWith(".jpg") || filePath.endsWith(".jpeg")) {
    return "image/jpeg";
  }
  if (filePath.endsWith(".webp")) return "image/webp";
  return "application/octet-stream";
}

function collectFiles(directory: string, current = directory): ReleaseFile[] {
  return fs
    .readdirSync(current, { withFileTypes: true })
    .flatMap((entry) => {
      const absolute = path.join(current, entry.name);
      if (entry.isDirectory()) return collectFiles(directory, absolute);
      if (!entry.isFile())
        throw new Error(`Unsupported release entry: ${absolute}`);
      const body = fs.readFileSync(absolute);
      return [
        {
          path: path.relative(directory, absolute).split(path.sep).join("/"),
          bytes: body.byteLength,
          sha256: crypto.createHash("sha256").update(body).digest("hex"),
        },
      ];
    })
    .sort((left, right) => left.path.localeCompare(right.path));
}

function isExternalAsset(value: string) {
  return value.startsWith("http://") || value.startsWith("https://");
}

function assertAssetExists(directory: string, relativePath: string) {
  const normalized = path.normalize(relativePath);
  const absolute = path.resolve(directory, normalized);
  const root = path.resolve(directory) + path.sep;
  if (!absolute.startsWith(root)) {
    throw new Error(`Asset escapes release directory: ${relativePath}`);
  }
  if (!fs.existsSync(absolute)) {
    throw new Error(`Referenced asset is missing: ${relativePath}`);
  }
}

function validateAssets(directory: string, data: RawData, gameCode: string) {
  for (const song of data.songs) {
    if (song.imageName && !isExternalAsset(song.imageName)) {
      if (gameCode === "any" && song.imageName.includes("..")) continue;
      assertAssetExists(directory, path.join("img", "cover", song.imageName));
      assertAssetExists(directory, path.join("img", "cover-m", song.imageName));
    }
  }
  for (const icon of [
    ...data.types.map((entry) => entry.iconUrl),
    ...data.difficulties.map((entry) => entry.iconUrl),
  ]) {
    if (icon && !isExternalAsset(icon))
      assertAssetExists(directory, path.join("img", icon));
  }
}

export function validateDataForPublication(
  value: unknown,
  options: PublicationValidationOptions = {},
) {
  const parsed = rawDataSchema.safeParse(value);
  if (!parsed.success) {
    throw new Error(
      `Generated data failed schema validation: ${parsed.error.message}`,
    );
  }
  const data = parsed.data;
  if (data.songs.length === 0) {
    throw new Error("Generated data contains no songs; refusing to publish.");
  }
  const minimumCountRatio = options.minimumCountRatio ?? 0.5;
  const previousCount = options.previousData?.songs.length;
  if (
    previousCount &&
    !options.allowLargeDecrease &&
    data.songs.length < previousCount * minimumCountRatio
  ) {
    throw new Error(
      `Song count dropped from ${previousCount} to ${data.songs.length}; manual approval is required.`,
    );
  }
  return data;
}

export function validateReleaseDirectory(
  directory: string,
  gameCode: string,
  options: PublicationValidationOptions = {},
) {
  if (!fs.existsSync(directory))
    throw new Error(`Release directory not found: ${directory}`);
  const dataPath = path.join(directory, DATA_FILE);
  if (!fs.existsSync(dataPath))
    throw new Error(`Release is missing ${DATA_FILE}`);
  const data = validateDataForPublication(
    JSON.parse(fs.readFileSync(dataPath, "utf8")) as unknown,
    options,
  );
  if (options.requireAssets !== false)
    validateAssets(directory, data, gameCode);
  return { data, files: collectFiles(directory) };
}

export function createReleaseId(now = new Date()) {
  const timestamp = now
    .toISOString()
    .replace(/[-:.TZ]/g, "")
    .slice(0, 14);
  return `${timestamp}-${crypto.randomBytes(5).toString("hex")}`;
}

function assertReleaseId(releaseId: string) {
  if (!RELEASE_ID_PATTERN.test(releaseId)) {
    throw new Error(`Invalid release id: ${releaseId}`);
  }
}

function releasePrefix(gameCode: string, releaseId: string) {
  assertReleaseId(releaseId);
  return `${gameCode}/releases/${releaseId}`;
}

async function loadPreviousData(store: R2Store, manifest?: ReleaseManifest) {
  if (!manifest) return undefined;
  return JSON.parse(
    await getR2ObjectText(store, `${manifest.prefix}/${manifest.dataFile}`),
  ) as RawData;
}

export async function loadCurrentManifest(
  store: R2Store,
  gameCode: string,
): Promise<ReleaseManifest | undefined> {
  const key = `${gameCode}/current.json`;
  if (!(await hasR2Object(store, key))) return undefined;
  const value = JSON.parse(
    await getR2ObjectText(store, key),
  ) as ReleaseManifest;
  assertReleaseId(value.releaseId);
  if (
    value.schemaVersion !== 1 ||
    value.gameCode !== gameCode ||
    value.prefix !== `${gameCode}/releases/${value.releaseId}` ||
    value.dataFile !== DATA_FILE ||
    !Array.isArray(value.files)
  ) {
    throw new Error(`Invalid current manifest for ${gameCode}`);
  }
  return value;
}

export function dataSourceUrlFromManifest(
  baseUrl: string,
  manifest: ReleaseManifest,
) {
  return `${baseUrl.replace(/\/+$/, "")}/${manifest.prefix}`;
}

export async function publishGameRelease({
  store,
  gameCode,
  directory,
  releaseId = createReleaseId(),
  validation = {},
}: {
  store: R2Store;
  gameCode: string;
  directory: string;
  releaseId?: string;
  validation?: PublicationValidationOptions;
}) {
  const current = await loadCurrentManifest(store, gameCode);
  const previousData =
    validation.previousData ?? (await loadPreviousData(store, current));
  const { data, files } = validateReleaseDirectory(directory, gameCode, {
    ...validation,
    previousData,
  });
  const prefix = releasePrefix(gameCode, releaseId);
  if (
    (await hasR2Object(store, `${prefix}/${DATA_FILE}`)) ||
    (await hasR2Object(store, `${prefix}/manifest.json`))
  ) {
    throw new Error(`Release prefix already exists: ${prefix}`);
  }

  const manifest: ReleaseManifest = {
    schemaVersion: 1,
    gameCode,
    releaseId,
    prefix,
    generatedAt: data.updateTime,
    dataFile: DATA_FILE,
    songCount: data.songs.length,
    sheetCount: data.songs.reduce(
      (count, song) => count + song.sheets.length,
      0,
    ),
    files,
  };

  for (const file of files) {
    await putR2Object(
      store,
      `${prefix}/${file.path}`,
      fs.readFileSync(path.join(directory, file.path)),
      {
        contentType: contentType(file.path),
        cacheControl: "public, max-age=31536000, immutable",
      },
    );
  }
  await putR2Object(
    store,
    `${prefix}/manifest.json`,
    JSON.stringify(manifest, null, 2),
    {
      contentType: "application/json; charset=utf-8",
      cacheControl: "immutable",
    },
  );

  // This is intentionally the final write. All release content is immutable and
  // a failed upload leaves the previous current.json untouched.
  await putR2Object(
    store,
    `${gameCode}/current.json`,
    JSON.stringify(manifest, null, 2),
    {
      contentType: "application/json; charset=utf-8",
      cacheControl: "no-cache",
    },
  );
  return manifest;
}

function releaseFilePath(directory: string, relativePath: string) {
  if (path.isAbsolute(relativePath) || relativePath.includes("\\")) {
    throw new Error(`Invalid release file path: ${relativePath}`);
  }
  const absolute = path.resolve(directory, relativePath);
  const root = path.resolve(directory) + path.sep;
  if (!absolute.startsWith(root)) {
    throw new Error(`Release file escapes destination: ${relativePath}`);
  }
  return absolute;
}

export async function downloadReleaseToDirectory(
  store: R2Store,
  manifest: ReleaseManifest,
  directory: string,
) {
  const parent = path.dirname(directory);
  fs.mkdirSync(parent, { recursive: true });
  const temporaryDirectory = fs.mkdtempSync(
    path.join(parent, ".release-download-"),
  );

  try {
    for (const file of manifest.files) {
      const body = await getR2ObjectBytes(
        store,
        `${manifest.prefix}/${file.path}`,
      );
      const digest = crypto.createHash("sha256").update(body).digest("hex");
      if (body.byteLength !== file.bytes || digest !== file.sha256) {
        throw new Error(`Release file failed validation: ${file.path}`);
      }
      const destination = releaseFilePath(temporaryDirectory, file.path);
      fs.mkdirSync(path.dirname(destination), { recursive: true });
      fs.writeFileSync(destination, body);
    }

    if (fs.existsSync(directory)) {
      fs.rmSync(directory, { recursive: true, force: true });
    }
    fs.renameSync(temporaryDirectory, directory);
  } catch (error) {
    fs.rmSync(temporaryDirectory, { recursive: true, force: true });
    throw error;
  }
}
