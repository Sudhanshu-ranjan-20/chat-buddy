import { Knex } from "knex";
import { DB_CONSTANTS } from "@chat-buddy/shared";

const SCHEMA = DB_CONSTANTS.CHAT_BUDDY_SCHEMA;

const {
  USERS: TB_USERS,
  REFRESH_TOKENS: TB_REFRESH_TOKENS,
  GUILDS: TB_GUILDS,
  GUILD_MEMBERS: TB_GUILD_MEMBERS,
  CHANNELS: TB_CHANNELS,
  MESSAGES: TB_MESSAGES,
} = DB_CONSTANTS.TABLES;

export async function up(knex: Knex): Promise<void> {
  // Creating schema incase schema does not exist

  await knex.schema.createSchemaIfNotExists(SCHEMA);

  const userTable = await knex.schema.withSchema(SCHEMA).hasTable(TB_USERS);
  if (!userTable) {
    await knex.schema.withSchema(SCHEMA).createTable(TB_USERS, (tbl) => {
      tbl.uuid("id").primary().defaultTo(knex.raw(`uuidv7()`));
      tbl.string("name").notNullable();
      tbl.string("email").notNullable().unique();
      tbl.string("avatar_url").nullable().defaultTo(null);
      tbl.string("password").notNullable();
      tbl.timestamp("created_at").defaultTo(knex.fn.now()).notNullable();
      tbl.timestamp("updated_at").defaultTo(knex.fn.now()).notNullable();
      tbl.boolean("is_deleted").defaultTo(false).notNullable();
      tbl.boolean("is_verified").defaultTo(false).notNullable();
      tbl.timestamp("last_login_at").nullable().defaultTo(null);
    });
  }

  const refreshTokenTable = await knex.schema
    .withSchema(SCHEMA)
    .hasTable(TB_REFRESH_TOKENS);
  if (!refreshTokenTable) {
    await knex.schema
      .withSchema(SCHEMA)
      .createTable(TB_REFRESH_TOKENS, (tbl) => {
        tbl.uuid("id").primary().defaultTo(knex.raw(`uuidv7()`));
        tbl
          .uuid("user_id")
          .references("id")
          .inTable(`${SCHEMA}.${TB_USERS}`)
          .onDelete("CASCADE")
          .notNullable();
        tbl.text("token").notNullable();
        tbl.timestamp("expires_at").notNullable();
        tbl.timestamp("created_at").defaultTo(knex.fn.now()).notNullable();
        tbl.timestamp("updated_at").defaultTo(knex.fn.now()).notNullable();
        tbl.boolean("is_deleted").defaultTo(false).notNullable();
      });
  }

  const guildsTable = await knex.schema.withSchema(SCHEMA).hasTable(TB_GUILDS);
  if (!guildsTable) {
    await knex.schema.withSchema(SCHEMA).createTable(TB_GUILDS, (tbl) => {
      tbl.uuid("id").primary().defaultTo(knex.raw(`uuidv7()`));
      tbl.string("name").notNullable();
      tbl
        .uuid("owner_id")
        .references("id")
        .inTable(`${SCHEMA}.${TB_USERS}`)
        .onDelete("CASCADE")
        .nullable()
        .defaultTo(null);
      tbl.timestamp("created_at").defaultTo(knex.fn.now()).notNullable();
      tbl.timestamp("updated_at").defaultTo(knex.fn.now()).notNullable();
      tbl.boolean("is_deleted").defaultTo(false).notNullable();
    });
  }

  const guildMembersTable = await knex.schema
    .withSchema(SCHEMA)
    .hasTable(TB_GUILD_MEMBERS);
  if (!guildMembersTable) {
    await knex.schema
      .withSchema(SCHEMA)
      .createTable(TB_GUILD_MEMBERS, (tbl) => {
        tbl
          .uuid("guild_id")
          .references("id")
          .inTable(`${SCHEMA}.${TB_GUILDS}`)
          .onDelete("CASCADE")
          .nullable()
          .defaultTo(null);
        tbl
          .uuid("user_id")
          .references("id")
          .inTable(`${SCHEMA}.${TB_USERS}`)
          .onDelete("CASCADE")
          .nullable()
          .defaultTo(null);
        tbl.timestamp("joined_at").defaultTo(knex.fn.now()).notNullable();
        tbl.primary(["guild_id", "user_id"]);

        tbl.timestamp("created_at").defaultTo(knex.fn.now()).notNullable();
        tbl.timestamp("updated_at").defaultTo(knex.fn.now()).notNullable();
        tbl.boolean("is_deleted").defaultTo(false).notNullable();
      });
  }

  const channelsTable = await knex.schema
    .withSchema(SCHEMA)
    .hasTable(TB_CHANNELS);
  if (!channelsTable) {
    await knex.schema.withSchema(SCHEMA).createTable(TB_CHANNELS, (tbl) => {
      tbl.uuid("id").primary().defaultTo(knex.raw(`uuidv7()`));
      tbl.string("name", 100).notNullable();
      tbl
        .uuid("guild_id")
        .references("id")
        .inTable(`${SCHEMA}.${TB_GUILDS}`)
        .onDelete("CASCADE")
        .nullable()
        .defaultTo(null);
      tbl
        .enu("type", DB_CONSTANTS.ENUMS.CHANNEL_TYPE)
        .notNullable()
        .defaultTo(DB_CONSTANTS.DEFAULTS.CHANNEL);

      tbl.timestamp("created_at").defaultTo(knex.fn.now()).notNullable();
      tbl.timestamp("updated_at").defaultTo(knex.fn.now()).notNullable();
      tbl.boolean("is_deleted").defaultTo(false).notNullable();

      tbl.index(["guild_id"]);
    });
  }

  const messagesTable = await knex.schema
    .withSchema(SCHEMA)
    .hasTable(TB_MESSAGES);
  if (!messagesTable) {
    await knex.schema.withSchema(SCHEMA).createTable(TB_MESSAGES, (tbl) => {
      tbl.uuid("id").primary().defaultTo(knex.raw(`uuidv7()`));

      tbl
        .uuid("channel_id")
        .references("id")
        .inTable(`${SCHEMA}.${TB_CHANNELS}`)
        .onDelete("CASCADE")
        .nullable()
        .defaultTo(null);
      tbl
        .uuid("author_id")
        .references("id")
        .inTable(`${SCHEMA}.${TB_USERS}`)
        .onDelete("CASCADE")
        .nullable()
        .defaultTo(null);
      tbl.enum("type", DB_CONSTANTS.ENUMS.MESSAGE_TYPE).notNullable();
      tbl.jsonb("content").notNullable();

      tbl.timestamp("created_at").defaultTo(knex.fn.now()).notNullable();
      tbl.timestamp("updated_at").defaultTo(knex.fn.now()).notNullable();
      tbl.boolean("is_deleted").defaultTo(false).notNullable();

      tbl.index(["channel_id", "created_at"]);
    });
  }
}

export async function down(knex: Knex): Promise<void> {
  [
    TB_MESSAGES,
    TB_CHANNELS,
    TB_GUILD_MEMBERS,
    TB_GUILDS,
    TB_REFRESH_TOKENS,
    TB_USERS,
  ].forEach(async (table) => {
    await knex.schema.withSchema(SCHEMA).dropTableIfExists(table);
  });

  await knex.schema.dropSchemaIfExists(SCHEMA);
}
