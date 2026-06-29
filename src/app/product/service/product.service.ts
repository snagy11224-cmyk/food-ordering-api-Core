import { findCategoriesByRestaurant } from "../repository/category.repository";

export class ProductService {

  findCategories = async (restaurantId: number) => {
    return await findCategoriesByRestaurant(restaurantId);
  };

}

export const productService = new ProductService();