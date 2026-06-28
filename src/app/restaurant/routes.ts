import { Router } from "express";
import { restaurantController } from "./controller/restaurant.controller";
import { authenticate } from "../../common/auth/guard";

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
 * /api/restaurant/{id}:
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



/**
 * @swagger
 * /api/restaurant:
 *   post:
 *     summary: Create restaurant with owner
 *     description: System admin creates a new restaurant and its owner user.
 *     tags: [Restaurants]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - owner
 *               - name
 *               - primaryCountry
 *             properties:
 *               owner:
 *                 type: object
 *                 required:
 *                   - email
 *                   - phone
 *                   - name
 *                   - password
 *                 properties:
 *                   email:
 *                     type: string
 *                     example: owner@test.com
 *                   phone:
 *                     type: string
 *                     example: "01000000000"
 *                   name:
 *                     type: string
 *                     example: Restaurant Owner
 *                   password:
 *                     type: string
 *                     example: "123456"
 *               name:
 *                 type: string
 *                 example: KFC
 *               logoUrl:
 *                 type: string
 *                 example: https://example.com/logo.png
 *               primaryCountry:
 *                 type: string
 *                 example: EG
 *     responses:
 *       201:
 *         description: Restaurant created successfully
 *       400:
 *         description: Validation error or user already exists
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Permission denied
 */
restaurantRouter.post(
  "/",
  authenticate,
  restaurantController.create
);



/**
 * @swagger
 * /api/restaurant/{id}:
 *   patch:
 *     summary: Update restaurant
 *     description: Restaurant owner or system admin updates restaurant profile data.
 *     tags: [Restaurants]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: New Restaurant Name
 *               logoUrl:
 *                 type: string
 *                 example: https://example.com/new-logo.png
 *               primaryCountry:
 *                 type: string
 *                 example: EG
 *     responses:
 *       200:
 *         description: Restaurant updated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Permission denied
 *       404:
 *         description: Restaurant not found
 */
restaurantRouter.patch(
  "/:id",
  authenticate,
  restaurantController.update
);


/**
 * @swagger
 * /api/restaurant/{id}/status:
 *   patch:
 *     summary: Update restaurant status
 *     description: System admin updates restaurant status.
 *     tags: [Restaurants]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [active, suspended, disabled, pending]
 *                 example: active
 *     responses:
 *       200:
 *         description: Restaurant status updated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Permission denied
 *       404:
 *         description: Restaurant not found
 */
restaurantRouter.patch(
  "/:id/status",
  authenticate,
  restaurantController.updateStatus
);