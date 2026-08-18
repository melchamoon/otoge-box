import "dotenv/config";
import { backupAll } from "../src/_core/backup";
import { createR2Store } from "../src/_core/r2";

backupAll(createR2Store("backup")).catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
