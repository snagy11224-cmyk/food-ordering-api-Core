import { env } from '../../../common/config/env';
import { NextFunction, Request, Response } from 'express';
import { authService, AuthService } from './../service/auth.service';
import { validateBody } from '../../../common/validation/validate';
import { forgetPasswordDTO, loginDto, registerDto, resetPasswordDTO } from '../dto/auth.dto';
import {setAccessTokenCookie, setRefreshTokenCookie} from '../../../common/cookies/auth.cookies'
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
        //set cookie in the res headers
        setAccessTokenCookie(res, env.jwt.accessSecret);
        setRefreshTokenCookie(res, env.jwt.refreshSecret); 

        res.status(201).json(result);

    } catch (err) {
      next(err);
    }
  };

  login = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
        //1-validate request body
        const data= await validateBody(loginDto,req.body);
        //2-call service
        const result=await this.authService.login(data);

        
        //set cookie in the res 
        setAccessTokenCookie(res, env.jwt.accessSecret);
        setRefreshTokenCookie(res, env.jwt.refreshSecret);

        //3-respond
        res.status(200).json(result);

    } catch (err) {
      next(err);
    }
  };



  forgetPassword = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
try{
//validate body
const data=await validateBody(forgetPasswordDTO,req.body);
await this.authService.forgetPassword(data);
res.status(200).json(
    {"message":"Email Reset with OTP"}
)
}catch (err) {
      next(err);
    }

  };



 resetPassword = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
try{
//validate body
const data=await validateBody(resetPasswordDTO,req.body);
await this.authService.resetPassword(data);
res.status(200).json(
    {"message":"password reset successfully, please login again"}
)
}catch (err) {
      next(err);
    }

  };

  //refresh token endpoint

}
export const authController=new AuthController(authService);