import { Request, Response } from "express";

import { AppError } from "../utils/AppError";
import * as bcrypt from "bcrypt";
import { prisma } from "../lib/prisma";

import authConfig from "../configs/auth";
import { sign } from "jsonwebtoken";

export class SessionsController {
  async create(req: Request, res: Response) {
    const { username, password } = req.body;

    const user = await prisma.user.findFirst({
      where: {
        username,
      },
    });

    if (!user) {
      throw new AppError(
        "Username not found or incorrect password. Please check your credentials and try again.",
        401
      );
    }

    const isValidPassword = bcrypt.compareSync(password, user.password);

    if (!isValidPassword) {
      throw new AppError(
        "Username not found or incorrect password. Please check your credentials and try again.",
        401
      );
    }

    const { secret, expiresIn } = authConfig.jwt;
    const token = sign({}, secret, {
      subject: user.id,
      expiresIn,
    });

    return res.json({ user, token });
  }
}
