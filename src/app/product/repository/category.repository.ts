import { db } from "../../../common/knex/knex";
import { ProductCategory } from "../entity/product-category.entity";

const CATEGORY_COLUMNS = [
  "id",
  "restaurant_id",
  "name",
  "created_at",
  "updated_at",
];

function toEntity(row: any): ProductCategory {
  return new ProductCategory({
    id: row.id,
    restaurantId: row.restaurant_id,
    name: row.name,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  });
}

export async function findCategoriesByRestaurant(
  restaurantId: number
): Promise<ProductCategory[]> {
  const rows = await db("product_categories")
    .select(CATEGORY_COLUMNS)
    .where("restaurant_id", restaurantId)
    .orderBy("name", "asc");

  return rows.map(toEntity);
}

export async function findCategoryByName(
  restaurantId: number,
  name: string
): Promise<ProductCategory | null> {
  const row = await db("product_categories")
    .select(CATEGORY_COLUMNS)
    .where({
      restaurant_id: restaurantId,
      name,
    })
    .first();

  return row ? toEntity(row) : null;
}


export async function createCategory(
  category: Partial<ProductCategory>
): Promise<ProductCategory> {
  const [row] = await db("product_categories")
    .insert({
      restaurant_id: category.restaurantId,
      name: category.name,
      created_at: category.createdAt,
      updated_at: category.updatedAt,
    })
    .returning(CATEGORY_COLUMNS);

  return toEntity(row);
}