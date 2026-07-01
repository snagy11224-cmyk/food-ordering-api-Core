import { findCategoriesByRestaurant } from "../repository/category.repository";
import { findProductsByBranch } from "../repository/product.repository";
import { findRestaurantById } from "../../restaurant/repository/restaurant.repo";
import { SystemRole } from "../../user/enums";
import { UserUnauthorizedError } from "../../auth/errors";
import { findProductsByRestaurant } from "../repository/product.repository";
import { RestaurantNotFoundError } from "../../restaurant/error";
import { findProductById } from "../repository/product.repository";
import { productNotFoundError } from "../errors";
import {createCategory, findCategoryByName } from "../repository/category.repository";
import { createProduct } from "../repository/product.repository";
import { CreateProductDTO } from "../dto/product.dto";
import { Product } from "../entity/product.entity";

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

findById = async (productId: number) => {
  const product = await findProductById(productId);

  if (!product) {
    throw productNotFoundError;
  }

  return product;
}; 



create = async (
  restaurantId: number,
  userId: number,
  userRole: SystemRole,
  data: CreateProductDTO
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

  let categoryId: number | null = null;

  if (data.categoryName) {
    let category = await findCategoryByName(
      restaurantId,
      data.categoryName
    );

    if (!category) {
      category = await createCategory({
        restaurantId,
        name: data.categoryName,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    categoryId = category.id;
  }

  const now = new Date();

  const product = await createProduct({
    restaurantId,
    categoryId,
    name: data.name,
    description: data.description,
    imageUrl: data.imageUrl,
    createdAt: now,
    updatedAt: now,
  });

  return {
    message: "Product created successfully",
    product,
  };
};



}

export const productService = new ProductService();