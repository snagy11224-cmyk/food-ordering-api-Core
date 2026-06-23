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