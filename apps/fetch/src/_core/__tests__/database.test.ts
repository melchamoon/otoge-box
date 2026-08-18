import { describe, expect, it } from "vitest";
import {
  assertNonEmpty,
  createGameSequelize,
  quoteIdentifier,
} from "@/_core/database";

describe("database safety helpers", () => {
  it("quotes safe PostgreSQL identifiers", () => {
    expect(quoteIdentifier("maimai")).toBe('"maimai"');
    expect(() => quoteIdentifier("maimai; DROP SCHEMA public")).toThrow();
  });

  it("rejects empty fetch results", () => {
    expect(assertNonEmpty("songs", ["song"])).toEqual(["song"]);
    expect(() => assertNonEmpty("songs", [])).toThrow(/refusing to mutate/);
  });

  it("uses the configured PostgreSQL URL", async () => {
    const previousUrl = process.env.DATABASE_URL;
    const previousSsl = process.env.DATABASE_SSL;
    process.env.DATABASE_URL =
      "postgresql://postgres:secret@db.example.test:6543/otoge_box";
    process.env.DATABASE_SSL = "false";
    try {
      const sequelize = createGameSequelize("maimai");
      expect(sequelize.config).toMatchObject({
        database: "otoge_box",
        username: "postgres",
        host: "db.example.test",
        port: "6543",
      });
      await sequelize.close();
    } finally {
      if (previousUrl === undefined) delete process.env.DATABASE_URL;
      else process.env.DATABASE_URL = previousUrl;
      if (previousSsl === undefined) delete process.env.DATABASE_SSL;
      else process.env.DATABASE_SSL = previousSsl;
    }
  });
});
