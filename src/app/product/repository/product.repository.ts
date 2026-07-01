import { db } from "../../../common/knex/knex";
import { Product } from "../entity/product.entity";

const PRODUCT_COLUMNS = [
  "id",
  "restaurant_id",
  "category_id",
  "name",
  "description",
  "image_url",
  "deleted_at",
  "created_at",
  "updated_at",
];

function toEntity(row: any): Product {
  return new Product({
    id: row.id,
    restaurantId: row.restaurant_id,
    categoryId: row.category_id,
    name: row.name,
    description: row.description,
    imageUrl: row.image_url,
    deletedAt: row.deleted_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  });
}

export async function findProductsByBranch(branchId: number): Promise<any[]> {
  const rows = await db("products as p")
    .leftJoin("product_categories as c", "c.id", "p.category_id")
    .innerJoin("product_branch_details as bd", "bd.product_id", "p.id")
    .where("bd.branch_id", branchId)
    .whereNull("p.deleted_at")
    .select([
      "p.id",
      "p.name",
      "p.description",
      "p.image_url",
      "p.restaurant_id",
      "p.category_id",
      "c.name as category_name",
      "bd.price",
      "bd.stock",
      "bd.is_available",
    ])
    .orderBy("p.id", "asc");

  return rows;
}


export async function findProductsByRestaurant(
  restaurantId: number
): Promise<Product[]> {
  const rows = await db("products")
    .select(PRODUCT_COLUMNS)
    .where("restaurant_id", restaurantId)
    .whereNull("deleted_at")
    .orderBy("id", "asc");

  return rows.map(toEntity);
}


export async function findProductById(
  productId: number
): Promise<Product | null> {
  const row = await db("products")
    .select(PRODUCT_COLUMNS)
    .where("id", productId)
    .whereNull("deleted_at")
    .first();

  return row ? toEntity(row) : null;
}


export async function createProduct(
  product: Partial<Product>
): Promise<Product> {
  const [row] = await db("products")
    .insert({
      restaurant_id: product.restaurantId,
      category_id: product.categoryId,
      name: product.name,
      description: product.description,
      image_url: product.imageUrl,
      created_at: product.createdAt,
      updated_at: product.updatedAt,
    })
    .returning(PRODUCT_COLUMNS);

  return toEntity(row);
}


export async function updateProduct(
  productId: number,
  data: Partial<Product>
): Promise<Product> {
  const updateData: any = {
    updated_at: new Date(),
  };

  if (data.name !== undefined) updateData.name = data.name;
  if (data.description !== undefined) updateData.description = data.description;
  if (data.imageUrl !== undefined) updateData.image_url = data.imageUrl;
  if (data.categoryId !== undefined) updateData.category_id = data.categoryId;

  const [row] = await db("products")
    .where("id", productId)
    .whereNull("deleted_at")
    .update(updateData)
    .returning(PRODUCT_COLUMNS);

  return toEntity(row);
}