import { spawn } from "node:child_process";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { FETCH_GAME_CODES } from "../config/games";
import { putR2Object, type R2Store } from "./r2";

function requiredDatabaseUrl() {
  const value = process.env.DATABASE_URL;
  if (!value) throw new Error("DATABASE_URL is required for backups.");
  return value;
}

export function createBackupId(now = new Date()) {
  return now.toISOString().replace(/[-:.TZ]/g, "").slice(0, 14);
}

function runCommand(command: string, args: string[]) {
  return new Promise<void>((resolve, reject) => {
    const child = spawn(command, args, { stdio: "inherit" });
    child.once("error", reject);
    child.once("exit", (code, signal) => {
      if (code === 0) return resolve();
      reject(
        new Error(
          `${command} failed with ${signal ? `signal ${signal}` : `status ${code}`}`,
        ),
      );
    });
  });
}

export async function backupGameSchema(
  gameCode: string,
  store: R2Store,
  backupId = createBackupId(),
) {
  const temporaryDirectory = await fs.mkdtemp(
    path.join(os.tmpdir(), "otoge-backup-"),
  );
  const outputPath = path.join(temporaryDirectory, `${gameCode}.dump`);
  try {
    await runCommand("pg_dump", [
      "--dbname",
      requiredDatabaseUrl(),
      "--format=custom",
      "--no-owner",
      "--schema",
      gameCode,
      "--file",
      outputPath,
    ]);
    await putR2Object(
      store,
      `postgres/${backupId}/${gameCode}.dump`,
      await fs.readFile(outputPath),
      { contentType: "application/octet-stream", cacheControl: "private" },
    );
    return `postgres/${backupId}/${gameCode}.dump`;
  } finally {
    await fs.rm(temporaryDirectory, { recursive: true, force: true });
  }
}

export async function backupAll(store: R2Store) {
  const keys: string[] = [];
  const backupId = createBackupId();
  for (const gameCode of FETCH_GAME_CODES) {
    keys.push(await backupGameSchema(gameCode, store, backupId));
  }
  return keys;
}
