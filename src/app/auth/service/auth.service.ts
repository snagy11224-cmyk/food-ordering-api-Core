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
  invalidOTPError
} from "../errors";
import {
  comparePasswords,
  createAccessToken,
  createRefreshToken,
  generateOTP,
  hashOTP,
  hashPassword,
} from "../utils";
import { SystemRole } from "../../user/enums";
import { createPasswordReset, findLatestPasswordResetByUserId, updatePasswordResetConsumedAt } from "../repository/repo.pasword.reset";


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
};

export class AuthService {
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

    const user = await createUser({
      email: data.email,
      phone: data.phone,
      name: data.name,
      passwordHash: hashedPassword,
      systemRole: data.role ?? SystemRole.CUSTOMER,
      createdAt: now,
      updatedAt: now,
    });

    const payload = {
      userId: user.id,
      role: data.role,
      email: user.email,
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
    };
  };

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
    //generate tokens
    const payload = {
      userId: user.id,
      role: user.systemRole,
      email: user.email,
    };

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
await createPasswordReset({
    userId:user.id,
    otpHash:hashedOtp,
    expiresAt:new Date(Date.now()+10*60*60*1000),
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
}



}

export const authService=new AuthService();