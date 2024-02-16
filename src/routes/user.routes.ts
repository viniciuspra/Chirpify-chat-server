import { Router } from "express";
import multer from "multer";
import { MULTER } from "../configs/upload";

import { UsersController } from "./../controllers/UsersController";
import { UsersAvatarController } from "./../controllers/UserAvatarController";
import { ensureAuthenticated } from "../middlewares/ensureAuthenticated";

const usersController = new UsersController();
const usersAvatarController = new UsersAvatarController();

export const userRoutes: Router = Router();

const upload = multer(MULTER);

userRoutes.use(ensureAuthenticated);

userRoutes.put("/update", usersController.update);
userRoutes.patch(
  "/avatar",
  upload.single("file"),
  usersAvatarController.update
);
