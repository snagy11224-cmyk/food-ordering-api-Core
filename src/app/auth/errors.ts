import AppError from "../../common/error/appError";

export const userAlreadyExistsError= new AppError('User Already Exists',400);

export const cantSignUPAsSystemAdmin = new AppError('You can not register as a system admin',403);