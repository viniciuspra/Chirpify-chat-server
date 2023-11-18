import { Request, Response } from "express";

import { AppError } from "../utils/AppError";
import { pbkdf2Sync } from "node:crypto";
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

    const salt = user.salt;

    const hashedPassword = pbkdf2Sync(
      password,
      salt,
      1000,
      64,
      "sha512"
    ).toString("hex");

    if (hashedPassword !== user.password) {
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
