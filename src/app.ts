import express, { Express } from "express";
import { routes } from "./routes.js";
import { errorHandler } from "./common/error/errorHandler.js";

export function createApp(): Express {
  const app = express();

  app.use(express.json());

  app.use("/api", routes);

  app.use(errorHandler);

  return app;
}