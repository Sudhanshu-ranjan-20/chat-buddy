import {Knex } from 'knex';
export type TDbConfig = {
    client: TDbClient;
    connection: {
        host: string;
        user: string;
        password: string;
        database: string;
        ssl?: boolean;
        port?: number;
    }
    pool?: Knex.PoolConfig;
    migrations?:{
        tableName:string,
        extension?:string,
        directory?:string
    },
    seeds?:{
        extension?:string,
        directory?:string
    }
}

export type TDbClient = 'pg' | 'mysql' | 'sqlite3';
