/**
 * @swagger
 * /api/restaurants/{restaurantId}/members:
 *   post:
 *     summary: Create restaurant member
 *     tags:
 *       - Members
 *     parameters:
 *       - in: path
 *         name: restaurantId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Member created successfully
 *       403:
 *         description: Permission denied
 */

/**
 * @swagger
 * /api/restaurants/{restaurantId}/members/{memberId}/branches:
 *   put:
 *     summary: Update member branches
 *     tags:
 *       - Members
 *     parameters:
 *       - in: path
 *         name: restaurantId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: memberId
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
 *               branchIds:
 *                 type: array
 *                 items:
 *                   type: integer
 *             example:
 *               branchIds: [1, 2]
 *     responses:
 *       200:
 *         description: Member branches updated successfully
 *       403:
 *         description: Permission denied
 *       404:
 *         description: Member not found
 */


import { Router } from "express";
import { authenticate } from "../../common/auth/guard";
import { memberController } from "./controller/member.controller";
import { memberBranchController } from "./controller/member.branch.controller";
import { rbac, requireRestaurantMember } from "../../common/auth/rbac";
export const rbacRouter= Router();

rbacRouter.post('/restaurants/:restaurantId/members',
    authenticate,
    requireRestaurantMember('restaurantId'),
    rbac({resource:'core:member' , action:'create'}),
    memberController.createMember);


rbacRouter.put(
  "/restaurants/:restaurantId/members/:memberId/branches",
  authenticate,
  requireRestaurantMember('restaurantId'),
  rbac({resource:'core:member' , action:'create'}),
  memberBranchController.updateMemberBranches
);
