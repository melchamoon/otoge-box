import { describe, expect, it } from "vitest";
import { getCoverImageMName } from "@/_core/assets";

describe("cover image asset names", () => {
  it("uses webp for generated cover-m assets", () => {
    expect(getCoverImageMName("cover.png")).toBe("cover.webp");
    expect(getCoverImageMName("cover.jpg")).toBe("cover.webp");
  });

  it("keeps the fallback cover name unchanged", () => {
    expect(getCoverImageMName("default-cover.png")).toBe("default-cover.png");
  });
});
