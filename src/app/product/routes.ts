import { Router } from "express";
import { productController } from "./controller/product.controller";
import { authenticate } from "../../common/auth/guard";

export const productRouter = Router();

/**
 * @swagger
 * /api/restaurants/{restaurantId}/categories:
 *   get:
 *     summary: Get restaurant categories
 *     description: Returns all categories for a restaurant.
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: restaurantId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Categories retrieved successfully
 */
productRouter.get(
  "/restaurants/:restaurantId/categories",
  productController.findCategories
);



/**
 * @swagger
 * /api/branches/{branchId}/products:
 *   get:
 *     summary: Get products by branch
 *     description: Returns products with branch-level price, stock, and availability.
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: branchId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Products retrieved successfully
 */
productRouter.get(
  "/branches/:branchId/products",
  productController.findByBranch
);


/**
 * @swagger
 * /api/restaurants/{restaurantId}/products:
 *   get:
 *     summary: Get restaurant products
 *     description: Restaurant owner or system admin gets products for management.
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: restaurantId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Products retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Permission denied
 *       404:
 *         description: Restaurant not found
 */
productRouter.get(
  "/restaurants/:restaurantId/products",
  authenticate,
  productController.findByRestaurant
);