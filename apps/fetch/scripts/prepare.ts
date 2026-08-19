import { createSchemas } from "./create-schemas";
import { migrateAll } from "./migrate-all";

export async function prepare() {
  await createSchemas();
  await migrateAll();
}

if (require.main === module) {
  prepare().catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
  });
}
