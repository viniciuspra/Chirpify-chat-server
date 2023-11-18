import { Router } from "express";

import { authRoutes } from "./auth.routes";

export const routes: Router = Router();

routes.use("/api/auth", authRoutes);
