import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
await knex.raw(`
CREATE TABLE customer_addresses (
    id SERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    address_line1 text NOT NULL,
    label text NOT NULL,
    country text NOT NULL,
    city text NOT NULL,
    street text NOT NULL,
    building text , 
    apartment_number text,
    type text NOT NULL check (type in ('home', 'office', 'public')),
    lat decimal(10, 7) NOT NULL,
    lng decimal(11, 7) NOT NULL,
    is_default boolean NOT NULL 

    constraint fk_customer_addresses_user_id foreign key (user_id) references users(id));



create index idx_customer_addresses_user_id on customer_addresses(user_id);
`)
}


export async function down(knex: Knex): Promise<void> {
    await knex.raw(`
    DROP TABLE customer_addresses;
    `)
}

