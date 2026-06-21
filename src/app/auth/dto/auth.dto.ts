import { Type } from 'class-transformer';
import { SystemRole } from './../../user/enums';
import { IsEmail, IsString, IsStrongPassword, MaxLength, MinLength , IsEnum, IsNotEmpty, Length, IsOptional, ValidateNested} from "class-validator";

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

    @IsOptional()
    @ValidateNested()
    @Type(()=>registerRestaurantDto)
    restaurant?:registerRestaurantDto;
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

export class resetPasswordDTO{
    @IsEmail()
    email!: string;

    @IsString()
    @Length(6)
    otp!:string

    @IsString()
    @IsStrongPassword({
        minLength: 6,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1
    },{message:"Password must be at least 6 characters long and contain at least one uppercase letter, one lowercase letter, one number and one symbol"})
    newPassword!: string;
}


//register restaurant 
export class registerRestaurantDto{

    @IsString()
    @MinLength(1)
    name!: string;

    @IsOptional()
    @IsString()
    logoUrl?: string;

    @IsString()
    @MinLength(1)
    primaryCountry!:string;


}

