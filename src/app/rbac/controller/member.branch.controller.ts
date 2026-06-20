import { NextFunction, Request, Response } from "express";
import { validateBody } from "../../../common/validation/validate";
import {
  MemberBranchService,
  memberBranchService,
} from "../service/member.branch.service";
import { UpdateMemberBranchesDTO } from "../dto/member.branch.dto";

export class MemberBranchController {
  constructor(private readonly memberBranchService: MemberBranchService) {}

  updateMemberBranches = async (
    req: Request<{ restaurantId: string; memberId: string }>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const restaurantId = Number(req.params.restaurantId);
      const memberId = Number(req.params.memberId);
      // console.log("UpdateMemberBranchesDTO", UpdateMemberBranchesDTO);
      //console.log("BODY", req.body);
      const data = await validateBody(UpdateMemberBranchesDTO, req.body);

      const branchIds = await this.memberBranchService.updateMemberBranches(
        restaurantId,
        memberId,
        data.branchIds
      );

      res.status(200).json({
        message: "Member branches updated successfully",
        branchIds,
      });
    } catch (err) {
      next(err);
    }
  };
}

export const memberBranchController = new MemberBranchController(
  memberBranchService
);