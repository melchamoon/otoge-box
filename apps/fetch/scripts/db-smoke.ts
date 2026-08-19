import { FETCH_GAME_CODES } from "../src/config/games";
import { QueryTypes } from "sequelize";
import {
  closeSequelize,
  createGameSequelize,
  quoteIdentifier,
} from "../src/_core/database";
import { migrateAll } from "./migrate-all";

type CountRow = { count: string };

async function assertMigratedSchemas() {
  for (const gameCode of FETCH_GAME_CODES) {
    const sequelize = createGameSequelize(gameCode);
    try {
      const tables = await sequelize.query<CountRow>(
        `SELECT COUNT(*)::text AS count
         FROM information_schema.tables
         WHERE table_schema = $schema`,
        { bind: { schema: gameCode }, type: QueryTypes.SELECT },
      );
      if (Number(tables[0]?.count ?? 0) < 2) {
        throw new Error(`Expected migrated tables in schema ${gameCode}.`);
      }

      const metadata = await sequelize.query<CountRow>(
        `SELECT COUNT(*)::text AS count
         FROM information_schema.tables
         WHERE table_schema = $schema
           AND table_name = 'SequelizeMeta'`,
        { bind: { schema: gameCode }, type: QueryTypes.SELECT },
      );
      if (Number(metadata[0]?.count ?? 0) !== 1) {
        throw new Error(`Missing migration metadata for schema ${gameCode}.`);
      }
    } finally {
      await closeSequelize(sequelize);
    }
  }
}

async function assertTransactionRollback() {
  const sequelize = createGameSequelize(FETCH_GAME_CODES[0]);
  const schema = "smoke_test";
  try {
    await sequelize.query(
      `CREATE SCHEMA IF NOT EXISTS ${quoteIdentifier(schema)}`,
    );
    await sequelize.query(
      `DROP TABLE IF EXISTS ${quoteIdentifier(schema)}.probe`,
    );
    try {
      await sequelize.transaction(async (transaction) => {
        await sequelize.query(
          `CREATE TABLE ${quoteIdentifier(schema)}.probe (id integer NOT NULL)`,
          { transaction },
        );
        throw new Error("intentional smoke rollback");
      });
    } catch (error) {
      if (
        !(error instanceof Error) ||
        !error.message.includes("smoke rollback")
      ) {
        throw error;
      }
    }
    const tables = await sequelize.query<CountRow>(
      `SELECT COUNT(*)::text AS count
       FROM information_schema.tables
       WHERE table_schema = $schema
         AND table_name = 'probe'`,
      { bind: { schema }, type: QueryTypes.SELECT },
    );
    if (Number(tables[0]?.count ?? 0) !== 0) {
      throw new Error("Transaction rollback smoke test left a table behind.");
    }
  } finally {
    await sequelize.query(
      `DROP SCHEMA IF EXISTS ${quoteIdentifier(schema)} CASCADE`,
    );
    await closeSequelize(sequelize);
  }
}

export async function runDatabaseSmokeTest() {
  await migrateAll();
  await assertMigratedSchemas();
  await migrateAll();
  await assertMigratedSchemas();
  await assertTransactionRollback();
  console.log("PostgreSQL schema and migration smoke test passed.");
}

runDatabaseSmokeTest().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
