import AppError from "../../common/error/appError";

export const userAlreadyExistsError= new AppError('User Already Exists',400);

export const cantSignUPAsSystemAdmin = new AppError('You can not register as a system admin',403);

export const incorrectCredentialsError  = new AppError('incorrect email or password',401);
export const paswordMismatchError =new AppError('Pssword mismatch',400);
export const invalidOTPError =new AppError('invalid OTP',400);
export const UnauthorizedError = new AppError('Refresh token is missing',400)