import {
  ArrayNotEmpty,
  IsArray,
  IsInt,
} from "class-validator";
import { Type } from "class-transformer";

export class UpdateMemberBranchesDTO {
  @IsArray()
  @ArrayNotEmpty()
  @Type(() => Number)
  @IsInt({ each: true })
  branchIds!: number[];
}