import path from "node:path";
import { createDb } from "../client";
import { rollback } from "..";

const migrationsDir = path.resolve(process.argv[3] || process.env.MIGRATIONS_DIR || "../../apps/server/db/migrations");

const main = async () => {
    createDb({
        client: "pg",
        connection:{
            host:process.env.DB_HOST || "localhost",
            port:process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
            user:process.env.DB_USER || "sudhanshu",
            password:process.env.DB_PASSWORD || "postgres",
            database:process.env.DB_NAME || "chat-buddy",
            ssl: process.env.DB_SSL? true : false,
        },
        migrations:{
            tableName:"tb_nex_migrations",
            directory:migrationsDir
        }
    })

    const res = await rollback();
    console.log(`Rolled back to batch ${res.batch}`);
    process.exit(0);
}
main().catch(err => {console.error(err); throw err; });
