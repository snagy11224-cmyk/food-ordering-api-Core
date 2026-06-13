import { findUserById ,updateUserData,findUserByPhone } from "../repository/users.repo"
import {userNotFoundError,emptyUpdateBodyError,mobileNumberAlreadyExists} from "../../user/errors"

type UpdateUserData = {
  name?: string;
  phone?: string;
};

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
    systemRole:user.systemRole
}
}

updateUserDataById = async (userId: number,data: UpdateUserData) => {
//check if user exists
const user=await findUserById(userId);
if(!user){
    throw userNotFoundError;
}
//check if body is empty 
if (!data.name && !data.phone) {
  throw emptyUpdateBodyError;
}

//if phone number there, check if it is already in our DB
  if (data.phone) {
    const existingUser = await findUserByPhone(data.phone);
    if (existingUser && existingUser.id !== userId) {
      throw mobileNumberAlreadyExists;
    }
  }
//if  its unique - update user data
  const updatedUser = await updateUserData(userId, data);
  return {
    message: "Profile updated",
    user: {
    id: updatedUser.id,
    email: updatedUser.email,
    phone: updatedUser.phone,
    name: updatedUser.name,
    systemRole: updatedUser.systemRole,
  },
  };

}


}

export const userService=new UserService();