import { Request, Response, NextFunction } from "express";
import logger from "../logger/logger.ts";
import AppError from "../error/appError.ts";
export const errorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const operational = err.isOperational;

  logger.error(err.message, {
    stack: err.stack,
    statusCode: err.statusCode,
    operational,
    body: req.body,
    correlationId: req.correlationId,
  });

  if (operational) {
    res.status(err.statusCode).json({
      message: err.message,
    });

    return;
  }

  res.status(500).json({
    message: "Something went wrong",
  });
};