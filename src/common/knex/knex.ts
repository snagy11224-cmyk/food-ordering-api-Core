import knex from "knex";
import type { Knex } from "knex";
import { env } from "../config/env.js";

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
    directory: "./src/migrations",
    extension: "ts",
  },
};

export const db = knex(config);

export async function pingDB() {
  await db.raw("SELECT 1");
  console.log("Database connection successful!");
}