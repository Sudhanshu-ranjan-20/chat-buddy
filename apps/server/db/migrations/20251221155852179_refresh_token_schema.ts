import { Knex } from "knex";
import { DB_CONSTANTS } from "@chat-buddy/shared";
const SCHEMA = DB_CONSTANTS.CHAT_BUDDY_SCHEMA;
const TB_REFRESH_TOKENS = DB_CONSTANTS.TABLES.REFRESH_TOKENS;
const TB_USERS = DB_CONSTANTS.TABLES.USERS;
export async function up(knex: Knex): Promise<void> {
  // Creating schema incase schema does not exist
  const tableExists = await knex.schema
    .withSchema(SCHEMA)
    .hasTable(TB_REFRESH_TOKENS);
  if (!tableExists) {
    await knex.schema
      .withSchema(SCHEMA)
      .createTable(TB_REFRESH_TOKENS, (tbl) => {
        tbl.uuid("id").primary().defaultTo(knex.raw(`uuidv7()`));
        tbl
          .uuid("user_id")
          .references("id")
          .inTable(`${SCHEMA}.${TB_USERS}`)
          .notNullable();
        tbl.text("token").notNullable();
        tbl.timestamp("expires_at").notNullable();
        tbl.timestamp("created_at").defaultTo(knex.fn.now()).notNullable();
        tbl.timestamp("updated_at").defaultTo(knex.fn.now()).notNullable();
        tbl.boolean("is_deleted").defaultTo(false).notNullable();
      });
  }
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.withSchema(SCHEMA).dropTableIfExists(TB_REFRESH_TOKENS);
}
