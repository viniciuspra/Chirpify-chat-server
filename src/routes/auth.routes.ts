import { Router } from "express";

import { UsersController } from "./../controllers/UsersController";
import { SessionsController } from "./../controllers/SessionsControllers";

const usersController = new UsersController();
const sessionsController = new SessionsController();

export const authRoutes: Router = Router();

authRoutes.post("/register", usersController.create);
authRoutes.post("/sessions", sessionsController.create);
