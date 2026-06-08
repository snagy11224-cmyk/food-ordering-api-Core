import { v4 as uuidv4 } from "uuid";
import { Request, Response, NextFunction } from "express";

export function correlationIdMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
)

{

  const id = uuidv4();

  req.correlationId = id;
  res.setHeader("X-Correlation-Id", id);
  next();
}