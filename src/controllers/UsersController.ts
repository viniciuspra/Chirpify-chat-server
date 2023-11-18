import { Request, Response } from "express";
import { AppError } from "../utils/AppError";
import { prisma } from "../lib/prisma";
import * as crypto from "node:crypto";

export class UsersController {
  async create(req: Request, res: Response) {
    const { fullname, username, password } = req.body;

    if (!username || !password) {
      throw new AppError(
        "Please fill in all required fields for registration."
      );
    }

    const checkIfUserExists = await prisma.user.findFirst({
      where: { username },
    });

    if (checkIfUserExists) {
      throw new AppError(
        "This username is already registered. Please use a different username or try to log in.",
        409
      );
    }

    const salt = crypto.randomBytes(16).toString("hex");

    const hashedPassword = crypto
      .pbkdf2Sync(password, salt, 1000, 64, "sha512")
      .toString("hex");

    const response = await prisma.user.create({
      data: {
        fullname,
        username,
        password: hashedPassword,
        salt,
      },
    });

    return res.json(response);
  }

  async update(req: Request, res: Response) {
    const { fullname, username, password } = req.body;
    const user_id = req.user.id;

    if (!fullname && !username && !password) {
      throw new AppError(
        "No data provided for update. Please provide the information you wish to update."
      );
    }

    const user = await prisma.user.findUnique({
      where: {
        id: user_id,
      },
    });

    if (!user) {
      throw new AppError("User not found.", 404);
    }

    if (fullname) {
      user.fullname = fullname;
    }
    if (username) {
      user.username = username;
    }
    if (password) {
      const salt = crypto.randomBytes(16).toString("hex");
      const hashedPassword = crypto
        .pbkdf2Sync(password, salt, 1000, 64, "sha512")
        .toString("hex");
      user.password = hashedPassword;
      user.salt = salt;
    }

    const response = await prisma.user.update({
      where: { id: user_id },
      data: user,
    });

    return res.json(response);
  }
}
