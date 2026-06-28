
import AppError from "../../common/error/appError";

export const RestauranNotFoundError =new AppError('Restaurant not found',404);
export const BranchNotFoundError =new AppError('Branch not found',404);
