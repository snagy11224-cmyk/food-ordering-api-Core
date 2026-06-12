import { findUserById } from "../repository/users.repo"
import {userNotFoundError} from "../../user/errors"


export class UserService{
getByUserId = async (userId: number) => {
//find the user     
const user=await findUserById(userId);
if(!user){
    throw userNotFoundError;
}
//return data of the user
return {
    id:user.id,
    email:user.email,
    name:user.name,
    phone:user.phone,
    system:user.systemRole
}
}


}

export const userService=new UserService();