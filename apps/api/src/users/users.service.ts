import { UserRow, DB_CONSTANTS } from '@chat-buddy/shared';
import { Inject, Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { Database, KNEX_CONNECTION } from 'src/database/types';
import { CreateUserInput } from './types/user.types';

@Injectable()
export class UsersService {
  constructor(@Inject(KNEX_CONNECTION) private readonly knex: Knex<Database>) {}

  async findById(id: string): Promise<UserRow | undefined> {
    try {
      console.info(`UserService.findById called for - ${id}`);
      return this.knex<UserRow>(DB_CONSTANTS.TABLES.USERS)
        .withSchema(DB_CONSTANTS.CHAT_BUDDY_SCHEMA)
        .where({ id })
        .first();
    } catch (error) {
      console.error('Error in UserService.findById ');
      throw error;
    }
  }
  async findByEmail(email: string): Promise<UserRow | undefined> {
    try {
      console.info(`UserService.findByEmail called for - ${email}`);
      return this.knex<UserRow>(DB_CONSTANTS.TABLES.USERS)
        .withSchema(DB_CONSTANTS.CHAT_BUDDY_SCHEMA)
        .where({ email: email.toLowerCase() })
        .first();
    } catch (error) {
      console.error('Error in UserService.findByEmail ');
      throw error;
    }
  }
  async findByUsername(username: string): Promise<UserRow | undefined> {
    try {
      console.info(`UserService.findByUsername called for - ${username}`);
      return this.knex<UserRow>(DB_CONSTANTS.TABLES.USERS)
        .withSchema(DB_CONSTANTS.CHAT_BUDDY_SCHEMA)
        .where({ username })
        .first();
    } catch (error) {
      console.error('Error in UserService.findByUsername ');
      throw error;
    }
  }
  async findByEmailOrUsername(
    identifier: string,
  ): Promise<UserRow | undefined> {
    try {
      console.info(`UserService.findByUsername called for - ${identifier}`);
      const normalizedValue = identifier.toLowerCase();
      return this.knex<UserRow>(DB_CONSTANTS.TABLES.USERS)
        .withSchema(DB_CONSTANTS.CHAT_BUDDY_SCHEMA)
        .where({ email: normalizedValue })
        .orWhere({ username: normalizedValue })
        .first();
    } catch (error) {
      console.error('Error in UserService.findByEmailOrUsername ');
      throw error;
    }
  }
  async createUser(input: CreateUserInput): Promise<UserRow | undefined> {
    try {
      console.info(`UserService.createUser called`);
      const [user] = await this.knex<UserRow>(DB_CONSTANTS.TABLES.USERS)
        .withSchema(DB_CONSTANTS.CHAT_BUDDY_SCHEMA)
        .insert(input)
        .returning('*');
      return user;
    } catch (error) {
      console.error('Error in UserService.findById ');
      throw error;
    }
  }
}
