import { Router } from "express";
import { authenticate } from "../../common/auth/guard";
import { memberController } from "./controller/member.controller";
import { memberBranchController } from "./controller/member.branch.controller";
export const rbacRouter= Router();

rbacRouter.post('/restaurants/:restaurantId/members',authenticate,memberController.createMember);
rbacRouter.put(
  "/restaurants/:restaurantId/members/:memberId/branches",authenticate,memberBranchController.updateMemberBranches
);
