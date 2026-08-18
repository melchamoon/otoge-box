import { describe, expect, it } from "vitest";
import {
  $canonicalSheet,
  computeSheetExpr,
  getCanonicalSheet,
  getRegionOverrideSheet,
  isCanonicalSheet,
  makeDummySheet,
  validateNoteCounts,
} from "@/lib/utils/sheet";
import type { Sheet } from "@/types";

describe("sheet utilities", () => {
  it("computes stable sheet expressions", () =>
    expect(
      computeSheetExpr({
        songId: "s",
        type: "basic",
        difficulty: "easy",
      } as Sheet),
    ).toBe("s|basic|easy"));
  it("resolves region overrides back to canonical sheets", () => {
    const parent = {
      songId: "s",
      type: "basic",
      difficulty: "easy",
      regionOverrides: { usa: { level: "7" } },
    } as unknown as Sheet;
    parent[$canonicalSheet] = parent;
    parent.regionOverrides!.usa[$canonicalSheet] = parent;
    Object.setPrototypeOf(parent.regionOverrides!.usa, parent);
    expect(getRegionOverrideSheet(parent, "usa").level).toBe("7");
    expect(getCanonicalSheet(parent.regionOverrides!.usa)).toBe(parent);
    expect(isCanonicalSheet(parent)).toBe(true);
  });
  it("validates note counts by game", () => {
    const valid = {
      noteCounts: { tap: 1, hold: 1, slide: 1, touch: 1, break: 1, total: 5 },
    } as unknown as Sheet;
    expect(validateNoteCounts(valid, "maimai")).toBe(true);
    expect(
      validateNoteCounts(
        { noteCounts: { ...valid.noteCounts, total: 4 } } as unknown as Sheet,
        "maimai",
      ),
    ).toBe(false);
    expect(validateNoteCounts(valid, "ongeki")).toBe(true);
  });
  it("creates invalid and unmatched dummy sheets", () => {
    expect(makeDummySheet("a|b").category).toBe("INVALID SHEET EXPR");
    expect(makeDummySheet("a|b|c").category).toBe("UNMATCHED SHEET");
  });
});
