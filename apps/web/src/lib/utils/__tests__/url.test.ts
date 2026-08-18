import { describe, expect, it } from "vitest";
import { resolveUrl } from "@/lib/utils/url";

describe("resolveUrl", () => {
  it("resolves remote absolute URLs", () =>
    expect(resolveUrl("a.png", "https://cdn.example/x/")).toBe(
      "https://cdn.example/x/a.png",
    ));
  it("keeps local site-absolute paths site-relative", () =>
    expect(resolveUrl("a.png", "/local-data/maimai/img/cover/")).toBe(
      "/local-data/maimai/img/cover/a.png",
    ));
  it("normalizes relative paths", () =>
    expect(resolveUrl("../cover/a.png", "/local-data/any/img/cover/")).toBe(
      "/local-data/any/img/cover/a.png",
    ));
  it("keeps query and hash", () =>
    expect(resolveUrl("a.png?q=1#x", "/local-data/img/")).toBe(
      "/local-data/img/a.png?q=1#x",
    ));
  it("returns undefined input", () =>
    expect(resolveUrl(undefined, "/local-data/img/")).toBeUndefined());
});
