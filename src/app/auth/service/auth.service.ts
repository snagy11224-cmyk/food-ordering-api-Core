import { registerDto } from '../dto/auth.dto';
import { findUserByEmail } from '../../user/repository/users.repo';
export class AuthService {
register : (data: registerDto) => Promise<void> = async (data: registerDto): Promise<void> => {
//1. check if user with email or phone already exists, if yes throw error
const existing = await findUserByEmail(data.email);

//2. else hash the password

//3. create user in database

//4. create jwt token and return to user

//5. return user data and tokens

  }
    
}