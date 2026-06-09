import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    // to add migrations
await knex.raw(
`CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email text unique NOT NULL,
    phone text NOT NULL unique,
    name text NOT NULL,
    password_hash text NOT NULL,
    system_role text NOT NULL check (system_role in ('system_admin', 'delivery_agent',  'customer', 'restaurant_user')),
    created_at timestamp NOT NULL DEFAULT now(),
    updated_at timestamp NOT NULL now(),
    deleted_at timestamp 
);

create index idx_users_email on users(email);
create index idx_users_roles on users(system_role);


`)

}


export async function down(knex: Knex): Promise<void> {
    //to revert the migration

    await knex.raw(`
    DROP TABLE users;
    `)

}

