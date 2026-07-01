import { db } from "../../../common/knex/knex";
import { ProductBranchDetails } from "../entity/product-branch-details.entity";

const PRODUCT_BRANCH_DETAILS_COLUMNS = [
  "id",
  "branch_id",
  "product_id",
  "price",
  "stock",
  "is_available",
  "created_at",
  "updated_at",
];

function toEntity(row: any): ProductBranchDetails {
  return new ProductBranchDetails({
    id: row.id,
    branchId: row.branch_id,
    productId: row.product_id,
    price: Number(row.price),
    stock: row.stock,
    isAvailable: row.is_available,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  });
}

export async function updateBranchDetails(
  branchId: number,
  productId: number,
  data: Partial<ProductBranchDetails>
): Promise<ProductBranchDetails | null> {
  const updateData: any = {
    updated_at: new Date(),
  };

  if (data.price !== undefined) updateData.price = data.price;
  if (data.stock !== undefined) updateData.stock = data.stock;
  if (data.isAvailable !== undefined) updateData.is_available = data.isAvailable;

  const [row] = await db("product_branch_details")
    .where("branch_id", branchId)
    .where("product_id", productId)
    .update(updateData)
    .returning(PRODUCT_BRANCH_DETAILS_COLUMNS);

  return row ? toEntity(row) : null;
}