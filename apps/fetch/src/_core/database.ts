import type {
  CreationAttributes,
  Model,
  ModelStatic,
  Options,
  Transaction,
} from "sequelize";
import { Sequelize } from "sequelize";
import defineConfigs from "../../config/database.cjs";

const IDENTIFIER_PATTERN = /^[a-z][a-z0-9_]*$/;

export function quoteIdentifier(identifier: string) {
  if (!IDENTIFIER_PATTERN.test(identifier)) {
    throw new Error(`Unsafe PostgreSQL identifier: ${identifier}`);
  }
  return `"${identifier}"`;
}

export function createGameSequelize(gameCode: string) {
  const configs = defineConfigs(gameCode);
  const { url, ...options } = configs.development as Options & {
    url: string;
  };
  return new Sequelize(url, options);
}

export async function ensureGameSchema(sequelize: Sequelize, gameCode: string) {
  await sequelize.query(
    `CREATE SCHEMA IF NOT EXISTS ${quoteIdentifier(gameCode)}`,
  );
}

export async function withTransaction<T>(
  sequelize: Sequelize,
  operation: (transaction: Transaction) => Promise<T>,
) {
  return sequelize.transaction(operation);
}

export function assertNonEmpty<T>(name: string, values: readonly T[]) {
  if (values.length === 0) {
    throw new Error(
      `${name} returned no rows; refusing to mutate the database.`,
    );
  }
  return values;
}

export async function replaceTable<
  T extends Model,
  A extends CreationAttributes<T> = CreationAttributes<T>,
>(
  model: ModelStatic<T>,
  values: readonly A[],
  transaction?: Transaction,
) {
  assertNonEmpty(model.tableName, values);
  const sequelize = model.sequelize;
  if (!sequelize) throw new Error(`Model is not connected: ${model.tableName}`);
  const replace = async (currentTransaction: Transaction) => {
    await model.destroy({
      where: {},
      transaction: currentTransaction,
    });
    await model.bulkCreate([...values], { transaction: currentTransaction });
  };
  if (transaction) {
    await replace(transaction);
  } else {
    await sequelize.transaction(replace);
  }
}

export async function closeSequelize(sequelize: Sequelize) {
  await sequelize.close();
}
