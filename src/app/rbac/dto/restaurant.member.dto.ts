import {
  IsEmail,
  IsString,
  IsNotEmpty,
  IsEnum,
  IsOptional,
  IsStrongPassword,
  MinLength,
  MaxLength,
  IsArray,
} from "class-validator";
import { RestaurantRole } from "../enums";

export class CreateRestaurantMemberDTO {
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @MinLength(10)
  @MaxLength(11)
    @IsNotEmpty()
      @IsString()
  phone!: string;

  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsStrongPassword({
    minLength: 6,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
  })
  password!: string;

    @IsString()
    @IsNotEmpty()
  role!: string;


  @IsArray()
  @IsOptional()
  branchIds!:number[];
}