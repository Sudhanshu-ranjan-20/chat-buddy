import { Global, Module, OnApplicationShutdown } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { Knex } from 'knex';
import { knexProvider } from './knex.provider';
import { KNEX_CONNECTION } from './types';

@Global()
@Module({
  providers: [knexProvider],
  exports: [KNEX_CONNECTION],
})
export class DatabaseModule implements OnApplicationShutdown {
  constructor(private readonly moduleRef: ModuleRef) {}
  async onApplicationShutdown() {
    const knex = this.moduleRef.get<Knex>(KNEX_CONNECTION, {
      strict: false,
    });
    if (knex) await knex.destroy();
  }
}
