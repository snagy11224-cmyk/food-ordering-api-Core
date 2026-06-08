import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
await knex.raw(`
CREATE TABLE password_resets (
    id SERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL references users(id) on delete cascade,
    otp_hash text NOT NULL,
    expires_at timestamp NOT NULL,
    consumed_at timestamp not null,
    created_at timestamp not null,
    constraint fk_password_resets_user_id foreign key (user_id) references users(id) 
);

create index idx_password_resets_user_id on password_resets(user_id);
`)
}


export async function down(knex: Knex): Promise<void> {
    await knex.raw(`
    DROP TABLE password_resets;
    `)
}

