const DEFAULT_POOL = {
  max: Number(process.env.DB_POOL_MAX || 5),
  min: 0,
  acquire: 60_000,
  idle: 10_000,
};

function defineConfigs(gameCode) {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error(
      "DATABASE_URL is required. Use the Supavisor session-mode connection string.",
    );
  }

  const ssl = process.env.DATABASE_SSL !== "false";
  return {
    development: {
      url,
      dialect: "postgres",
      logging: false,
      schema: gameCode,
      searchPath: gameCode,
      define: {
        timestamps: false,
        schema: gameCode,
      },
      dialectOptions: ssl ? { ssl: { rejectUnauthorized: false } } : undefined,
      pool: DEFAULT_POOL,
      migrationStorage: "sequelize",
      migrationStorageTableName: "SequelizeMeta",
      migrationStorageTableSchema: gameCode,
    },
  };
}

module.exports = defineConfigs;
