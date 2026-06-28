
import AppError from "../../common/error/appError";

export const userNotFoundError =new AppError('user not found',404);
export const notAuthenticatedError=new AppError('user not authorized',403);
export const emptyUpdateBodyError=new AppError('no data to update',400)
export const mobileNumberAlreadyExists=new AppError('mobile number already exxists',400)