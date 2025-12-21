import { Knex } from "knex";
import { DB_CONSTANTS } from "@chat-buddy/shared";
const SCHEMA = DB_CONSTANTS.CHAT_BUDDY_SCHEMA;
const TB_USERS = DB_CONSTANTS.TABLES.USERS;
export async function up(knex: Knex): Promise<void> {
  // Creating schema incase schema does not exist
  await knex.schema.createSchemaIfNotExists(SCHEMA);
  const tableExists = await knex.schema.withSchema(SCHEMA).hasTable(TB_USERS);
  if (!tableExists) {
    await knex.schema
      .withSchema(SCHEMA)
      .createTableIfNotExists(TB_USERS, (tbl) => {
        tbl.uuid("id").primary().defaultTo(knex.raw(`uuidv7()`));
        tbl.string("name").notNullable();
        tbl.string("email").notNullable().unique();
        tbl.string("password").notNullable();
        tbl.timestamp("created_at").defaultTo(knex.fn.now()).notNullable();
        tbl.timestamp("updated_at").defaultTo(knex.fn.now()).notNullable();
        tbl.boolean("is_deleted").defaultTo(false).notNullable();
        tbl.boolean("is_verified").defaultTo(false).notNullable();
        tbl.timestamp("last_login_at").nullable().defaultTo(null);
      });
  }
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.withSchema(SCHEMA).dropTableIfExists(TB_USERS);
  await knex.schema.dropSchemaIfExists(SCHEMA);
}
