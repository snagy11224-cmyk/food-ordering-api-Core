import { SystemRole } from './../../user/enums';
import { IsEmail, isEnum, IsString, IsStrongPassword, MaxLength, MinLength , IsEnum, IsNotEmpty} from "class-validator";

export class registerDto{
    @IsEmail()
    email!: string;

    @MinLength(10)
    @MaxLength(11)
    phone!: string

    @IsString()
    @IsStrongPassword({
        minLength: 6,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1
    },{message:"Password must be at least 6 characters long and contain at least one uppercase letter, one lowercase letter, one number and one symbol"})
    password!: string;

    @IsString()
    @MinLength(1)
    name!: string;

    @IsEnum(SystemRole)
    role!:SystemRole;
}

export class loginDto{
    @IsEmail()
    email!: string;

    @IsString()
    @IsNotEmpty()
    password!: string;

}

export class forgetPasswordDTO{
    @IsEmail()
    email!: string;
}