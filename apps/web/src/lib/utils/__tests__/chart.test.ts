import { describe, expect, it } from "vitest";
import { countSheetsByDifficultyAndLevel } from "@/lib/utils/chart";
import type { Sheet } from "@/types";

const sheet = (
  difficulty: string,
  levelValue: number | null,
  internalLevelValue = levelValue,
) => ({ difficulty, levelValue, internalLevelValue }) as Sheet;

describe("countSheetsByDifficultyAndLevel", () => {
  it("counts one pass by difficulty and level", () => {
    const result = countSheetsByDifficultyAndLevel(
      [
        sheet("easy", 4),
        sheet("easy", 4),
        sheet("hard", 5),
        sheet("other", 4),
        sheet("easy", null),
      ],
      ["easy", "hard"],
      false,
    );
    expect(result.get("easy")?.get(4)).toBe(2);
    expect(result.get("hard")?.get(5)).toBe(1);
    expect(result.get(null)?.get(4)).toBe(1);
  });
  it("uses internal levels when requested", () =>
    expect(
      countSheetsByDifficultyAndLevel([sheet("easy", 4, 4.5)], ["easy"], true)
        .get("easy")
        ?.get(4.5),
    ).toBe(1));
});
