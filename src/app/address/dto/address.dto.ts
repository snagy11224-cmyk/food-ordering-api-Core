import {IsOptional,IsString, IsEnum, IsNumber , IsBoolean} from "class-validator";
import { AddressType } from "../../address/enums";

export class CreateAddressDTO {
@IsString()
addressLine1!: string;

  @IsString()
  label!: string;

  @IsString()
  country!: string;

  @IsString()
  city!: string;

  @IsString()
  street!: string;

  @IsOptional()
  @IsString()
  building?: string;

  @IsOptional()
  @IsString()
  apartmentNumber?: string;

  @IsEnum(AddressType)
  type!: AddressType;

  @IsNumber()
  lat!: number;

  @IsNumber()
  lng!: number;

  @IsBoolean()
  isDefault!: boolean;
}