import { Router } from "express";
import { branchController } from "./controller/branch.controller";
import { authenticate } from "../../common/auth/guard";

export const branchRouter = Router();

/**
 * @swagger
 * /api/branches/nearby:
 *   get:
 *     summary: Find nearby branches
 *     tags: [Branches]
 *     parameters:
 *       - in: query
 *         name: latitude
 *         required: true
 *         schema:
 *           type: number
 *         example: 30.0444
 *       - in: query
 *         name: longitude
 *         required: true
 *         schema:
 *           type: number
 *         example: 31.2357
 *     responses:
 *       200:
 *         description: Nearby branches found successfully
 *       400:
 *         description: Invalid coordinates
 */
branchRouter.get(
  "/branches/nearby",
  branchController.findNearby
);

/**
 * @swagger
 * /api/restaurants/{restaurantId}/branches:
 *   post:
 *     summary: Create a new restaurant branch
 *     tags: [Branches]
 *     parameters:
 *       - in: path
 *         name: restaurantId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       201:
 *         description: Branch created successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Permission denied
 */
branchRouter.post(
  "/restaurants/:restaurantId/branches",
  authenticate,
  branchController.create
);

/**
 * @swagger
 * /api/restaurants/{restaurantId}/branches:
 *   get:
 *     summary: Get all branches for a restaurant
 *     description: Returns all branches belonging to a specific restaurant.
 *     tags: [Branches]
 *     parameters:
 *       - in: path
 *         name: restaurantId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Branches retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *       404:
 *         description: Restaurant not found
 */
branchRouter.get(
  "/restaurants/:restaurantId/branches",
  branchController.findByRestaurant
);


/**
 * @swagger
 * /api/branches/{id}:
 *   patch:
 *     summary: Update branch
 *     description: Restaurant owner or system admin updates branch details.
 *     tags: [Branches]
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
 *               label:
 *                 type: string
 *               addressText:
 *                 type: string
 *               lat:
 *                 type: number
 *               lng:
 *                 type: number
 *               opensAt:
 *                 type: string
 *               closesAt:
 *                 type: string
 *               deliveryRadius:
 *                 type: number
 *               currency:
 *                 type: string
 *               acceptOrders:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Branch updated successfully
 */
branchRouter.patch(
  "/branches/:id",
  authenticate,
  branchController.update
);


/**
 * @swagger
 * /api/branches/{id}/status:
 *   patch:
 *     summary: Update branch status
 *     description: System admin updates branch active status and commission.
 *     tags: [Branches]
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
 *               isActive:
 *                 type: boolean
 *                 example: true
 *               commission:
 *                 type: number
 *                 example: 15
 *     responses:
 *       200:
 *         description: Branch status updated successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Permission denied
 *       404:
 *         description: Branch not found
 */
branchRouter.patch(
  "/branches/:id/status",
  authenticate,
  branchController.updateStatus
);