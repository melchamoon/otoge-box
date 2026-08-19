import { FETCH_GAME_CODES } from "../src/config/games";
import {
  closeSequelize,
  createGameSequelize,
  ensureGameSchema,
} from "../src/_core/database";

export async function createSchemas() {
  for (const gameCode of FETCH_GAME_CODES) {
    const sequelize = createGameSequelize(gameCode);
    try {
      await sequelize.authenticate();
      await ensureGameSchema(sequelize, gameCode);
      console.log(`Schema ready: ${gameCode}`);
    } finally {
      await closeSequelize(sequelize);
    }
  }
}

if (require.main === module) {
  createSchemas().catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
  });
}
