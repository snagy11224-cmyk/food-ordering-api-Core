import express, { Express } from "express";
import { routes } from "./routes.js";

export function createApp(): Express {
  const app = express();

  app.use(express.json());

  app.use("/api", routes);

  return app;
}