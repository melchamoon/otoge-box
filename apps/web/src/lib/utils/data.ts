import {
  $canonicalSheet,
  computeSheetExpr,
  validateNoteCounts,
} from "@/lib/utils/sheet";
import { resolveUrl } from "@/lib/utils/url";
import type { Data } from "@/types";

const AGGREGATE_ASSET_PREFIX = "__release__/";

function resolveAggregateAssetUrl(
  filePath: string | undefined,
  dataSourceUrl: string,
) {
  if (filePath == null || !filePath.startsWith(AGGREGATE_ASSET_PREFIX)) {
    return undefined;
  }
  const assetPath = filePath.slice(AGGREGATE_ASSET_PREFIX.length);
  const match =
    /^([a-z0-9-]+)\/releases\/[a-z0-9][a-z0-9-]{7,63}\/img\/(cover|cover-m)\/(.+)$/.exec(
      assetPath,
    );
  if (!match) {
    throw new Error(`Invalid aggregate asset reference: ${filePath}`);
  }
  if (dataSourceUrl.startsWith("/")) {
    const dataRoot = dataSourceUrl.replace(/\/any(?:\/releases\/[^/]+)?$/, "");
    return `${dataRoot}/${match[1]}/img/${match[2]}/${match[3]}`;
  }
  return new URL(`/${assetPath}`, dataSourceUrl).toString();
}

function resolveImageUrl(
  filePath: string | undefined,
  dataSourceUrl: string,
  directory: "cover" | "cover-m",
) {
  return (
    resolveAggregateAssetUrl(filePath, dataSourceUrl) ??
    resolveUrl(filePath, `${dataSourceUrl}/img/${directory}/`)
  );
}

function getCoverImageMName(filePath: string | undefined) {
  if (
    filePath == null ||
    filePath === "default-cover.png" ||
    filePath.startsWith(AGGREGATE_ASSET_PREFIX)
  )
    return filePath;
  return filePath.replace(/\.[^/.]+$/, ".webp");
}

export function buildEmptyData(): Data {
  return {
    songs: [],
    sheets: [],

    categories: [],

    versions: [],

    types: [],
    difficulties: [],

    regions: [],

    // mark the data as empty
    updateTime: "0000-00-00",
  };
}

export function preprocessData(
  data: Data,
  dataSourceUrl: string,
  gameCode: string,
) {
  function computeNotePercentages(
    noteCounts: Record<string, number | null> | undefined,
  ) {
    return noteCounts != null
      ? Object.fromEntries(
          Object.entries(noteCounts).map(([key, value]) => [
            key,
            value != null && noteCounts.total != null
              ? Number(value) / noteCounts.total
              : null,
          ]),
        )
      : noteCounts;
  }

  let lastSongNo = 0;
  for (const song of data.songs) {
    lastSongNo += 1;
    song.songNo = lastSongNo;
    song.imageUrl = resolveImageUrl(song.imageName, dataSourceUrl, "cover");
    song.imageUrlM = resolveImageUrl(
      getCoverImageMName(song.imageName),
      dataSourceUrl,
      "cover-m",
    );

    for (const sheet of song.sheets) {
      Object.setPrototypeOf(sheet, song);

      sheet[$canonicalSheet] = sheet;

      sheet.imageUrl = resolveImageUrl(sheet.imageName, dataSourceUrl, "cover");
      sheet.imageUrlM = resolveImageUrl(
        getCoverImageMName(sheet.imageName),
        dataSourceUrl,
        "cover-m",
      );

      sheet.sheetExpr = computeSheetExpr(sheet);
      sheet.notePercents = computeNotePercentages(sheet.noteCounts);

      if (!validateNoteCounts(sheet, gameCode)) {
        console.warn("Invalid note counts:", sheet.sheetExpr, sheet.noteCounts);
      }

      for (const regionOverride of Object.values(sheet.regionOverrides ?? {})) {
        Object.setPrototypeOf(regionOverride, sheet);

        Object.freeze(regionOverride);
      }

      Object.freeze(sheet.noteCounts);
      Object.freeze(sheet.notePercents);
      Object.freeze(sheet.regions);
      Object.freeze(sheet.regionOverrides);

      Object.freeze(sheet);
    }

    Object.freeze(song.sheets);

    Object.freeze(song);
  }

  data.songs.reverse();

  data.sheets = data.songs.flatMap((song) => song.sheets);

  for (const category of data.categories) {
    Object.freeze(category);
  }
  for (const version of data.versions) {
    Object.freeze(version);
  }
  for (const type of data.types) {
    type.iconUrl = resolveUrl(type.iconUrl, `${dataSourceUrl}/img/`);
    Object.freeze(type);
  }
  for (const difficulty of data.difficulties) {
    difficulty.iconUrl = resolveUrl(
      difficulty.iconUrl!,
      `${dataSourceUrl}/img/`,
    );
    Object.freeze(difficulty);
  }
  for (const region of data.regions) {
    Object.freeze(region);
  }

  Object.freeze(data.songs);
  Object.freeze(data.sheets);
  Object.freeze(data.categories);
  Object.freeze(data.versions);
  Object.freeze(data.types);
  Object.freeze(data.difficulties);
  Object.freeze(data.regions);

  Object.freeze(data);
}
