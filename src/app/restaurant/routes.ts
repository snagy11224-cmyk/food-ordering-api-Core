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