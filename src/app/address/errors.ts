import AppError from "../../common/error/appError";

export const addressAlreadyExistsError =new AppError('address already exists',400);
export const addressNotFoundError=new AppError('address not found',404)
