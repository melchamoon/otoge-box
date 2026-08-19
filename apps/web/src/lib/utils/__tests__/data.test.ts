import { describe, expect, it } from "vitest";
import fixture from "@/test/fixtures/mini-data.json";
import { preprocessData } from "@/lib/utils/data";
import { $canonicalSheet } from "@/lib/utils/sheet";
import type { Data } from "@/types";

describe("preprocessData", () => {
  it("links sheets to frozen songs and calculates URLs/percentages", () => {
    const data = JSON.parse(JSON.stringify(fixture)) as Data;
    preprocessData(data, "/local-data/maimai", "maimai");
    const sheet = data.sheets[0];
    expect(sheet.title).toBeTruthy();
    expect(sheet.imageUrl).toContain("/local-data/maimai");
    expect(sheet.notePercents?.tap).toBeGreaterThan(0);
    expect(Object.isFrozen(data)).toBe(true);
    expect(Object.isFrozen(data.songs[0])).toBe(true);
    expect(Object.isFrozen(sheet)).toBe(true);
    expect(sheet[$canonicalSheet]).toBe(sheet);
  });
  it("assigns song numbers and reverses songs", () => {
    const data = JSON.parse(JSON.stringify(fixture)) as Data;
    preprocessData(data, "https://cdn.example/maimai", "maimai");
    expect(data.songs[0].songId).toBe("song-c");
    expect(data.songs[2].songNo).toBe(1);
  });

  it("resolves aggregate release assets for remote and local data", () => {
    const remoteData = JSON.parse(JSON.stringify(fixture)) as Data;
    remoteData.songs[0].imageName =
      "__release__/maimai/releases/20260819000000-test/img/cover-m/alpha.png";
    preprocessData(
      remoteData,
      "https://cdn.example/any/releases/20260819000000-any",
      "any",
    );
    expect(remoteData.songs[0].imageUrlM).toBe(
      "https://cdn.example/maimai/releases/20260819000000-test/img/cover-m/alpha.png",
    );

    const localData = JSON.parse(JSON.stringify(fixture)) as Data;
    localData.songs[0].imageName = remoteData.songs[0].imageName;
    preprocessData(localData, "/local-data/any", "any");
    expect(localData.songs[0].imageUrlM).toBe(
      "/local-data/maimai/img/cover-m/alpha.png",
    );
  });
});
