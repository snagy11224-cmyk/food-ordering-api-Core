import { registerDto } from "../dto/auth.dto";
import {
  findUserExistsByEmailOrPhone,
  createUser,
} from "../../user/repository/users.repo";
import {
  userAlreadyExistsError,
  cantSignUPAsSystemAdmin,
} from "../errors";
import {
  createAccessToken,
  createRefreshToken,
  hashPassword,
} from "../utils";
import { SystemRole } from "../../user/enums";

type RegisterResponse = {
  accessToken: string;
  refreshToken: string;
  user: {
    id: number;
    email: string;
    phone: string;
    systemRole: SystemRole;
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
      role: user.systemRole,
      email: user.email,
    };

    const accessToken = createAccessToken(payload);
    const refreshToken = createRefreshToken(payload);

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        phone: user.phone,
        systemRole: user.systemRole,
      },
    };
  };
}

export const authService=new AuthService();