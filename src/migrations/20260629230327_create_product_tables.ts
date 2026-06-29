import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    
  await knex.raw(`
    CREATE TABLE product_categories (
      id BIGSERIAL PRIMARY KEY,

      restaurant_id BIGINT NOT NULL
        REFERENCES restaurants(id) ON DELETE CASCADE,

      name VARCHAR(255) NOT NULL,

      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

      CONSTRAINT uq_product_categories_restaurant_name
        UNIQUE (restaurant_id, name)
    );
  `);

  await knex.raw(`
    CREATE TABLE products (
      id BIGSERIAL PRIMARY KEY,

      restaurant_id BIGINT NOT NULL
        REFERENCES restaurants(id) ON DELETE CASCADE,

      category_id BIGINT
        REFERENCES product_categories(id)
        ON DELETE SET NULL,

      name VARCHAR(255) NOT NULL,
      description TEXT,
      image_url TEXT,

      deleted_at TIMESTAMPTZ,

      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);

  await knex.raw(`
    CREATE TABLE product_branch_details (
      id BIGSERIAL PRIMARY KEY,

      branch_id BIGINT NOT NULL
        REFERENCES restaurant_branches(id)
        ON DELETE CASCADE,

      product_id BIGINT NOT NULL
        REFERENCES products(id)
        ON DELETE CASCADE,

      price NUMERIC(10,2) NOT NULL DEFAULT 0,
      stock INTEGER NOT NULL DEFAULT 0,
      is_available BOOLEAN NOT NULL DEFAULT FALSE,

      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

      CONSTRAINT uq_product_branch
        UNIQUE(branch_id, product_id)
    );
  `);

  await knex.raw(`
    CREATE OR REPLACE FUNCTION create_product_branch_details()
    RETURNS TRIGGER
    AS $$
    BEGIN
      INSERT INTO product_branch_details (
        branch_id,
        product_id,
        price,
        stock,
        is_available,
        created_at,
        updated_at
      )
      SELECT
        rb.id,
        NEW.id,
        0,
        0,
        FALSE,
        NOW(),
        NOW()
      FROM restaurant_branches rb
      WHERE rb.restaurant_id = NEW.restaurant_id;

      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;
  `);

  await knex.raw(`
    CREATE TRIGGER trg_product_after_insert
    AFTER INSERT ON products
    FOR EACH ROW
    EXECUTE FUNCTION create_product_branch_details();
  `);

await knex.raw(`
CREATE INDEX idx_product_categories_restaurant
ON product_categories (restaurant_id);
  `); 
await knex.raw(`
CREATE INDEX idx_products_restaurant
ON products (restaurant_id);
  `); 

  await knex.raw(`
CREATE INDEX idx_products_category
ON products (category_id);  `); 

await knex.raw(`
CREATE INDEX idx_product_branch_details_branch
ON product_branch_details (branch_id);  `); 

await knex.raw(`
CREATE INDEX idx_product_branch_details_product
ON product_branch_details (product_id);  `); 

await knex.raw(`
CREATE INDEX idx_branch_product
ON product_branch_details(branch_id, product_id);
`); 

}


export async function down(knex: Knex): Promise<void> {
 await knex.raw(`
    DROP TRIGGER IF EXISTS trg_product_after_insert
    ON products;
  `);

  await knex.raw(`
    DROP FUNCTION IF EXISTS create_product_branch_details();
  `);

  await knex.raw(`
    DROP TABLE IF EXISTS product_branch_details;
  `);

  await knex.raw(`
    DROP TABLE IF EXISTS products;
  `);

  await knex.raw(`
    DROP TABLE IF EXISTS product_categories;
  `);

await knex.raw(`DROP INDEX IF EXISTS idx_product_branch_details_product;`);
await knex.raw(`DROP INDEX IF EXISTS idx_product_branch_details_branch;`);

await knex.raw(`DROP INDEX IF EXISTS idx_products_category;`);
await knex.raw(`DROP INDEX IF EXISTS idx_products_restaurant;`);

await knex.raw(`DROP INDEX IF EXISTS idx_product_categories_restaurant;`);

}

