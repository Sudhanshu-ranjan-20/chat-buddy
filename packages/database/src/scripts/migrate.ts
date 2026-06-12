import path from "node:path";
import { createDb } from "../client";
import { migrateToLatest } from "..";

const migrationsDir = path.resolve(
  process.argv[3] ||
    process.env.MIGRATIONS_DIR ||
    "../../apps/api/src/database/migrations",
);

const migrate = async () => {
  createDb({
    client: "pg",
    connection: {
      host: process.env.DB_HOST || "localhost",
      port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
      user: process.env.DB_USER || "postgres",
      password: process.env.DB_PASSWORD || "postgres",
      database: process.env.DB_NAME || "chat-buddy",
      ssl: process.env.DB_SSL ? true : false,
    },
    migrations: {
      tableName: "tb_knex_migrations",
      directory: migrationsDir,
    },
  });

  const res = await migrateToLatest();
  console.log(`Migrated to ${JSON.stringify(res)}`);
  process.exit(0);
};
migrate().catch((err) => {
  console.error(err);
  throw err;
});
