import "dotenv/config";
import { spawn } from "node:child_process";

function run() {
  const backupPath = process.argv[2];
  if (!backupPath) {
    throw new Error("Usage: pnpm db:restore:all -- <local-or-downloaded-dump>");
  }
  const gameCode = process.argv[3];
  if (!gameCode) throw new Error("A game code is required for restore.");
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) throw new Error("DATABASE_URL is required for restore.");
  const child = spawn(
    "pg_restore",
    [
      "--dbname",
      databaseUrl,
      "--schema",
      gameCode,
      "--clean",
      "--if-exists",
      backupPath,
    ],
    { stdio: "inherit" },
  );
  child.once("error", (error) => {
    console.error(error);
    process.exitCode = 1;
  });
  child.once("exit", (code) => {
    process.exitCode = code ?? 1;
  });
}

try {
  run();
} catch (error) {
  console.error(error);
  process.exitCode = 1;
}
