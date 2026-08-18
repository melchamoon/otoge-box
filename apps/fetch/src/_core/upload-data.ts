import path from "node:path";
import log4js from "log4js";
import "dotenv/config";
import { publishGameRelease } from "./publication";
import { createR2Store } from "./r2";

export default async function run(gameCode: string) {
  if (!gameCode) {
    throw new Error("GAME_CODE is not set.");
  }

  const logger = log4js.getLogger(`${gameCode}/upload-data`);
  logger.level = log4js.levels.INFO;

  logger.info("Validating and uploading an immutable release ...");
  const manifest = await publishGameRelease({
    store: createR2Store("data"),
    gameCode,
    directory: path.resolve("dist", gameCode),
    validation: {
      allowLargeDecrease: process.env.ALLOW_LARGE_DECREASE === "true",
      requireAssets: process.env.REQUIRE_ASSETS !== "false",
    },
  });
  logger.info(`Published ${manifest.prefix}`);
}

if (require.main === module) {
  run(process.argv[2]).catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
  });
}
