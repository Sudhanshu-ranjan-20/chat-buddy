import knex, { Knex } from "knex";
import { TDbConfig } from "./types";
let db: Knex | null = null;
export const createDb = (config: TDbConfig): Knex => {
  try {
    if (db) return db;
    db = knex({
      client: config.client || "pg",
      connection: {
        host: config.connection.host,
        port: config.connection.port || 5432,
        user: config.connection.user,
        password: config.connection.password,
        database: config.connection.database,
      },
      pool: config.pool || { min: 0, max: 7 },
      migrations: {
        tableName: config?.migrations?.tableName,
        extension: config?.migrations?.extension || "ts",
        directory: config?.migrations?.directory || "./migrations",
      },
      seeds: {
        extension: config?.seeds?.extension || "ts",
        directory: config?.seeds?.directory || "./seeds",
      },
    });

    return db;
  } catch (error) {
    console.log("ERROR IN CREATING DB CLIENT", error);
    throw new Error(`DATA_BASE init failed ${error}`);
  }
};
export const getDb = (): Knex | null => {
  if (!db) return null;
  return db;
};
export const closeDb = async (): Promise<void> => {
  try {
    if (db) {
      await db.destroy();
      db = null;
    }
  } catch (error) {
    throw new Error("Error closing the database connection");
  }
};
