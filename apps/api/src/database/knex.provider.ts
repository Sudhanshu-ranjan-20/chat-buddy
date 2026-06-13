import { Provider } from '@nestjs/common';
import { KNEX_CONNECTION } from './types';

import { Knex } from 'knex';
import { getDb } from '@chat-buddy/database';
import { Database } from './types';
export const knexProvider: Provider = {
  provide: KNEX_CONNECTION,
  useFactory: (): Knex<Database> | null => {
    const dbInstance = getDb();
    return dbInstance as Knex<Database>;
  },
};
