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
});
