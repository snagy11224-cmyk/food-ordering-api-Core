import { NextFunction, Request, Response } from "express";
import { validateBody } from "../../../common/validation/validate";
import { MemberService, memberService } from "../service/member.service";
import { CreateRestaurantMemberDTO } from "../dto/restaurant.member.dto";

export class MemberController {
  constructor(private readonly memberService: MemberService) {}

  createMember = async (
    req: Request<{ restaurantId: string }>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const restaurantId = Number(req.params.restaurantId);
      //console.log("CreateRestaurantMemberDTO", CreateRestaurantMemberDTO);
      const data = await validateBody(CreateRestaurantMemberDTO, req.body);

      await this.memberService.createMember(restaurantId, data);

      res.status(201).json({
        message: "Member created successfully",
      });
    } catch (err) {
      next(err);
    }
  };
}

export const memberController = new MemberController(memberService);