import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
  ValidateNested,
  IsIn
} from "class-validator";
import { Type } from "class-transformer";
import { RestaurantStatus } from "../enums/restaurant.enums";


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


export class UpdateRestaurantStatusDTO {
  @IsString()
  @IsNotEmpty()
  @IsIn([
    RestaurantStatus.ACTIVE,
    RestaurantStatus.SUSPENDED,
    RestaurantStatus.DISABLED,
    RestaurantStatus.PENDING,
  ])
  status!: RestaurantStatus;
}