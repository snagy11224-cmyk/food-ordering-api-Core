import express, { Express } from "express";
import { routes } from "./routes.js";
import { errorHandler } from "./common/error/errorHandler.js";
import cookieParser from 'cookie-parser';


export function createApp(): Express {
  const app = express();

  app.use(express.json());

  app.use(cookieParser())

  app.use("/api", routes);

  app.use(errorHandler);

  return app;
}