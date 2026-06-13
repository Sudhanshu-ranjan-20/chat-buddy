import { RefreshTokenRow, UserRow } from '@chat-buddy/shared';
import { Knex } from 'knex';

export interface Database {
  users: Knex.CompositeTableType<
    UserRow,
    Omit<UserRow, 'id' | 'created_at' | 'updated_at'>,
    Partial<Omit<UserRow, 'id'>>
  >;

  refresh_tokens: Knex.CompositeTableType<
    RefreshTokenRow,
    Omit<RefreshTokenRow, 'id' | 'created_at' | 'updated_at'>,
    Partial<Omit<RefreshTokenRow, 'id'>>
  >;
}
export const KNEX_CONNECTION = Symbol('KNEX_CONNECTION');
