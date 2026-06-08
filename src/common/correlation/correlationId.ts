import { v4 as uuidv4 } from "uuid";
import { Request, Response, NextFunction } from "express";

export function correlationIdMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const correlationId = uuidv4();

  req.correlationId = correlationId;
  res.setHeader("X-Correlation-Id", correlationId);

  next();
}