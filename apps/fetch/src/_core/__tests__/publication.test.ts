import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import {
  GetObjectCommand,
  HeadObjectCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import { describe, expect, it } from "vitest";
import {
  publishGameRelease,
  validateDataForPublication,
  validateReleaseDirectory,
} from "@/_core/publication";
import type { R2Store } from "@/_core/r2";

const song = {
  songId: "song",
  category: null,
  title: "Song",
  artist: null,
  bpm: null,
  imageName: null,
  version: null,
  releaseDate: null,
  isNew: null,
  isLocked: null,
  comment: null,
  sheets: [],
};

const data = {
  songs: [song],
  categories: [],
  versions: [],
  types: [],
  difficulties: [],
  regions: [],
  updateTime: "2026-08-19T00:00:00.000Z",
};

describe("publication validation", () => {
  it("accepts schema-valid generated data", () => {
    expect(validateDataForPublication(data, { requireAssets: false })).toEqual(
      data,
    );
  });

  it("rejects an unexpected large reduction", () => {
    const previous = {
      ...data,
      songs: [
        song,
        { ...song, songId: "song-2" },
        { ...song, songId: "song-3" },
      ],
    };
    expect(() =>
      validateDataForPublication(data, {
        previousData: previous,
        requireAssets: false,
      }),
    ).toThrow(/manual approval/);
  });

  it("rejects malformed data and missing referenced assets", () => {
    expect(() => validateDataForPublication({})).toThrow(/schema validation/);

    const directory = fs.mkdtempSync(path.join(os.tmpdir(), "otoge-release-"));
    try {
      fs.writeFileSync(
        path.join(directory, "data.json"),
        JSON.stringify({
          ...data,
          songs: [{ ...song, imageName: "cover.png" }],
        }),
      );
      expect(() => validateReleaseDirectory(directory, "maimai")).toThrow(
        /Referenced asset is missing/,
      );
    } finally {
      fs.rmSync(directory, { recursive: true, force: true });
    }
  });

  it("does not update current.json when release upload fails", async () => {
    const directory = fs.mkdtempSync(path.join(os.tmpdir(), "otoge-release-"));
    const publishedData = { ...data, songs: [song] };
    const currentManifest = {
      schemaVersion: 1 as const,
      gameCode: "maimai",
      releaseId: "oldrelease",
      prefix: "maimai/releases/oldrelease",
      generatedAt: data.updateTime,
      dataFile: "data.json" as const,
      songCount: 1,
      sheetCount: 0,
      files: [],
    };
    const currentKey = "maimai/current.json";
    const objects = new Map<string, string>([
      [currentKey, JSON.stringify(currentManifest)],
      ["maimai/releases/oldrelease/data.json", JSON.stringify(publishedData)],
    ]);
    const putKeys: string[] = [];
    const client = {
      send: async (command: unknown) => {
        const key = (command as { input: { Key: string } }).input.Key;
        if (command instanceof HeadObjectCommand) {
          if (!objects.has(key)) {
            throw Object.assign(new Error("not found"), { name: "NotFound" });
          }
          return {};
        }
        if (command instanceof GetObjectCommand) {
          const value = objects.get(key);
          if (value === undefined) {
            throw new Error(`Missing fake object: ${key}`);
          }
          return {
            Body: {
              transformToByteArray: async () => new TextEncoder().encode(value),
            },
          };
        }
        if (command instanceof PutObjectCommand) {
          putKeys.push(key);
          if (key === "maimai/releases/newrelease/data.json") {
            throw new Error("simulated release upload failure");
          }
          const body = command.input.Body;
          objects.set(
            key,
            typeof body === "string"
              ? body
              : new TextDecoder().decode(body as Uint8Array),
          );
          return {};
        }
        throw new Error("Unexpected fake S3 command");
      },
    };
    const store = {
      kind: "data" as const,
      bucket: "data",
      client,
    } as unknown as R2Store;

    try {
      fs.writeFileSync(
        path.join(directory, "data.json"),
        JSON.stringify(publishedData),
      );
      const currentBefore = objects.get(currentKey);

      await expect(
        publishGameRelease({
          store,
          gameCode: "maimai",
          directory,
          releaseId: "newrelease",
          validation: { requireAssets: false },
        }),
      ).rejects.toThrow(/simulated release upload failure/);

      expect(objects.get(currentKey)).toBe(currentBefore);
      expect(putKeys).not.toContain(currentKey);
    } finally {
      fs.rmSync(directory, { recursive: true, force: true });
    }
  });
});
