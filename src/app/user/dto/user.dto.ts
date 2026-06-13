import {IsOptional,IsString, MaxLength, MinLength} from "class-validator";

export class updateUserDTO{
    @IsString()
    @IsOptional()
    name?: string;

    @IsString()
    @MaxLength(11)
    @MinLength(10)
    @IsOptional()
    phone?: string;

}
