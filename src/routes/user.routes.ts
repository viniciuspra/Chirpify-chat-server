import { Router } from "express";

import { UsersController } from "./../controllers/UsersController";
import { ensureAuthenticated } from "../middlewares/ensureAuthenticated";

const usersController = new UsersController();

export const userRoutes: Router = Router();

userRoutes.use(ensureAuthenticated);

userRoutes.put("/update", usersController.update);
