import "dotenv/config";
import path from "node:path";
import { spawn } from "node:child_process";
import { FETCH_GAME_CODES } from "../src/config/games";
import {
  downloadReleaseToDirectory,
  loadCurrentManifest,
} from "../src/_core/publication";
import { createR2Store } from "../src/_core/r2";

async function runCommand(command: string, args: string[]) {
  await new Promise<void>((resolve, reject) => {
    const child = spawn(command, args, { env: process.env, stdio: "inherit" });
    child.once("error", reject);
    child.once("exit", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`${command} exited with status ${code}`));
    });
  });
}

export async function aggregate() {
  const store = createR2Store("data");
  const releases = [];
  for (const gameCode of FETCH_GAME_CODES) {
    const manifest = await loadCurrentManifest(store, gameCode);
    if (!manifest) {
      throw new Error(
        `Cannot aggregate before ${gameCode} has a current release.`,
      );
    }
    releases.push({ gameCode, manifest });
  }
  for (const { gameCode, manifest } of releases) {
    await downloadReleaseToDirectory(
      store,
      manifest,
      path.resolve("dist", gameCode),
    );
  }
  process.env.ANY_RELEASE_PREFIXES = JSON.stringify(
    Object.fromEntries(
      releases.map(({ gameCode, manifest }) => [gameCode, manifest.prefix]),
    ),
  );
  await runCommand("pnpm", ["run", "any:gen-json"]);
  await runCommand("pnpm", ["run", "any:upload-data"]);
}

aggregate().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
