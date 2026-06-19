import { userRouter } from './app/user/routes';
import {Router} from "express";
import { healthRoutes } from "./app/health/health.routes.js";
import { authRouter } from "./app/auth/routes.js";
import { addressRouter } from './app/address/router';
import {restaurantRouter} from './app/restaurant/routes'
import { branchRouter } from './app/branch/routes';

export const routes = Router();
routes.use("/health", healthRoutes);
routes.use('/user',userRouter);
routes.use('/auth',authRouter);
routes.use('/customer',addressRouter);
routes.use('/restaurant',restaurantRouter);
routes.use('/',branchRouter)

export default routes;
