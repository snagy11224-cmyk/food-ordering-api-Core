import { Router } from "express";
import { authController } from "./controller/auth.controller";

export const authRouter = Router();

/**
 * @swagger
 * /api/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, phone, name, password]
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@email.com
 *               phone:
 *                 type: string
 *                 example: "01012345678"
 *               name:
 *                 type: string
 *                 example: Ahmed Mohamed
 *               password:
 *                 type: string
 *                 example: Password123!
 *               role:
 *                 type: string
 *                 example: customer
 *     responses:
 *       200:
 *         description: Registered successfully
 *       400:
 *         description: Validation error
 */
authRouter.post("/register", authController.register);

/**
 * @swagger
 * /api/login:
 *   post:
 *     summary: Login user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *                 example: owner@kfc.com
 *               password:
 *                 type: string
 *                 example: Password123!
 *     responses:
 *       200:
 *         description: Logged in successfully
 *       401:
 *         description: Invalid credentials
 */
authRouter.post("/login", authController.login);

/**
 * @swagger
 * /api/forget-password:
 *   post:
 *     summary: Send password reset OTP
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email]
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@email.com
 *     responses:
 *       200:
 *         description: OTP sent if email exists
 */
authRouter.post("/forget-password", authController.forgetPassword);

/**
 * @swagger
 * /api/reset-password:
 *   post:
 *     summary: Reset password using OTP
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, otp, newPassword]
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@email.com
 *               otp:
 *                 type: string
 *                 example: "123456"
 *               newPassword:
 *                 type: string
 *                 example: NewPass123!
 *     responses:
 *       200:
 *         description: Password reset successfully
 *       400:
 *         description: Invalid OTP
 */
authRouter.post("/reset-password", authController.resetPassword);

/**
 * @swagger
 * /api/refresh:
 *   post:
 *     summary: Refresh access token
 *     tags: [Authentication]
 *     description: Uses the refresh-token cookie to generate a new access token.
 *     responses:
 *       200:
 *         description: Access token refreshed successfully
 *       401:
 *         description: Missing or invalid refresh token
 */
authRouter.post("/refresh", authController.refreshToken);

/**
 * @swagger
 * /api/accept-invite:
 *   post:
 *     summary: Accept restaurant invite and set password
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, otp, newPassword]
 *             properties:
 *               email:
 *                 type: string
 *                 example: staff@email.com
 *               otp:
 *                 type: string
 *                 example: "123456"
 *               newPassword:
 *                 type: string
 *                 example: Staff123!
 *     responses:
 *       200:
 *         description: Invite accepted successfully
 *       400:
 *         description: Invalid OTP
 */
authRouter.post("/accept-invite", authController.acceptInvite);