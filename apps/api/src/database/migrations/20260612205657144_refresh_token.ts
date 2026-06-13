import { DB_CONSTANTS } from '@chat-buddy/shared';
import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  const { CHAT_BUDDY_SCHEMA, TABLES } = DB_CONSTANTS;
  try {
    await knex.transaction(async (trx: Knex) => {
      const does_tb_refresh_token_exists = await trx.schema
        .withSchema(CHAT_BUDDY_SCHEMA)
        .hasTable(TABLES.REFRESH_TOKENS);
      if (does_tb_refresh_token_exists) return;
      await trx.schema
        .withSchema(CHAT_BUDDY_SCHEMA)
        .createTable(TABLES.REFRESH_TOKENS, (tbl) => {
          tbl.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
          tbl.text('token_hash').notNullable();
          tbl
            .uuid('user_id')
            .notNullable()
            .references('id')
            .inTable(`${CHAT_BUDDY_SCHEMA}.${TABLES.USERS}`)
            .onDelete('CASCADE');
          tbl.timestamp('revoked_at', { useTz: true }).nullable();
          tbl.timestamp('expires_at', { useTz: true }).notNullable();
          tbl
            .timestamp('created_at', { useTz: true })
            .notNullable()
            .defaultTo(knex.fn.now());
        });
    });
  } catch (err: any) {
    console.error('Error in transaction', err);
    throw err;
  }
}

export async function down(knex: Knex): Promise<void> {
  try {
    await knex.transaction(async (trx: Knex) => {
      await trx.schema.dropTableIfExists('refresh_tokens');
    });
  } catch (err: any) {
    console.error('Error in transaction', err);
    throw err;
  }
}
