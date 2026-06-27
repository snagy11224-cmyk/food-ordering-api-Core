import { Router } from "express";
import { restaurantController } from "./controller/restaurant.controller";

export const restaurantRouter = Router();

/**
 * @swagger
 * /api/restaurants:
 *   get:
 *     summary: Get all restaurants
 *     description: Returns a list of all restaurants.
 *     tags: [Restaurants]
 *     responses:
 *       200:
 *         description: Restaurants retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 */
restaurantRouter.get(
  "/",
  restaurantController.getAll
);


/**
 * @swagger
 * /api/restaurants/{id}:
 *   get:
 *     summary: Get restaurant by id
 *     description: Returns a single restaurant.
 *     tags: [Restaurants]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Restaurant retrieved successfully
 *       404:
 *         description: Restaurant not found
 */
restaurantRouter.get(
  "/:id",
  restaurantController.getById
);