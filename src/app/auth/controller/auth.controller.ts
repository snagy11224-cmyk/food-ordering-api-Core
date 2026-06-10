import { NextFunction, Request, Response } from 'express';
import { authService, AuthService } from './../service/auth.service';
import { validateBody } from '../../../common/validation/validate';
import { registerDto } from '../dto/auth.dto';

export class AuthController {
  constructor(
    private readonly authService: AuthService
  ) {}

  register = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
        //1-validate request body
        const data= await validateBody(registerDto,req.body);
        //2-call service
        const result=await this.authService.register(data);
        //3-respond
        res.status(201).json(result);

    } catch (err) {
      next(err);
    }
  };
}
export const authController=new AuthController(authService);