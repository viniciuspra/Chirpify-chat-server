import { Request, Response, response } from "express";
import { AppError } from "../utils/AppError";
import { prisma } from "../lib/prisma";
import * as bcrypt from "bcrypt";

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

    const hashedPassword = bcrypt.hashSync(password, 10);

    const response = await prisma.user.create({
      data: {
        fullname,
        username,
        password: hashedPassword,
      },
    });

    return res.json(response);
  }

  async update(req: Request, res: Response) {
    const { fullname, newPassword, oldPassword } = req.body;
    const user_id = req.user.id;

    if (!fullname && !newPassword && !oldPassword) {
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
      if (fullname.length < 3 || fullname.trim() === "") {
        throw new AppError("Fullname must be at least 3 characters.");
      }
      user.fullname = fullname;
    }

    if (newPassword && newPassword.trim() === "") {
      throw new AppError("New password cannot be blank.");
    }

    if (newPassword && !oldPassword) {
      throw new AppError(
        "You need to provide the old password to set a new password."
      );
    }

    if (newPassword && oldPassword) {
      const isValidPassword = bcrypt.compareSync(oldPassword, user.password);

      if (!isValidPassword) {
        throw new AppError("Old password does not match.");
      }
      const hashedPassword = bcrypt.hashSync(newPassword, 10);

      user.password = hashedPassword;
    }

    const response = await prisma.user.update({
      where: { id: user_id },
      data: user,
    });

    return res.json(response);
  }
}
