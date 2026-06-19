import { Router } from "express";
import { restaurantController } from "./controller/restaurant.controller";
export const restaurantRouter =Router();

restaurantRouter.get('/', restaurantController.getAll) //you can add auth if private endpoint -- for now its public