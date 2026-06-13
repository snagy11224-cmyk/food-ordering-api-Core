import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.raw(`
    ALTER TABLE customer_addresses
    ADD COLUMN created_at timestamptz NOT NULL DEFAULT NOW(),
    ADD COLUMN updated_at timestamptz NOT NULL DEFAULT NOW();
  `);

}


export async function down(knex: Knex): Promise<void> {
 await knex.raw(`
    ALTER TABLE customer_addresses
    DROP COLUMN updated_at,
    DROP COLUMN created_at;
  `);
}

