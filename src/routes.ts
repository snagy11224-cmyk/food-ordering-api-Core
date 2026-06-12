import { userRouter } from './app/user/routes';
import {Router} from "express";
import { healthRoutes } from "./app/health/health.routes.js";
import { authRouter } from "./app/auth/routes.js";

export const routes = Router();
routes.use("/health", healthRoutes);
routes.use('/user',userRouter);
routes.use('/auth',authRouter);
export default routes;
