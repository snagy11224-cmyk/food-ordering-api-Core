import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void>{
await knex.raw(`
CREATE TABLE restaurants (
    id SERIAL PRIMARY KEY,
    owner_id BIGINT NOT NULL,
    name text NOT NULL,
    status  text NOT NULL check(status in('active','disabled','suspended','pending')),
    logo_url text NOT NULL ,
    primary_country text not null,
    created_at timestamp not null,
    updated_at timestamp NOT NULL,
    status_updated_at timestamp,

    constraint fk_restaurants_owner_id foreign key (owner_id) references users(id) 
);

   create index idx_restaurants_owner_id on restaurants(owner_id);
   create index idx_restaurants_primary_country on restaurants(primary_country);
   create index idx_restaurants_status on restaurants(status);
   create index idx_created_at on restaurants(created_at);


`)
}


export async function down(knex: Knex): Promise<void> {

    await knex.raw(`
        drop table restaurants;
        
        `)
}

