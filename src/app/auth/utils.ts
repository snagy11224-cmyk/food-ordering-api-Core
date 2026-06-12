import bcrypt from "bcrypt";
import jwt, { SignOptions } from "jsonwebtoken";
import { env } from "../../common/config/env";
import crypto from "crypto"; 

type JwtExpiresIn = SignOptions["expiresIn"];


export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export interface AuthJwtPayload {
  userId: number;
  email: string;
  role: string;
}

export function createAccessToken(payload: AuthJwtPayload): string {
  return jwt.sign(payload, env.jwt.accessSecret, {
    expiresIn: env.jwt.accessExpires as JwtExpiresIn,
  });
}

export function createRefreshToken(payload: AuthJwtPayload): string {
  return jwt.sign(payload, env.jwt.refreshSecret, {
    expiresIn: env.jwt.refreshExpires as JwtExpiresIn,
  });
}

export function comparePasswords(passwordInput:string, hshedPassword:string){
return bcrypt.compare(passwordInput,hshedPassword)
}

//
export function generateOTP() :string{
    return crypto.randomInt(100000,999999).toString();

}

export function hashOTP(otp:string) {
    return crypto.createHash("sha256").update(otp).digest("hex")

}