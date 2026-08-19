import { spawn } from "node:child_process";
import { getFetchGame } from "../src/config/games";

export async function runGame(gameCode: string) {
  const game = getFetchGame(gameCode);
  await new Promise<void>((resolve, reject) => {
    const child = spawn("pnpm", ["run", game.task], {
      env: process.env,
      stdio: "inherit",
    });
    child.once("error", reject);
    child.once("exit", (code, signal) => {
      if (code === 0) {
        resolve();
        return;
      }
      reject(
        new Error(
          `${game.task} failed with ${signal ? `signal ${signal}` : `status ${code}`}`,
        ),
      );
    });
  });
}

const gameCode = process.argv[2];
if (require.main === module) {
  if (!gameCode) {
    console.error("Usage: pnpm run run:game -- <game-code>");
    process.exitCode = 2;
  } else {
    runGame(gameCode).catch((error: unknown) => {
      console.error(error);
      process.exitCode = 1;
    });
  }
}
