import { Request, Response } from "express";
import { AppError } from "../utils/AppError";
import { prisma } from "../lib/prisma";
import DiskStorage from "../providers/DiskStorage";

export class UsersAvatarController {
  async update(req: Request, res: Response) {
    const user_id = req.user.id;
    const avatarFileName = req.file?.filename;

    const diskStorage = new DiskStorage();

    const user = await prisma.user.findUnique({
      where: {
        id: user_id,
      },
    });

    if (!user) {
      throw new AppError("User not found.", 404);
    }

    if (user.avatar) {
      await diskStorage.deleteFile(user.avatar);
    }

    if (!avatarFileName) {
      throw new AppError("Avatar file not found.", 404);
    }

    const fileName = await diskStorage.saveFile(avatarFileName);
    user.avatar = fileName;

    const response = await prisma.user.update({
      where: { id: user_id },
      data: user,
    });

    return res.json(response.avatar);
  }
}
