
import AppError from "../../common/error/appError";

export const userNotFoundError =new AppError('user not found',404);
export const notAuthenticatedError=new AppError('user not authorized',404);