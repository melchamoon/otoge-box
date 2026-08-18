import fs from "node:fs";
import path from "node:path";
import type { MetadataRoute } from "next";
import sites from "@/data/sites.json";
import type { Data } from "@/types";

const localPath = (gameCode: string) =>
  path.resolve(process.cwd(), "public/local-data", gameCode, "data.json");

async function loadSiteData(site: (typeof sites)[number]) {
  const local = localPath(site.gameCode);
  const localDataEnabled = Boolean(
    process.env.LOCAL_DATA_BASE_URL ||
    process.env.NEXT_PUBLIC_LOCAL_DATA_BASE_URL,
  );
  if (localDataEnabled && fs.existsSync(local))
    return JSON.parse(fs.readFileSync(local, "utf8")) as Data;
  const response = await fetch(`${site.dataSourceUrl}/data.json`);
  return response.json() as Promise<Data>;
}

export async function generateSitemaps() {
  return sites
    .filter((site) => !site.isHidden)
    .map((site, id) => ({ id, gameCode: site.gameCode }));
}

export default async function sitemap({
  id,
}: {
  id: number;
}): Promise<MetadataRoute.Sitemap> {
  const visible = sites.filter((site) => !site.isHidden);
  const site = visible[id] ?? visible[0];
  const data = await loadSiteData(site);
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  return [
    `/${site.gameCode}/`,
    `/${site.gameCode}/timeline/`,
    `/${site.gameCode}/gallery/`,
    `/${site.gameCode}/songs/`,
    `/${site.gameCode}/about/`,
    ...data.songs.map(
      (song) =>
        `/${site.gameCode}/song/?id=${encodeURIComponent(song.songId ?? "")}`,
    ),
  ].map((url) => ({ url: new URL(url, base).toString() }));
}
