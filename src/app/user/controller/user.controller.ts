import { updateUserDTO } from "../dto/user.dto";
import { UserService, userService } from "../service/user.service";
import { NextFunction, Request, Response } from 'express';
import { validateBody } from '../../../common/validation/validate';

export class UserController {
constructor(private readonly userService: UserService){
};

//get me 
getMe =async(
    req: Request,
    res: Response,
    next: NextFunction
)=>{
try{
    const user=await this.userService.getByUserId(req.user?.userId!);
    return res.status(200).json(user);
}
catch(err){
next(err);
}
} 

//update user
updateUserData =async(
    req: Request,
    res: Response,
    next: NextFunction
)=>{
try{
    //validate body 
    const data=await validateBody(updateUserDTO,req.body);
    //if body is empty return empty data error
    const userId = req.user!.userId;
    const result = await this.userService.updateUserDataById(userId,data);
    return res.status(200).json(result);
}
catch(err){
next(err);
}
} 


}

export const userController=new UserController(userService);