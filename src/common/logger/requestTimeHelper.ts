import { Request, Response, NextFunction } from "express";
import logger from "../../common/logger/logger.js";

const THRESHOLD_MS =
  Number(process.env.SLOW_REQUEST_THRESHOLD_MS) || 500;

export const slowRequestMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const start = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - start;

    if (duration > THRESHOLD_MS) {
      logger.warn("Slow request detected", {
        method: req.method,
        url: req.originalUrl,
        durationMs: duration,
        correlationId: req.correlationId,
        statusCode: res.statusCode,
      });
    }
  });

  next();
};