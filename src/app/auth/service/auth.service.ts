import { forgetPasswordDTO, loginDto, registerDto, resetPasswordDTO } from "../dto/auth.dto";
import {
  findUserExistsByEmailOrPhone,
  createUser,
  findUserByEmail,
  updateUserPassword,
} from "../../user/repository/users.repo";
import {
    paswordMismatchError,
  userAlreadyExistsError,
  cantSignUPAsSystemAdmin,
  incorrectCredentialsError,
  invalidOTPError,
  restaurantDataRequiredError
} from "../errors";
import {
  comparePasswords,
  createAccessToken,
  createRefreshToken,
  generateOTP,
  hashOTP,
  hashPassword,
  verifyRefreshToken
} from "../utils";
import { SystemRole } from "../../user/enums";
import { activateMemberByUserId, createPasswordReset, findLatestPasswordResetByUserId, updatePasswordResetConsumedAt } from "../repository/repo.pasword.reset";
import { RestaurantService, restaurantService } from "../../restaurant/service/restaurant.service";
import { Restaurant } from "../../restaurant/entity/restaurant.entity";
import { db } from "../../../common/knex/knex";
import { findRestaurantMemberWithRole } from "../../rbac/repository/restaurant.member.repository";
import { findBranchIdsByMemberId } from "../../rbac/repository/member.branch.repo";
import { memberIdNotFound } from "../../rbac/errors";


/*type LoginResponse ={

}*/

type RegisterResponse = {
  message: string;  
  accessToken: string;
  refreshToken: string;
  user: {
    id: number;
    email: string;
    phone: string;
    systemRole: SystemRole;
    createdAt:Date; 
  };
   restaurant?: Restaurant;
};

export class AuthService {

  constructor(private readonly restaurantService:RestaurantService){

  }

  register = async (data: registerDto): Promise<RegisterResponse> => {
    if (data.role === SystemRole.SYSTEM_ADMIN) {
      throw cantSignUPAsSystemAdmin;
    }

    const existing = await findUserExistsByEmailOrPhone(
      data.email,
      data.phone
    );

    if (existing) {
      throw userAlreadyExistsError;
    }

    const hashedPassword = await hashPassword(data.password);
    const now = new Date();


    
    //transaction to control user creation either customer or resturant
const trx=await db.transaction();
let restaurantMemberInfo = null;
  let user: any;
  let restaurant: Restaurant | undefined;
    try{
    //create user --customer 
     user = await createUser({
      email: data.email,
      phone: data.phone,
      name: data.name,
      passwordHash: hashedPassword,
      systemRole: data.role ?? SystemRole.CUSTOMER,
      createdAt: now,
      updatedAt: now,
    }, trx );


//check if the type of user is restaurant 
// then call restaurant service to create new restaurant
if(data.role==SystemRole.RESTAURANT_USER){
  if(data.restaurant==undefined){
    throw restaurantDataRequiredError;
  }
restaurant=await this.restaurantService.create(user.id,data.restaurant, trx);
  
//insert member && set the member info in the payload

if (data.role === SystemRole.RESTAURANT_USER) {

  await this.restaurantService.createOwner(
    user.id,
    restaurant.id!,
    trx
  );

  restaurantMemberInfo = {
    restaurantId: restaurant.id,
    restaurantRole: "OWNER",
    branchIds: []
  };
}

}

  await trx.commit();

    } catch(error){
//if fails, roll back
await trx.rollback();
throw error;
    };


       const payload = {
  userId: user.id,
  role: user.systemRole,
  email: user.email,
  ...(restaurantMemberInfo ?? {}),
};


    const accessToken = createAccessToken(payload);
    const refreshToken = createRefreshToken(payload);

    return {
      message:"registered successfully!",  
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        phone: user.phone,
        systemRole: user.systemRole,
        createdAt:user.createdAt
      },
      restaurant,
    }
  }

login= async (data: loginDto): Promise<RegisterResponse> => { 
    //1- find user by email
    const user= await findUserByEmail(data.email);
    if(!user){
        throw incorrectCredentialsError;
    }
    //2- compare passwords
    const match= await comparePasswords(data.password,user.passwordHash);
    //if password doesnt match throw error 

    if(!match){
    throw paswordMismatchError;
}


//restaurant rbac
let restaurantMemberInfo=null;
const systemRole = (user as any).systemRole ?? (user as any).system_role;
console.log("SYSTEM ROLE", systemRole);

if(systemRole == SystemRole.RESTAURANT_USER){
  const memberData= await findRestaurantMemberWithRole(user.id);
  if (!memberData.member.id) {
    throw memberIdNotFound;
  }
  const branchIds = await findBranchIdsByMemberId(memberData.member.id);

  if (memberData){
    restaurantMemberInfo={
      restaurantId: memberData.member.restaurantId,
      restaurantRole:memberData.roleName,
      branchIds

    }
  }


}

    //generate tokens
    const payload = {
    userId: user.id,
    role: systemRole,
    email: user.email,
    ...(restaurantMemberInfo ?? {}),
};

//console.log("USER SYSTEM ROLE", user.systemRole);
//console.log("LOGIN TOKEN PAYLOAD", payload);

    const accessToken = createAccessToken(payload);
    const refreshToken = createRefreshToken(payload);

    //return data 
    return {
      message:"loggedin successfully!",  
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        phone: user.phone,
        systemRole: user.systemRole,
        createdAt:user.createdAt
      },
    };

}


forgetPassword = async (data: forgetPasswordDTO) => { 
//check id user exists
 const user= await findUserByEmail(data.email);
 if(!user){return;}
//generate an otp
const otp= generateOTP();
//hash the otp 
const hashedOtp= hashOTP(otp)
//insert the otp

//const trx=await db.transaction();
await createPasswordReset({
    userId:user.id,
    otpHash:hashedOtp,
    expiresAt:new Date(Date.now()+10*60*1000),
    createdAt:new Date()
})
//send email 
console.log(`mocked emaiil sent ${otp}`);

}



resetPassword = async (data: resetPasswordDTO) => { 
//find user
const user= await findUserByEmail(data.email);
if(!user){
    throw invalidOTPError;
}
//find reset password
const reset =await findLatestPasswordResetByUserId(user.id);
if (!reset){
    throw invalidOTPError;
}
//verify otp and expiry date
const inputOtpHash=hashOTP(data.otp);
if(inputOtpHash != reset.otpHash || reset.isExpired())
{
    throw invalidOTPError;
}
//update user password 
const newHashPassword=await hashPassword(data.newPassword);
await updateUserPassword(user.id,newHashPassword);
//update reset password
await updatePasswordResetConsumedAt(reset.id);

return user;
}

//refresh 
refreshToken = async (refreshToken: string) => { 
 // verify refresh token
const payload = verifyRefreshToken(refreshToken); 
 // generate new access token 
 const accessToken=createAccessToken(
    {
    userId: payload.userId,
    email: payload.email,
    role: payload.role,
  }
 );
 // return new access token
 return {accessToken};
}



//accept invite
async acceptInvite(data: resetPasswordDTO): Promise<void> {
  //the accept invite step similar to reset password so we called it here
  //confirm email exists
  //check reser_passwords table against the id
//create password
  const user= await this.resetPassword(data);
   //new step: activate user
  await activateMemberByUserId(user.id);
}


}

export const authService=new AuthService(restaurantService);