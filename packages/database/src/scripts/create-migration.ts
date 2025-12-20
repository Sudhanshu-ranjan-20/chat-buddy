import fs from "fs";
import path from "path";

const name = process.argv[2];
if (!name) {
  console.error("Please provide a name for the migration.");
  process.exit(1);
}

const migrationsDir = path.resolve(
  process.argv[3] ||
    process.env.MIGRATIONS_DIR ||
    "../../apps/server/db/migrations"
);

if (!fs.existsSync(migrationsDir)) {
  fs.mkdirSync(migrationsDir, { recursive: true });
}

const timestamp = new Date().toISOString().replace(/[-:T.Z]/g, "");
const filename = `${timestamp}_${name}.ts`;

const filePath = path.join(migrationsDir, filename);

const template = `import { Knex } from "knex";
import { DB_CONSTANTS } from "@chat-buddy/shared";

export async function up(knex: Knex): Promise<void> {
}

export async function down(knex: Knex): Promise<void> {
}
`;

fs.writeFileSync(filePath, template);
console.log(`Migration file created: ${filePath}`);
