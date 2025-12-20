import path from "node:path";
import { createDb } from "../client";
import { runSeeds } from "..";

const seedsDir = path.resolve(
  process.argv[3] || process.env.MIGRATIONS_DIR || "../../apps/server/db/seeds"
);

const main = async () => {
  createDb({
    client: "pg",
    connection: {
      host: process.env.DB_HOST || "localhost",
      port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
      user: process.env.DB_USER || "sudhanshu",
      password: process.env.DB_PASSWORD || "postgres",
      database: process.env.DB_NAME || "chat-buddy",
      ssl: process.env.DB_SSL ? true : false,
    },
    seeds: {
      directory: seedsDir,
    },
  });

  const res = await runSeeds();
  console.log(`Seeds executed successfully`);
  process.exit(0);
};
main().catch((err) => {
  console.error(err);
  throw err;
});
