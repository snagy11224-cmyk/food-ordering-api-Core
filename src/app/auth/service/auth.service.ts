import { loginDto, registerDto } from "../dto/auth.dto";
import {
  findUserExistsByEmailOrPhone,
  createUser,
  findUserByEmail,
} from "../../user/repository/users.repo";
import {
    paswordMismatchError,
  userAlreadyExistsError,
  cantSignUPAsSystemAdmin,
  incorrectCredentialsError
} from "../errors";
import {
  comparePasswords,
  createAccessToken,
  createRefreshToken,
  hashPassword,
} from "../utils";
import { SystemRole } from "../../user/enums";


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


}

export const authService=new AuthService();