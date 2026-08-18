import { describe, expect, it } from "vitest";
import fixture from "@/test/fixtures/mini-data.json";
import { preprocessData } from "@/lib/utils/data";
import { buildGallery } from "@/lib/utils/gallery";
import type { Data, RawGallery } from "@/types";

describe("buildGallery", () => {
  it("resolves expressions and creates dummies for missing sheets", () => {
    const data = JSON.parse(JSON.stringify(fixture)) as Data;
    preprocessData(data, "https://cdn.example/maimai", "maimai");
    const gallery = buildGallery(
      [
        {
          title: "Test",
          sections: [{ sheets: ["song-a|basic|easy", "missing|basic|easy"] }],
        },
      ] as RawGallery,
      data.sheets,
    );
    expect(gallery[0].sections[0].sheets?.[0].title).toBe("Alpha Song");
    expect(gallery[0].sections[0].sheets?.[1].category).toBe("UNMATCHED SHEET");
  });
});
