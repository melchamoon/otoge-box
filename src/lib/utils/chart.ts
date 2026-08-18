import type { Sheet } from "@/types";

export function countSheetsByDifficultyAndLevel(
  sheets: Sheet[],
  difficulties: string[],
  useInternalLevel: boolean,
) {
  const difficultySet = new Set(difficulties);
  const result = new Map<string | null, Map<number, number>>();
  for (const sheet of sheets) {
    const level = useInternalLevel
      ? sheet.internalLevelValue
      : sheet.levelValue;
    if (level == null) continue;
    const difficulty = difficultySet.has(sheet.difficulty ?? "")
      ? sheet.difficulty!
      : null;
    const counts = result.get(difficulty) ?? new Map<number, number>();
    counts.set(level, (counts.get(level) ?? 0) + 1);
    result.set(difficulty, counts);
  }
  return result;
}
