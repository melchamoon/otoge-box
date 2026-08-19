import { afterEach, describe, expect, it, vi } from "vitest";
import {
  getCurrentManifestUrl,
  getDataBaseUrl,
  resolveCurrentDataSourceUrl,
  resolveCurrentManifest,
  resolveDataSourceUrl,
} from "@/lib/utils/dataSource";

const manifest = {
  schemaVersion: 1 as const,
  gameCode: "maimai",
  releaseId: "20260819000000-test",
  prefix: "maimai/releases/20260819000000-test",
  generatedAt: "2026-08-19T00:00:00.000Z",
  dataFile: "data.json" as const,
  songCount: 1,
  sheetCount: 1,
  files: [],
};

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

describe("resolveDataSourceUrl", () => {
  it("uses the configured local base URL", () =>
    expect(resolveDataSourceUrl("maimai", "/local-data")).toBe(
      "/local-data/maimai",
    ));
  it("removes a trailing slash", () =>
    expect(resolveDataSourceUrl("maimai", "/local-data/")).toBe(
      "/local-data/maimai",
    ));
  it("uses the remote site URL by default", () =>
    expect(resolveDataSourceUrl("maimai")).toContain("cloudfront.net/maimai"));
  it("returns undefined for unknown games", () =>
    expect(resolveDataSourceUrl("unknown")).toBeUndefined());
  it("does not expose unsupported mahjong data", () =>
    expect(resolveDataSourceUrl("mahjong")).toBeUndefined());

  it("normalizes an explicitly configured remote base URL", () => {
    vi.stubEnv("NEXT_PUBLIC_DATA_BASE_URL", "https://data.example.test///");
    expect(getDataBaseUrl()).toBe("https://data.example.test");
    expect(getCurrentManifestUrl("maimai")).toBe(
      "https://data.example.test/maimai/current.json",
    );
  });

  it("resolves a valid current manifest", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => manifest,
    });
    vi.stubGlobal("fetch", fetchMock);
    vi.stubEnv("NEXT_PUBLIC_DATA_BASE_URL", "https://data.example.test");

    await expect(resolveCurrentManifest("maimai")).resolves.toEqual(manifest);
    expect(fetchMock).toHaveBeenCalledWith(
      "https://data.example.test/maimai/current.json",
      { cache: "no-store" },
    );
  });

  it("falls back to the legacy path when manifests are optional", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({ ok: false, status: 404 }),
    );
    await expect(resolveCurrentManifest("maimai")).resolves.toBeUndefined();
    await expect(resolveCurrentDataSourceUrl("maimai")).resolves.toContain(
      "cloudfront.net/maimai",
    );
  });

  it("fails when a configured deployment cannot load its manifest", async () => {
    vi.stubEnv("NEXT_PUBLIC_DATA_MANIFEST_REQUIRED", "true");
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({ ok: false, status: 503 }),
    );

    await expect(resolveCurrentManifest("maimai")).rejects.toThrow(/503/);
    await expect(resolveCurrentDataSourceUrl("maimai")).rejects.toThrow(/503/);
  });

  it("uses the immutable release prefix in configured deployments", async () => {
    vi.stubEnv("NEXT_PUBLIC_DATA_BASE_URL", "https://data.example.test");
    vi.stubEnv("NEXT_PUBLIC_DATA_MANIFEST_REQUIRED", "true");
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => manifest,
      }),
    );

    await expect(resolveCurrentDataSourceUrl("maimai")).resolves.toBe(
      "https://data.example.test/maimai/releases/20260819000000-test",
    );
  });

  it("rejects malformed manifests and unknown local games", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({ ...manifest, prefix: "other/releases/bad" }),
      }),
    );
    await expect(resolveCurrentManifest("maimai")).rejects.toThrow(
      /Invalid current manifest/,
    );
    await expect(
      resolveCurrentDataSourceUrl("unknown", "/local-data"),
    ).rejects.toThrow(/Unknown game code/);
  });
});
