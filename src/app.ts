import express, { Express } from "express";
import { routes } from "./routes.js";
import { errorHandler } from "./common/error/errorHandler.js";
import cookieParser from "cookie-parser";

import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";

export function createApp(): Express {
  const app = express();

  app.use(express.json());
  app.use(cookieParser());

  const swaggerSpec = swaggerJsdoc({
    definition: {
      openapi: "3.0.0",
      info: {
        title: "Online Food Ordering Service",
        version: "1.0.0",
      },
    },
    apis: ["./src/**/*.ts"],
  });

  app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec)
  );

  app.use("/api", routes);

  app.use(errorHandler);

  return app;
}