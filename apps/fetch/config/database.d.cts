import type { Options } from "sequelize";

declare const defineConfigs: (gameCode: string) => {
  development: Options & {
    searchPath?: string;
    migrationStorageTableSchema?: string;
  };
};

export = defineConfigs;
