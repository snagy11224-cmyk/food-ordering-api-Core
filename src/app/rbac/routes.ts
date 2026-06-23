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
