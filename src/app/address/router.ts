import { Router } from "express";
import { addressController } from "../address/controller/address.controller";
import { authenticate } from "../../common/auth/guard";

export const addressRouter = Router();

/**
 * @swagger
 * /api/addresses:
 *   get:
 *     summary: Get customer addresses
 *     tags: [Addresses]
 *     responses:
 *       200:
 *         description: List of customer addresses
 *       401:
 *         description: Unauthorized
 */
addressRouter.get(
  "/addresses",
  authenticate,
  addressController.getCustomerAddress
);

/**
 * @swagger
 * /api/addresses:
 *   post:
 *     summary: Add new customer address
 *     tags: [Addresses]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               city:
 *                 type: string
 *                 example: Cairo
 *               street:
 *                 type: string
 *                 example: Nasr City
 *               building:
 *                 type: string
 *                 example: Building 10
 *               floor:
 *                 type: string
 *                 example: 3
 *               apartment:
 *                 type: string
 *                 example: 12
 *     responses:
 *       201:
 *         description: Address created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */
addressRouter.post(
  "/addresses",
  authenticate,
  addressController.addCustomerAddress
);

/**
 * @swagger
 * /api/addresses/{addressId}:
 *   patch:
 *     summary: Update customer address
 *     tags: [Addresses]
 *     parameters:
 *       - in: path
 *         name: addressId
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
 *       200:
 *         description: Address updated successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Address not found
 */
addressRouter.patch(
  "/addresses/:addressId",
  authenticate,
  addressController.updateCustomerAddress
);

/**
 * @swagger
 * /api/addresses/{addressId}:
 *   delete:
 *     summary: Delete customer address
 *     tags: [Addresses]
 *     parameters:
 *       - in: path
 *         name: addressId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Address deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Address not found
 */
addressRouter.delete(
  "/addresses/:addressId",
  authenticate,
  addressController.deleteCustomerAddress
);