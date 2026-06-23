import { Router } from "express";
import { userController } from "./controller/user.controller";
import { authenticate } from "../../common/auth/guard";

export const userRouter = Router();

/**
 * @swagger
 * /api/me:
 *   get:
 *     summary: Get current authenticated user
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: User profile returned successfully
 *       401:
 *         description: Unauthorized
 */
userRouter.get(
  "/me",
  authenticate,
  userController.getMe
);

/**
 * @swagger
 * /api/me:
 *   patch:
 *     summary: Update current authenticated user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Ahmed Mohamed
 *               phone:
 *                 type: string
 *                 example: "01012345678"
 *     responses:
 *       200:
 *         description: User updated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */
userRouter.patch(
  "/me",
  authenticate,
  userController.updateUserData
);