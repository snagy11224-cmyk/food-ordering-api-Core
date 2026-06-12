import config from "./knexFile.js";
import knex from "knex";

export const db = knex(config);

/*export async function pingDB() {
  await db.raw("SELECT 1");
  console.log("Database connection successful!");
}*/

export async function pingDB() {
  const result = await db.raw("SELECT current_user, current_database()");
  console.log(result.rows);
} 