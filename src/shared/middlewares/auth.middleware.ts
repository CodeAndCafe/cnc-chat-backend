import jwt from "jsonwebtoken";
import { ACCESS_TOKEN_SECRET } from "@/configs/env";
import { Request, Response, NextFunction } from "express";
import { HttpException } from "@/shared/exceptions/httpException";
import { ITokenPayload } from "@/shared/interfaces/users.interface";

export const AuthMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies?.accessToken;
  if (!token) {
    return next(new HttpException(401, "User is not authorized or token is missing"));
  }

  jwt.verify(token, ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      return next(new HttpException(401, "User is not authorized"));
    }
    req.user = decoded as ITokenPayload;
    next();
  });
};
