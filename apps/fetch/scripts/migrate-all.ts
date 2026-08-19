import path from "node:path";
import { createRequire } from "node:module";
import { SequelizeStorage } from "umzug";
import { Umzug } from "umzug";
import { FETCH_GAME_CODES } from "../src/config/games";
import {
  closeSequelize,
  createGameSequelize,
  ensureGameSchema,
  quoteIdentifier,
} from "../src/_core/database";

const requireFromFile = createRequire(__filename);

type MigrationModule = {
  up: (queryInterface: unknown) => Promise<void>;
  down: (queryInterface: unknown) => Promise<void>;
};

export async function migrateGame(gameCode: string) {
  const sequelize = createGameSequelize(gameCode);
  try {
    await sequelize.authenticate();
    await ensureGameSchema(sequelize, gameCode);
    await sequelize.query(`SET search_path TO ${quoteIdentifier(gameCode)}`);
    const queryInterface = sequelize.getQueryInterface();
    const migrator = new Umzug({
      migrations: {
        glob: path.resolve("db", gameCode, "migrations", "*.js"),
        resolve: ({ name, path: migrationPath }) => {
          if (!migrationPath)
            throw new Error(`Missing migration path: ${name}`);
          const migration = requireFromFile(migrationPath) as MigrationModule;
          return {
            name,
            up: () => migration.up(queryInterface),
            down: () => migration.down(queryInterface),
          };
        },
      },
      context: queryInterface,
      storage: new SequelizeStorage({
        sequelize,
        modelName: "SequelizeMeta",
        schema: gameCode,
      }),
      logger: console,
    });
    await migrator.up();
    console.log(`Migrations complete: ${gameCode}`);
  } finally {
    await closeSequelize(sequelize);
  }
}

export async function migrateAll() {
  for (const gameCode of FETCH_GAME_CODES) {
    await migrateGame(gameCode);
  }
}

if (require.main === module) {
  migrateAll().catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
  });
}
