import { Knex } from 'knex';
import { DB_CONSTANTS } from '@chat-buddy/shared';

export async function up(knex: Knex): Promise<void> {
  const { CHAT_BUDDY_SCHEMA, TABLES } = DB_CONSTANTS;
  try {
    await knex.transaction(async (trx: Knex) => {
      await trx.schema.createSchemaIfNotExists(CHAT_BUDDY_SCHEMA);
      const doesUserTableExists = await trx.schema
        .withSchema(CHAT_BUDDY_SCHEMA)
        .hasTable(TABLES.USERS);
      if (doesUserTableExists) return;
      await trx.schema
        .withSchema(CHAT_BUDDY_SCHEMA)
        .createTable(TABLES.USERS, (table) => {
          table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));

          table.string('email', 320).notNullable().unique();
          table.string('username', 50).notNullable().unique();
          table.string('password_hash', 255).notNullable();

          table.string('display_name', 100).notNullable();
          table.text('avatar_url').nullable();

          table
            .enu('status', ['ACTIVE', 'DISABLED', 'DELETED'], {
              useNative: true,
              enumName: 'user_status',
            })
            .notNullable()
            .defaultTo('ACTIVE');

          table
            .timestamp('created_at', { useTz: false })
            .notNullable()
            .defaultTo(knex.fn.now());
          table
            .timestamp('updated_at', { useTz: true })
            .notNullable()
            .defaultTo(knex.fn.now());

          table.index(['email']);
          table.index(['username']);
          table.index(['status']);
        });
      await trx.raw(`
        CREATE OR REPLACE FUNCTION set_updated_at()
        RETURNS TRIGGER AS $$
        BEGIN
            NEW.updated_at = NOW();
            RETURN NEW;
        END;
        $$ language 'plpgsql'
        `);

      await trx.raw(`
        CREATE TRIGGER users_set_updated_at 
        BEFORE UPDATE ON ${CHAT_BUDDY_SCHEMA}.${TABLES.USERS}
        FOR EACH ROW
        EXECUTE FUNCTION set_updated_at();
        `);
    });
  } catch (err: any) {
    console.error('Error in Knex Up::', err);
    throw err;
  }
}

export async function down(knex: Knex): Promise<void> {
  const { TABLES, CHAT_BUDDY_SCHEMA } = DB_CONSTANTS;
  try {
    await knex.transaction(async (trx: Knex) => {
      await trx.raw(
        `DROP TRIGGER IF EXISTS users_set_updated_at ON ${CHAT_BUDDY_SCHEMA}.${TABLES.USERS};`,
      );
      await trx.schema.dropTableIfExists(
        `${CHAT_BUDDY_SCHEMA}.${TABLES.USERS}`,
      );
      await trx.raw(`DROP TYPE IF EXISTS user_status;`);
    });
  } catch (err: any) {
    console.error('Error in knex Down::', err);
    throw err;
  }
}
