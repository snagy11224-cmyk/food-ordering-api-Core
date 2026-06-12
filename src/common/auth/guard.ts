import { NextFunction, Request, Response } from 'express';
import{notAuthenticatedError} from "../../../src/app/user/errors"
import { verifyAccessToken } from '../../app/auth/utils';

export function authenticate(req:Request,res:Response,next:NextFunction) {
    const token = req.cookies["access-token"];
    if(!token)
    {
        throw notAuthenticatedError;
    }

    req.user=verifyAccessToken(token);
    next();
}