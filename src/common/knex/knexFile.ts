import knex from "knex";
import type { Knex } from "knex";
import { env } from "../config/env";
const config: Knex.Config = {
  client: "pg",
  connection: {
    host: env.db.host,
    port: Number(env.db.port),
    user: env.db.user,
    password: env.db.password,
    database: env.db.name,
  },
  pool: {
    min: 2,
    max: env.db.poolMax,
  },
  migrations: {
    directory: env.db.migrationsDir,
    extension: env.db.migrationExtension,
  },
}

export default config;