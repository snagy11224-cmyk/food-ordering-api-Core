import { Response } from "express";
import { hoursToMs, daysToMs } from "../time/time";


export function setAccessTokenCookie(
  res: Response,
  accessToken: string
): void {
  res.cookie("access-token", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: hoursToMs(1),
  });
}

export function setRefreshTokenCookie(
  res: Response,
  refreshToken: string
): void {
  res.cookie("refresh-token", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: daysToMs(7),
    path: "/api/auth/refresh",
  });
}

export function setAuthCookies(
  res: Response,
  accessToken: string,
  refreshToken: string
): void {
  setAccessTokenCookie(res, accessToken);
  setRefreshTokenCookie(res, refreshToken);
}