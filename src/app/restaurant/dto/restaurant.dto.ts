import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
  ValidateNested,
} from "class-validator";
import { Type } from "class-transformer";

export class CreateRestaurantOwnerDTO {
  @IsEmail()
  email!: string;

  @IsString()
  @IsNotEmpty()
  phone!: string;

  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @MinLength(6)
  password!: string;
}

export class CreateRestaurantDTO {
  @ValidateNested()
  @Type(() => CreateRestaurantOwnerDTO)
  owner!: CreateRestaurantOwnerDTO;

  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsOptional()
  logoUrl?: string;

  @IsString()
  @IsNotEmpty()
  primaryCountry!: string;
}


export class UpdateRestaurantDTO {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name?: string;

  @IsOptional()
  @IsString()
  logoUrl?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  primaryCountry?: string;
}