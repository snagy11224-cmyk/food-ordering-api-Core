import { IsBoolean, IsEnum, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min } from "class-validator";
import { Currency } from "../enums";

export class CreateBranchDTO {
  @IsString()
  @IsNotEmpty()
  countryCode!: string;

  @IsString()
  @IsNotEmpty()
  addressText!: string;

  @IsString()
  @IsNotEmpty()
  label!: string;

  @IsNumber()
  @Min(-90)
  @Max(90)
  lat!: number;

  @IsNumber()
  @Min(-180)
  @Max(180)
  lng!: number;

  @IsString()
  @IsNotEmpty()
  opensAt!: string;

  @IsString()
  @IsNotEmpty()
  closesAt!: string;

  @IsOptional()
  @IsBoolean()
  acceptOrders?: boolean;

  @IsInt()
  @Min(0)
  deliveryRadius!: number;

  @IsEnum(Currency)
  currency!: Currency;

  @IsOptional()
  @IsNumber()
  commission?: number;
}


export class UpdateBranchDTO {
  @IsOptional()
  @IsString()
  label?: string;

  @IsOptional()
  @IsString()
  addressText?: string;

  @IsOptional()
  @IsNumber()
  lat?: number;

  @IsOptional()
  @IsNumber()
  lng?: number;

  @IsOptional()
  @IsString()
  opensAt?: string;

  @IsOptional()
  @IsString()
  closesAt?: string;

  @IsOptional()
  @IsNumber()
  deliveryRadius?: number;

  @IsOptional()
  @IsString()
  currency?: Currency;

  @IsOptional()
  @IsBoolean()
  acceptOrders?: boolean;
}

export class UpdateBranchStatusDTO {
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsNumber()
  commission?: number;
}
