import { findCategoriesByRestaurant } from "../repository/category.repository";
import { findProductsByBranch } from "../repository/product.repository";
import { findRestaurantById } from "../../restaurant/repository/restaurant.repo";
import { SystemRole } from "../../user/enums";
import { UserUnauthorizedError } from "../../auth/errors";
import { findProductsByRestaurant } from "../repository/product.repository";
import { RestaurantNotFoundError } from "../../restaurant/error";

export class ProductService {

  findCategories = async (restaurantId: number) => {
    return await findCategoriesByRestaurant(restaurantId);
  };

  findByBranch = async (branchId: number) => {
  return await findProductsByBranch(branchId);
};


findByRestaurant = async (
  restaurantId: number,
  userId: number,
  userRole: SystemRole
) => {
  const restaurant = await findRestaurantById(restaurantId);

  if (!restaurant) {
    throw RestaurantNotFoundError;
  }

  const isAdmin = userRole === SystemRole.SYSTEM_ADMIN;
  const isOwner = Number(restaurant.ownerId) === Number(userId);

  if (!isAdmin && !isOwner) {
    throw UserUnauthorizedError;
  }

  return await findProductsByRestaurant(restaurantId);
};


}

export const productService = new ProductService();