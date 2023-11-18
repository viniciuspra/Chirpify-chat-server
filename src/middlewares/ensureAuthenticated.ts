import { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/AppError";
import { verify } from "jsonwebtoken";
import authConfig from "../configs/auth";

interface DecodedToken {
  sub: string;
}

declare global {
  namespace Express {
    interface Request {
      user: {
        id: string;
      };
    }
  }
}

export function ensureAuthenticated(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    throw new AppError(
      "JWT token not provided. Please log in to obtain a valid token.",
      401
    );
  }

  const [, token] = authHeader.split(" ");

  const { sub: user_id } = verify(token, authConfig.jwt.secret) as DecodedToken;

  req.user = {
    id: user_id,
  };

  return next();
}
