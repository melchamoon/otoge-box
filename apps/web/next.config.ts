import fs from "node:fs";
import path from "node:path";
import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
import withSerwistInit from "@serwist/next";
import sites from "./src/data/sites.json";

const LOCAL_DATA_DIR = "public/local-data";
const LEGACY_DATA_BASE_URL = "https://dp4p6x0xfi5o9.cloudfront.net";
const configuredDataBaseUrl = process.env.NEXT_PUBLIC_DATA_BASE_URL;

export function getLocalDataPath(gameCode: string) {
  return path.resolve(process.cwd(), LOCAL_DATA_DIR, gameCode, "data.json");
}

const localDataBaseUrl = (() => {
  if (process.env.LOCAL_DATA_BASE_URL !== undefined) {
    return process.env.LOCAL_DATA_BASE_URL || undefined;
  }
  if (process.env.NEXT_PUBLIC_DATA_BASE_URL !== undefined) {
    return undefined;
  }

  const isLocalDataReady = sites
    .filter((site) => !site.isHidden)
    .every((site) => fs.existsSync(getLocalDataPath(site.gameCode)));
  return process.env.NODE_ENV === "development" && isLocalDataReady
    ? "/local-data"
    : undefined;
})();

const nextConfig: NextConfig = {
  trailingSlash: true,
  allowedDevOrigins: ["127.0.0.1"],
  env: {
    NEXT_PUBLIC_LOCAL_DATA_BASE_URL: localDataBaseUrl ?? "",
    NEXT_PUBLIC_DATA_BASE_URL: configuredDataBaseUrl ?? LEGACY_DATA_BASE_URL,
    NEXT_PUBLIC_DATA_MANIFEST_REQUIRED: configuredDataBaseUrl
      ? "true"
      : "false",
    NEXT_PUBLIC_SITE_TITLE:
      process.env.NEXT_PUBLIC_SITE_TITLE ??
      process.env.SITE_TITLE ??
      "音ゲーぼっくす",
    NEXT_PUBLIC_SITE_URL:
      process.env.NEXT_PUBLIC_SITE_URL ??
      process.env.SITE_URL ??
      "http://localhost:3000",
    NEXT_PUBLIC_SITE_REPORT_URL:
      process.env.NEXT_PUBLIC_SITE_REPORT_URL ??
      process.env.SITE_REPORT_URL ??
      "",
    NEXT_PUBLIC_SOURCE_CODE_URL:
      process.env.NEXT_PUBLIC_SOURCE_CODE_URL ??
      process.env.SOURCE_CODE_URL ??
      "https://github.com/melchamoon/otoge-box",
    NEXT_PUBLIC_SITE_DESCRIPTION_EN:
      process.env.NEXT_PUBLIC_SITE_DESCRIPTION_EN ??
      process.env.SITE_DESCRIPTION_EN ??
      "A utility site that provides a searching interface for ______ songs and sheets.",
    NEXT_PUBLIC_SITE_DESCRIPTION_JP:
      process.env.NEXT_PUBLIC_SITE_DESCRIPTION_JP ??
      process.env.SITE_DESCRIPTION_JP ??
      "______譜面情報検索webツール",
  },
};

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");
const withSerwist = withSerwistInit({
  swSrc: "src/sw.ts",
  swDest: "public/sw.js",
  disable: process.env.NODE_ENV !== "production",
  register: true,
  cacheOnNavigation: true,
});

export default withSerwist(withNextIntl(nextConfig));
