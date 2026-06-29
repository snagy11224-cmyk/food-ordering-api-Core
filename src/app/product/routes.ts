import { Router } from "express";
import { productController } from "./controller/product.controller";

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