import { findCategoriesByRestaurant } from "../repository/category.repository";
import { findProductsByBranch } from "../repository/product.repository";

export class ProductService {

  findCategories = async (restaurantId: number) => {
    return await findCategoriesByRestaurant(restaurantId);
  };

  findByBranch = async (branchId: number) => {
  return await findProductsByBranch(branchId);
};



}

export const productService = new ProductService();