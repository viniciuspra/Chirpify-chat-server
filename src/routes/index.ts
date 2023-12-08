import { Router } from "express";

import { authRoutes } from "./auth.routes";
import { userRoutes } from "./user.routes";

export const routes: Router = Router();

routes.use("/auth", authRoutes);
routes.use("/user", userRoutes);
