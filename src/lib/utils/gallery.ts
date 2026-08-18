import { makeDummySheet } from '@/lib/utils/sheet';
import type { RawGallery, Gallery, Sheet } from '@/types';

export function buildGallery(data: RawGallery, sheets: Sheet[]): Gallery {
  const lists = data;

  const sheetMap = new Map(sheets.map((sheet) => [sheet.sheetExpr, sheet]));

  return lists.map((list) => ({
    ...list,
    sections: list.sections.map((section) => ({
      ...section,
      sheets: section.sheets?.map(
        (sheetExpr) => sheetMap.get(sheetExpr) ?? makeDummySheet(sheetExpr),
      ),
    })),
  }));
}
