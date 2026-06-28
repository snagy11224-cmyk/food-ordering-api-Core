
import AppError from "../../common/error/appError";

export const RestauratntCreationError= new AppError('Restaurant creation failed',400);
export const OwnerRoleNotFoundError= new AppError('Owner role not found',404);
export const RestaurantNotFoundError= new AppError('restaurant not found',404);
export const PermissionDeniedError= new AppError('Permission denied',404);


