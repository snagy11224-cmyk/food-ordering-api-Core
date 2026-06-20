
import AppError from "../../common/error/appError";

export const CanNotCreateOwnerUserError = new AppError('not allowed to create another owner user',400);
export const RoleNotFound =new AppError('Role Not Found',404);
export const MemberNotFound =new AppError('member Not Found',404);
export const CanNotAssignBranchesToOwnerError =new AppError("can't assign branches to owner",400)